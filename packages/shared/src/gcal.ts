// FR-4.1 two-way sync. Conflict rule: our own bookings table is always
// authoritative for slots we've booked (no ambiguity there — the unique index
// already prevents us double-booking ourselves). The "two-way" part is
// reading the owner's *personal* Google Calendar so we don't offer a slot
// they've manually blocked off outside our system. Push side creates/updates/
// deletes a mirror event on booking/reschedule/cancel; pull side is a
// freebusy check folded into availability. Re-auth banner (expired refresh
// token) is owner-app UI — Phase 4, not built here.
import type { SupabaseClient } from "@supabase/supabase-js";

export interface GoogleCreds {
  clientId: string;
  clientSecret: string;
}

interface StoredTokens {
  access_token: string;
  refresh_token?: string;
  expires_at: string;
}

async function getValidAccessToken(supabase: SupabaseClient, google: GoogleCreds, accountId: string): Promise<string | null> {
  const { data: profile } = await supabase.from("business_profile").select("gcal_credentials").eq("account_id", accountId).maybeSingle();
  const tokens = profile?.gcal_credentials as StoredTokens | null;
  if (!tokens) return null; // account hasn't connected Google Calendar — sync is optional, not required

  if (new Date(tokens.expires_at).getTime() > Date.now() + 60_000) return tokens.access_token;
  if (!tokens.refresh_token) return null; // expired and can't refresh — needs re-auth (Phase 4 banner)

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      refresh_token: tokens.refresh_token,
      client_id: google.clientId,
      client_secret: google.clientSecret,
      grant_type: "refresh_token",
    }),
  });
  if (!res.ok) return null;
  const refreshed = (await res.json()) as { access_token: string; expires_in: number };

  await supabase
    .from("business_profile")
    .update({
      gcal_credentials: {
        access_token: refreshed.access_token,
        refresh_token: tokens.refresh_token,
        expires_at: new Date(Date.now() + refreshed.expires_in * 1000).toISOString(),
      },
    })
    .eq("account_id", accountId);

  return refreshed.access_token;
}

export async function pushBookingToCalendar(
  supabase: SupabaseClient,
  google: GoogleCreds,
  input: { accountId: string; bookingId: string; existingEventId: string | null; summary: string; startsAt: string; endsAt: string },
): Promise<void> {
  const accessToken = await getValidAccessToken(supabase, google, input.accountId);
  if (!accessToken) return; // not connected — sync is best-effort, never blocks the booking itself

  const body = JSON.stringify({
    summary: input.summary,
    start: { dateTime: input.startsAt },
    end: { dateTime: input.endsAt },
  });
  const url = input.existingEventId
    ? `https://www.googleapis.com/calendar/v3/calendars/primary/events/${input.existingEventId}`
    : `https://www.googleapis.com/calendar/v3/calendars/primary/events`;

  const res = await fetch(url, {
    method: input.existingEventId ? "PATCH" : "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body,
  });
  if (!res.ok) {
    console.error(`Google Calendar sync failed for booking ${input.bookingId}: ${res.status}`);
    return;
  }
  const event = (await res.json()) as { id: string };
  if (!input.existingEventId) {
    await supabase.from("bookings").update({ gcal_event_id: event.id }).eq("id", input.bookingId);
  }
}

export async function removeBookingFromCalendar(
  supabase: SupabaseClient,
  google: GoogleCreds,
  accountId: string,
  eventId: string | null,
): Promise<void> {
  if (!eventId) return;
  const accessToken = await getValidAccessToken(supabase, google, accountId);
  if (!accessToken) return;
  await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${accessToken}` },
  }).catch((err) => console.error("Google Calendar delete failed:", err));
}

// Pull side: which of these candidate slots overlap an event already on the
// owner's personal calendar (manually created, outside our booking system)?
// Real interval overlap (slot.start < busy.end && slot.end > busy.start) —
// checking only the slot's start instant against the busy range (the
// original version) misses a slot that starts before a personal event but
// runs into it, e.g. a 60-min job starting 2:00 with a personal appointment
// 2:30-2:45 was never flagged, silently double-booking the owner's calendar.
export async function busySlotsFromCalendar(
  supabase: SupabaseClient,
  google: GoogleCreds,
  accountId: string,
  candidates: { start: Date; end: Date }[],
): Promise<Set<string>> {
  const busy = new Set<string>();
  if (candidates.length === 0) return busy;

  const accessToken = await getValidAccessToken(supabase, google, accountId);
  if (!accessToken) return busy; // not connected — no personal-calendar conflicts to check

  const timeMin = candidates[0].start.toISOString();
  const timeMax = new Date(Math.max(...candidates.map((c) => c.end.getTime()))).toISOString();

  const res = await fetch("https://www.googleapis.com/calendar/v3/freeBusy", {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({ timeMin, timeMax, items: [{ id: "primary" }] }),
  });
  if (!res.ok) return busy;
  const data = (await res.json()) as { calendars?: { primary?: { busy?: { start: string; end: string }[] } } };
  const busyRanges = data.calendars?.primary?.busy ?? [];

  for (const slot of candidates) {
    const overlaps = busyRanges.some(
      (r) => slot.start.getTime() < new Date(r.end).getTime() && slot.end.getTime() > new Date(r.start).getTime(),
    );
    if (overlaps) busy.add(slot.start.toISOString());
  }
  return busy;
}
