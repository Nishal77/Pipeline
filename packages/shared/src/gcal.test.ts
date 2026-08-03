import { test } from "node:test";
import assert from "node:assert/strict";
import { getGoogleCalendarStatus, pushBookingToCalendar } from "./gcal.js";

function fakeSupabase(gcal_credentials: unknown) {
  const updates: Record<string, unknown>[] = [];
  return {
    updates,
    from: () => ({
      select: () => ({
        eq: () => ({
          maybeSingle: () => Promise.resolve({ data: { gcal_credentials } }),
        }),
      }),
      update: (values: Record<string, unknown>) => ({
        eq: () => {
          updates.push(values);
          return Promise.resolve({ error: null });
        },
      }),
    }),
  } as unknown as Parameters<typeof getGoogleCalendarStatus>[0] & { updates: typeof updates };
}

test("getGoogleCalendarStatus: no credentials means not_connected", async () => {
  const supabase = fakeSupabase(null);
  assert.equal(await getGoogleCalendarStatus(supabase, "acc1"), "not_connected");
});

test("getGoogleCalendarStatus: healthy tokens mean connected", async () => {
  const supabase = fakeSupabase({ access_token: "x", expires_at: new Date(Date.now() + 3600_000).toISOString() });
  assert.equal(await getGoogleCalendarStatus(supabase, "acc1"), "connected");
});

test("getGoogleCalendarStatus: sync_broken flag surfaces even with a stored access_token", async () => {
  const supabase = fakeSupabase({ access_token: "x", expires_at: new Date().toISOString(), sync_broken: true });
  assert.equal(await getGoogleCalendarStatus(supabase, "acc1"), "sync_broken");
});

test("pushBookingToCalendar: refresh_token missing on an expired token marks sync_broken and skips the sync", async () => {
  const supabase = fakeSupabase({ access_token: "expired", expires_at: new Date(0).toISOString() });
  await pushBookingToCalendar(supabase, { clientId: "id", clientSecret: "secret" }, {
    accountId: "acc1",
    bookingId: "b1",
    existingEventId: null,
    summary: "Job",
    startsAt: new Date().toISOString(),
    endsAt: new Date().toISOString(),
  });
  assert.equal(supabase.updates.length, 1);
  assert.equal((supabase.updates[0].gcal_credentials as { sync_broken?: boolean }).sync_broken, true);
});

test("pushBookingToCalendar: failed token refresh marks sync_broken", async () => {
  const supabase = fakeSupabase({
    access_token: "expired",
    refresh_token: "refresh-1",
    expires_at: new Date(0).toISOString(),
  });
  const originalFetch = globalThis.fetch;
  globalThis.fetch = (async () => new Response("bad refresh token", { status: 400 })) as typeof fetch;
  try {
    await pushBookingToCalendar(supabase, { clientId: "id", clientSecret: "secret" }, {
      accountId: "acc1",
      bookingId: "b1",
      existingEventId: null,
      summary: "Job",
      startsAt: new Date().toISOString(),
      endsAt: new Date().toISOString(),
    });
  } finally {
    globalThis.fetch = originalFetch;
  }
  assert.equal(supabase.updates.length, 1);
  assert.equal((supabase.updates[0].gcal_credentials as { sync_broken?: boolean }).sync_broken, true);
});
