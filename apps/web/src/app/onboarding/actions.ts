"use server";
import { createClient } from "@/lib/supabase/server";

// FR-7 onboarding wizard. Stripe card capture (step 2 in the spec) and Google
// Calendar connect (step 8) are deliberately not here — billing is Phase 5
// scope, and Calendar OAuth already exists as its own flow at
// /oauth/google/start (apps/api), linked from the activation step instead of
// duplicated here.
export async function trackStep(step: number, name: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;
  // Best-effort — account may not exist yet on early steps, so this can no-op.
  const { data: account } = await supabase.from("accounts").select("id").maybeSingle();
  if (account) {
    await supabase.from("events_analytics").insert({ account_id: account.id, name: "onboarding_step_completed", properties: { step, name } });
  }
}

export async function createAccount(input: {
  businessName: string;
  ownerName: string;
  ownerCell: string;
  email: string;
  zip: string;
  services: { name: string; price: number; durationMin: number }[];
  hours: Record<string, { open: string; close: string } | null>;
  radiusMiles: number;
}): Promise<{ error?: string; accountId?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in" };

  const { data: account, error: accountErr } = await supabase
    .from("accounts")
    .insert({
      owner_auth_id: user.id,
      business_name: input.businessName,
      owner_name: input.ownerName,
      owner_cell: input.ownerCell,
      email: input.email,
      tz: "America/New_York",
      plan: "solo",
      status: "trial",
      trial_ends_at: new Date(Date.now() + 14 * 86_400_000).toISOString(),
    })
    .select("id")
    .single();
  if (accountErr || !account) return { error: accountErr?.message ?? "Failed to create account" };

  const priceSheet = Object.fromEntries(input.services.map((s) => [s.name, s.price]));
  await supabase.from("business_profile").insert({
    account_id: account.id,
    greeting_name: input.businessName,
    hours: { ...input.hours, max_jobs_per_day: 6 },
    emergency_policy: { gas_leak: "leave_building_call_911" },
    service_area: { zips: [input.zip], radius_miles: input.radiusMiles },
    price_sheet: priceSheet,
  });

  await supabase.from("job_types").insert(
    input.services.map((s) => ({ account_id: account.id, name: s.name, duration_min: s.durationMin, buffer_min: 30 })),
  );

  await supabase.from("events_analytics").insert({ account_id: account.id, name: "onboarding_step_completed", properties: { step: 5, name: "account_created" } });

  return { accountId: account.id };
}

// The account's own number to receive calls on is always a fresh Twilio
// number (~$1/mo, real cost) — carrier forwarding redirects the owner's
// existing business number TO this one; the two are never the same number.
// "Keep your number" (R6) just means the owner's original number stays what
// customers dial; it doesn't change what Twilio needs to answer on.
export async function provisionNumber(accountId: string): Promise<{ error?: string; e164?: string }> {
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, VOICE_WEBHOOK_BASE_URL } = process.env;
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) return { error: "Twilio not configured" };
  const auth = Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString("base64");

  const searchRes = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/AvailablePhoneNumbers/US/Local.json?VoiceEnabled=true&SmsEnabled=true&PageSize=1`,
    { headers: { Authorization: `Basic ${auth}` } },
  );
  const available = (await searchRes.json()) as { available_phone_numbers?: { phone_number: string }[] };
  const candidate = available.available_phone_numbers?.[0]?.phone_number;
  if (!candidate) return { error: "No numbers available right now" };

  const buyRes = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/IncomingPhoneNumbers.json`, {
    method: "POST",
    headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      PhoneNumber: candidate,
      VoiceUrl: `${VOICE_WEBHOOK_BASE_URL}/voice`,
      VoiceMethod: "POST",
      SmsUrl: `${VOICE_WEBHOOK_BASE_URL}/sms`,
      SmsMethod: "POST",
    }),
  });
  if (!buyRes.ok) return { error: `Twilio purchase failed: ${await buyRes.text()}` };

  const supabase = await createClient();
  const { error } = await supabase.from("phone_numbers").insert({ account_id: accountId, e164: candidate, type: "platform" });
  if (error) return { error: error.message };
  await supabase
    .from("events_analytics")
    .insert({ account_id: accountId, name: "onboarding_step_completed", properties: { step: 6, name: "number_provisioned" } });
  return { e164: candidate };
}

export async function checkActivation(accountId: string): Promise<{ activated: boolean }> {
  const supabase = await createClient();
  const { data: bookings } = await supabase
    .from("bookings")
    .select("id")
    .eq("account_id", accountId)
    .gte("held_at", new Date(Date.now() - 30 * 60_000).toISOString())
    .limit(1);
  const activated = (bookings?.length ?? 0) > 0;
  if (activated) {
    await supabase.from("events_analytics").insert({ account_id: accountId, name: "activation_first_real_call", properties: {} });
  }
  return { activated };
}
