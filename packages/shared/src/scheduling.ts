// Real slotting engine (PRD FR-4.2, FR-4.3, FR-4.5, FR-4.8) — Phase 2's fixed
// 9/1/3 stub is gone. Business hours per weekday, job duration + travel
// buffer, max jobs/day, service-area enforcement, same-day exemption for
// EMERGENCY, and a real atomic hold with 90s expiry.
import type { SupabaseClient } from "@supabase/supabase-js";
import { logEvent } from "./analytics.js";
import { zonedTimeToUtc, dateKeyInZone, dayKeyInZone } from "./tz.js";
import { busySlotsFromCalendar, pushBookingToCalendar, removeBookingFromCalendar, type GoogleCreds } from "./gcal.js";

export interface DayHours {
  open: string; // "HH:MM"
  close: string; // "HH:MM"
}
export interface BusinessHoursConfig {
  mon?: DayHours | null;
  tue?: DayHours | null;
  wed?: DayHours | null;
  thu?: DayHours | null;
  fri?: DayHours | null;
  sat?: DayHours | null;
  sun?: DayHours | null;
  max_jobs_per_day?: number;
}

const HOLD_EXPIRY_MS = 90_000;

// Lazy TTL: no cron/worker needed — expire stale holds inline on the two paths
// that care whether a slot is really free (check + confirm). ponytail: this
// scans all held rows account-wide on every call; fine at this volume, add a
// per-account index or a real sweeper if hold volume ever gets large.
async function expireStaleHolds(supabase: SupabaseClient): Promise<void> {
  await supabase
    .from("bookings")
    .update({ status: "canceled" })
    .eq("status", "held")
    .lt("held_at", new Date(Date.now() - HOLD_EXPIRY_MS).toISOString());
}

function slotsForDay(dateKey: string, hours: DayHours, durationMin: number, bufferMin: number, timeZone: string): Date[] {
  const [openH, openM] = hours.open.split(":").map(Number);
  const [closeH, closeM] = hours.close.split(":").map(Number);
  const openMinutes = openH * 60 + openM;
  const closeMinutes = closeH * 60 + closeM;
  const step = durationMin + bufferMin;

  const slots: Date[] = [];
  for (let m = openMinutes; m + durationMin <= closeMinutes; m += step) {
    const hh = String(Math.floor(m / 60)).padStart(2, "0");
    const mm = String(m % 60).padStart(2, "0");
    slots.push(zonedTimeToUtc(dateKey, `${hh}:${mm}`, timeZone));
  }
  return slots;
}

export async function checkAvailability(
  supabase: SupabaseClient,
  accountId: string,
  jobTypeId: string,
  opts: {
    hours: BusinessHoursConfig;
    timeZone: string;
    durationMin: number;
    bufferMin: number;
    allowSameDay: boolean;
    google?: GoogleCreds;
  },
): Promise<{ slot_id: string; starts_at: string }[]> {
  await expireStaleHolds(supabase);

  const candidates: Date[] = [];
  const startOffsetDays = opts.allowSameDay ? 0 : 1;
  for (let d = startOffsetDays; d < 21 && candidates.length < 60; d++) {
    const probe = new Date(Date.now() + d * 86_400_000);
    const dateKey = dateKeyInZone(probe, opts.timeZone);
    const dayHours = opts.hours[dayKeyInZone(probe, opts.timeZone)];
    if (!dayHours) continue;
    candidates.push(...slotsForDay(dateKey, dayHours, opts.durationMin, opts.bufferMin, opts.timeZone));
  }

  const { data: taken } = await supabase
    .from("bookings")
    .select("starts_at")
    .eq("account_id", accountId)
    .eq("job_type_id", jobTypeId)
    .in("status", ["held", "confirmed", "rescheduled"]); // rescheduled still occupies its current slot
  const takenTimes = new Set((taken ?? []).map((b) => new Date(b.starts_at).toISOString()));

  const maxPerDay = opts.hours.max_jobs_per_day;
  const countPerDay = new Map<string, number>();
  if (maxPerDay) {
    for (const b of taken ?? []) {
      const key = dateKeyInZone(new Date(b.starts_at), opts.timeZone);
      countPerDay.set(key, (countPerDay.get(key) ?? 0) + 1);
    }
  }

  // Two-way sync, pull side: don't offer a slot the owner has personally
  // blocked off in their own Google Calendar, outside our booking system.
  const busyOnPersonalCalendar = opts.google
    ? await busySlotsFromCalendar(supabase, opts.google, accountId, candidates)
    : new Set<string>();

  const results: { slot_id: string; starts_at: string }[] = [];
  for (const slot of candidates) {
    if (slot.getTime() <= Date.now()) continue;
    if (takenTimes.has(slot.toISOString())) continue;
    if (busyOnPersonalCalendar.has(slot.toISOString())) continue;
    if (maxPerDay) {
      const key = dateKeyInZone(slot, opts.timeZone);
      if ((countPerDay.get(key) ?? 0) >= maxPerDay) continue;
    }
    results.push({ slot_id: slot.toISOString(), starts_at: slot.toISOString() });
    if (results.length >= 3) break;
  }
  return results;
}

export async function holdSlot(
  supabase: SupabaseClient,
  accountId: string,
  jobTypeId: string,
  slotId: string,
  durationMin: number,
): Promise<{ held: true } | { held: false; reason: string }> {
  await expireStaleHolds(supabase);
  const startsAt = new Date(slotId);
  const endsAt = new Date(startsAt.getTime() + durationMin * 60_000);

  // Unique partial index (account_id, job_type_id, starts_at) where status in
  // (held, confirmed) is what actually makes this atomic — a concurrent hold
  // on the same slot fails at the DB level, not in application code.
  const { error } = await supabase.from("bookings").insert({
    account_id: accountId,
    job_type_id: jobTypeId,
    starts_at: startsAt.toISOString(),
    ends_at: endsAt.toISOString(),
    status: "held",
    source: "ai_call",
  });
  return error ? { held: false, reason: "slot was just taken, offer a different one" } : { held: true };
}

export async function bookJob(
  supabase: SupabaseClient,
  input: {
    accountId: string;
    jobTypeId: string;
    slotId: string;
    customerName: string;
    customerPhoneE164: string;
    address: { line1: string; line2?: string; city: string; state: string; zip: string; access_notes?: string };
    durationMin: number;
    serviceAreaZips?: string[];
    jobTypeName?: string;
    google?: GoogleCreds;
  },
): Promise<{ booking_id: string } | { error: string; out_of_area?: boolean }> {
  await expireStaleHolds(supabase);

  if (input.serviceAreaZips && input.serviceAreaZips.length > 0 && !input.serviceAreaZips.includes(input.address.zip)) {
    await logEvent(supabase, input.accountId, "out_of_area_lead", { zip: input.address.zip, job_type_id: input.jobTypeId });
    return { error: `${input.address.zip} is outside the service area`, out_of_area: true };
  }

  const { data: customer, error: customerErr } = await supabase
    .from("customers")
    .upsert(
      { account_id: input.accountId, name: input.customerName, phone_e164: input.customerPhoneE164 },
      { onConflict: "account_id,phone_e164" },
    )
    .select("id")
    .single();
  if (customerErr || !customer) return { error: `customer upsert failed: ${customerErr?.message}` };

  const { data: address, error: addressErr } = await supabase
    .from("addresses")
    .insert({ customer_id: customer.id, ...input.address })
    .select("id")
    .single();
  if (addressErr || !address) return { error: `address insert failed: ${addressErr?.message}` };

  const startsAt = new Date(input.slotId);

  // Confirm an existing hold on this exact slot if one exists (the normal
  // check_availability -> hold_slot -> book_job flow); otherwise insert fresh
  // (still atomic via the same unique index, for flows that skip the hold step).
  const { data: existingHold } = await supabase
    .from("bookings")
    .select("id")
    .eq("account_id", input.accountId)
    .eq("job_type_id", input.jobTypeId)
    .eq("starts_at", startsAt.toISOString())
    .eq("status", "held")
    .maybeSingle();

  const endsAt = new Date(startsAt.getTime() + input.durationMin * 60_000);
  const summary = `${input.jobTypeName ?? "Job"} — ${input.customerName}`;

  if (existingHold) {
    const { error } = await supabase
      .from("bookings")
      .update({ customer_id: customer.id, address_id: address.id, status: "confirmed" })
      .eq("id", existingHold.id)
      .eq("status", "held"); // guard against a race with expireStaleHolds
    if (error) return { error: `slot no longer available: ${error.message}` };
    if (input.google) {
      await pushBookingToCalendar(supabase, input.google, {
        accountId: input.accountId,
        bookingId: existingHold.id,
        existingEventId: null,
        summary,
        startsAt: startsAt.toISOString(),
        endsAt: endsAt.toISOString(),
      });
    }
    return { booking_id: existingHold.id };
  }

  const { data: booking, error: bookingErr } = await supabase
    .from("bookings")
    .insert({
      account_id: input.accountId,
      customer_id: customer.id,
      address_id: address.id,
      job_type_id: input.jobTypeId,
      starts_at: startsAt.toISOString(),
      ends_at: endsAt.toISOString(),
      status: "confirmed",
      source: "ai_call",
    })
    .select("id")
    .single();
  if (bookingErr || !booking) return { error: `slot no longer available: ${bookingErr?.message}` };

  if (input.google) {
    await pushBookingToCalendar(supabase, input.google, {
      accountId: input.accountId,
      bookingId: booking.id,
      existingEventId: null,
      summary,
      startsAt: startsAt.toISOString(),
      endsAt: endsAt.toISOString(),
    });
  }

  return { booking_id: booking.id };
}

export async function lookupCaller(
  supabase: SupabaseClient,
  accountId: string,
  phoneE164: string,
): Promise<{ known: false } | { known: true; name: string | null; last_address: Record<string, unknown> | null }> {
  const { data: customer } = await supabase
    .from("customers")
    .select("id, name")
    .eq("account_id", accountId)
    .eq("phone_e164", phoneE164)
    .maybeSingle();
  if (!customer) return { known: false };

  const { data: lastBooking } = await supabase
    .from("bookings")
    .select("address_id")
    .eq("customer_id", customer.id)
    .order("held_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  let lastAddress: Record<string, unknown> | null = null;
  if (lastBooking?.address_id) {
    const { data: address } = await supabase
      .from("addresses")
      .select("line1, line2, city, state, zip")
      .eq("id", lastBooking.address_id)
      .maybeSingle();
    lastAddress = address ?? null;
  }
  return { known: true, name: customer.name, last_address: lastAddress };
}

export async function rescheduleBooking(
  supabase: SupabaseClient,
  accountId: string,
  bookingId: string,
  newSlotId: string,
  google?: GoogleCreds,
): Promise<{ ok: true } | { error: string }> {
  const { data: existing, error: fetchErr } = await supabase
    .from("bookings")
    .select("gcal_event_id, job_types(duration_min, name)")
    .eq("id", bookingId)
    .eq("account_id", accountId)
    .single();
  if (fetchErr || !existing) return { error: `booking not found: ${fetchErr?.message}` };

  const row = existing as unknown as { gcal_event_id: string | null; job_types: { duration_min: number; name: string } };
  const startsAt = new Date(newSlotId);
  const endsAt = new Date(startsAt.getTime() + row.job_types.duration_min * 60_000);

  const { error: updateErr } = await supabase
    .from("bookings")
    .update({ starts_at: startsAt.toISOString(), ends_at: endsAt.toISOString(), status: "rescheduled" })
    .eq("id", bookingId)
    .eq("account_id", accountId);
  if (updateErr) return { error: `new slot no longer available: ${updateErr.message}` };

  if (google) {
    await pushBookingToCalendar(supabase, google, {
      accountId,
      bookingId,
      existingEventId: row.gcal_event_id,
      summary: row.job_types.name,
      startsAt: startsAt.toISOString(),
      endsAt: endsAt.toISOString(),
    });
  }
  return { ok: true };
}

export async function cancelBooking(
  supabase: SupabaseClient,
  accountId: string,
  bookingId: string,
  google?: GoogleCreds,
): Promise<{ ok: true } | { error: string }> {
  const { data: existing } = await supabase.from("bookings").select("gcal_event_id").eq("id", bookingId).eq("account_id", accountId).maybeSingle();
  const { error } = await supabase.from("bookings").update({ status: "canceled" }).eq("id", bookingId).eq("account_id", accountId);
  if (error) return { error: error.message };

  if (google && existing?.gcal_event_id) {
    await removeBookingFromCalendar(supabase, google, accountId, existing.gcal_event_id);
  }
  return { ok: true };
}
