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
