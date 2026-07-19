"use server";
import { createClient } from "@/lib/supabase/server";

export async function joinWaitlist(_prevState: unknown, formData: FormData): Promise<{ error?: string; joined?: boolean }> {
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  if (!name || !phone) return { error: "Name and phone required" };

  const supabase = await createClient();
  const { error } = await supabase.from("waitlist_signups").insert({ name, phone_e164: phone });
  if (error) return { error: error.message };
  return { joined: true };
}
