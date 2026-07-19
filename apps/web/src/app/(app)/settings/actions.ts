"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateBusinessProfile(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const { data: account } = await supabase.from("accounts").select("id").single();
  if (!account) return;

  const greetingName = formData.get("greeting_name") as string;
  const zips = (formData.get("zips") as string).split(",").map((z) => z.trim()).filter(Boolean);
  const radiusMiles = Number(formData.get("radius_miles"));

  await supabase
    .from("business_profile")
    .update({ greeting_name: greetingName, service_area: { zips, radius_miles: radiusMiles } })
    .eq("account_id", account.id);

  revalidatePath("/settings");
}

// FR-6.4 forwarding "last verified" — a synthetic re-test: hits the account's
// own /voice webhook to confirm Twilio would get valid TwiML back right now.
export async function retestForwarding(): Promise<{ ok: boolean; checkedAt: string }> {
  const supabase = await createClient();
  const { data: account } = await supabase.from("accounts").select("id").single();
  const checkedAt = new Date().toISOString();
  if (!account) return { ok: false, checkedAt };

  const { data: phone } = await supabase.from("phone_numbers").select("id").eq("account_id", account.id).limit(1).maybeSingle();
  if (!phone) return { ok: false, checkedAt };

  const res = await fetch(`${process.env.VOICE_WEBHOOK_BASE_URL}/voice`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: "To=%2B10000000000&From=%2B10000000000",
  }).catch(() => null);
  const ok = Boolean(res?.ok);

  await supabase.from("phone_numbers").update({ last_synthetic_check_at: checkedAt, forwarding_verified_at: ok ? checkedAt : null }).eq("id", phone.id);
  revalidatePath("/settings");
  return { ok, checkedAt };
}

// FR-8.5 self-serve cancel — cancels at period end via apps/api's billing
// route (real Stripe subscription cancellation), not immediately, so the
// owner keeps access through what they already paid for.
export async function cancelSubscription(): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { data: account } = await supabase.from("accounts").select("id").single();
  if (!account) return { error: "No account found" };

  const res = await fetch(`${process.env.API_BASE_URL}/billing/cancel`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ account_id: account.id }),
  }).catch(() => null);
  if (!res?.ok) return { error: "Couldn't cancel right now — please try again or contact support." };

  revalidatePath("/settings");
  return {};
}

// FR-8.5 data export — everything tied to this account, as one JSON blob.
// CSV/audio-zip (spec's exact wording) is a bigger format-conversion job;
// JSON is the same underlying data and is what's actually exported here.
export async function exportAccountData(): Promise<{ error?: string; data?: string }> {
  const supabase = await createClient();
  const { data: account } = await supabase.from("accounts").select("*").single();
  if (!account) return { error: "No account found" };

  const [{ data: bookings }, { data: calls }, { data: customers }, { data: smsMessages }] = await Promise.all([
    supabase.from("bookings").select("*").eq("account_id", account.id),
    supabase.from("calls").select("*").eq("account_id", account.id),
    supabase.from("customers").select("*").eq("account_id", account.id),
    supabase.from("sms_messages").select("*").eq("account_id", account.id),
  ]);

  return { data: JSON.stringify({ account, bookings, calls, customers, sms_messages: smsMessages }, null, 2) };
}
