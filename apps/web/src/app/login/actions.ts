"use server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// FR-6.6 phone OTP. Rate limiting is Supabase Auth's own built-in per-phone
// throttle (default config) — no separate rate-limit code needed here.
export async function sendOtp(_prevState: unknown, formData: FormData): Promise<{ error?: string; sent?: boolean; phone?: string }> {
  const phone = formData.get("phone") as string;
  if (!phone) return { error: "Phone number required" };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({ phone });
  if (error) return { error: error.message };
  return { sent: true, phone };
}

export async function verifyOtp(_prevState: unknown, formData: FormData): Promise<{ error?: string }> {
  const phone = formData.get("phone") as string;
  const token = formData.get("token") as string;

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({ phone, token, type: "sms" });
  if (error) return { error: error.message };
  redirect("/today");
}

// FR-6.6 magic-link fallback — for when SMS delivery is flaky/unavailable.
export async function sendMagicLink(_prevState: unknown, formData: FormData): Promise<{ error?: string; sent?: boolean }> {
  const email = formData.get("email") as string;
  if (!email) return { error: "Email required" };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback` } });
  if (error) return { error: error.message };
  return { sent: true };
}
