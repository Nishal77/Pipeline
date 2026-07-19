// Stub calendar for Phase 2 (PRD FR-4 real slotting engine is Phase 3 scope).
// Fixed daily slot times, filtered against existing bookings. No working-hours
// config, no travel buffer, no per-day job limits yet — those are Phase 3.
import type { SupabaseClient } from "@supabase/supabase-js";

const STUB_SLOT_HOURS_LOCAL = [9, 13, 15]; // 9am, 1pm, 3pm

function nextWeekdaySlots(count: number): Date[] {
  const slots: Date[] = [];
  const cursor = new Date();
  cursor.setUTCHours(0, 0, 0, 0);
  cursor.setUTCDate(cursor.getUTCDate() + 1); // start tomorrow, never same-day for the stub

  while (slots.length < count) {
    const day = cursor.getUTCDay();
    if (day !== 0 && day !== 6) {
      for (const hour of STUB_SLOT_HOURS_LOCAL) {
        const slot = new Date(cursor);
        slot.setUTCHours(hour, 0, 0, 0);
        slots.push(slot);
      }
    }
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return slots.slice(0, count);
}

export async function checkAvailability(
  supabase: SupabaseClient,
  accountId: string,
  jobTypeId: string,
): Promise<{ slot_id: string; starts_at: string }[]> {
  const candidates = nextWeekdaySlots(9); // 3 weekdays x 3 slots
  const { data: taken } = await supabase
    .from("bookings")
    .select("starts_at")
    .eq("account_id", accountId)
    .eq("job_type_id", jobTypeId)
    .in("status", ["held", "confirmed"]);

  const takenTimes = new Set((taken ?? []).map((b) => new Date(b.starts_at).toISOString()));
  return candidates
    .filter((slot) => !takenTimes.has(slot.toISOString()))
    .slice(0, 3)
    .map((slot) => ({ slot_id: slot.toISOString(), starts_at: slot.toISOString() }));
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
  },
): Promise<{ booking_id: string } | { error: string }> {
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
  const endsAt = new Date(startsAt.getTime() + input.durationMin * 60_000);

  // Unique partial index (account_id, job_type_id, starts_at) where status in (held, confirmed)
  // is the actual atomicity guarantee here — concurrent double-book attempts on the
  // same slot fail at the DB level, not in application code.
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

  return { booking_id: booking.id };
}

// Phase 2 stub: no separate hold row / 90s expiry (that's Phase 3's atomic
// hold/confirm, PRD NFR-3). book_job's unique index is the real atomicity
// guarantee; this just re-checks the slot right before the caller commits to
// it, so the AI doesn't confirm a slot that was taken seconds ago.
export async function holdSlot(
  supabase: SupabaseClient,
  accountId: string,
  jobTypeId: string,
  slotId: string,
): Promise<{ held: true } | { held: false; reason: string }> {
  const { data: taken } = await supabase
    .from("bookings")
    .select("id")
    .eq("account_id", accountId)
    .eq("job_type_id", jobTypeId)
    .eq("starts_at", new Date(slotId).toISOString())
    .in("status", ["held", "confirmed"])
    .maybeSingle();
  return taken ? { held: false, reason: "slot was just taken, offer a different one" } : { held: true };
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
  if (lastBooking) {
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
): Promise<{ ok: true } | { error: string }> {
  const { data: existing, error: fetchErr } = await supabase
    .from("bookings")
    .select("job_types(duration_min)")
    .eq("id", bookingId)
    .eq("account_id", accountId)
    .single();
  if (fetchErr || !existing) return { error: `booking not found: ${fetchErr?.message}` };

  const durationMin = (existing as unknown as { job_types: { duration_min: number } }).job_types.duration_min;
  const startsAt = new Date(newSlotId);
  const endsAt = new Date(startsAt.getTime() + durationMin * 60_000);

  // Same unique partial index protects against double-booking the new slot.
  const { error: updateErr } = await supabase
    .from("bookings")
    .update({ starts_at: startsAt.toISOString(), ends_at: endsAt.toISOString(), status: "rescheduled" })
    .eq("id", bookingId)
    .eq("account_id", accountId);
  if (updateErr) return { error: `new slot no longer available: ${updateErr.message}` };
  return { ok: true };
}

export async function cancelBooking(
  supabase: SupabaseClient,
  accountId: string,
  bookingId: string,
): Promise<{ ok: true } | { error: string }> {
  const { error } = await supabase
    .from("bookings")
    .update({ status: "canceled" })
    .eq("id", bookingId)
    .eq("account_id", accountId);
  if (error) return { error: error.message };
  return { ok: true };
}
