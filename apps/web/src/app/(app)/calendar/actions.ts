"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// Manual calendar reschedule/cancel — direct DB update. Unlike the voice/SMS
// paths (packages/shared/scheduling.ts), this doesn't push to Google Calendar
// (apps/web has no Google creds wired) — a real gap if the owner drags a
// booking here instead of via the AI. Flagged, not fixed: needs either a
// shared package import or its own OAuth token access.
export async function rescheduleBookingManually(bookingId: string, newStartIso: string): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { data: booking } = await supabase.from("bookings").select("job_types(duration_min)").eq("id", bookingId).single();
  const jobTypes = booking?.job_types as unknown as { duration_min: number } | { duration_min: number }[] | undefined;
  const durationMin = Array.isArray(jobTypes) ? jobTypes[0]?.duration_min : jobTypes?.duration_min;
  if (!durationMin) return { error: "Booking not found" };

  const startsAt = new Date(newStartIso);
  const endsAt = new Date(startsAt.getTime() + durationMin * 60_000);

  const { error } = await supabase.from("bookings").update({ starts_at: startsAt.toISOString(), ends_at: endsAt.toISOString(), status: "rescheduled" }).eq("id", bookingId);
  if (error) return { error: error.message };
  revalidatePath("/calendar");
  return {};
}

export async function cancelBookingManually(bookingId: string): Promise<void> {
  const supabase = await createClient();
  await supabase.from("bookings").update({ status: "canceled" }).eq("id", bookingId);
  revalidatePath("/calendar");
}

export async function toggleVacationMode(enabled: boolean): Promise<void> {
  const supabase = await createClient();
  const { data: account } = await supabase.from("accounts").select("id").single();
  if (!account) return;
  const { data: profile } = await supabase.from("business_profile").select("hours").eq("account_id", account.id).single();
  await supabase
    .from("business_profile")
    .update({ hours: { ...(profile?.hours ?? {}), vacation_mode: enabled } })
    .eq("account_id", account.id);
  revalidatePath("/calendar");
}
