"use server";
import { createClient } from "@/lib/supabase/server";

// FR-5.3 on-my-way button. Plain Twilio REST (no @pipeline/shared import —
// keeps apps/web dependency-free of the voice-pipeline package for one SMS).
export async function sendOnMyWay(bookingId: string): Promise<{ error?: string }> {
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = process.env;
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) return { error: "Twilio not configured" };

  const supabase = await createClient();
  const { data: booking } = await supabase
    .from("bookings")
    .select("account_id, customer_id, customers(phone_e164, sms_opt_out)")
    .eq("id", bookingId)
    .maybeSingle();
  if (!booking) return { error: "Booking not found" };

  const customer = Array.isArray(booking.customers) ? booking.customers[0] : booking.customers;
  if (!customer || customer.sms_opt_out) return { error: "Customer has opted out of SMS" };

  const { data: phone } = await supabase.from("phone_numbers").select("e164").eq("account_id", booking.account_id).limit(1).maybeSingle();
  if (!phone) return { error: "No sending number configured" };

  const auth = Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString("base64");
  const body = "Your technician is on the way! Reply STOP to opt out.";
  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`, {
    method: "POST",
    headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ To: customer.phone_e164, From: phone.e164, Body: body }),
  });
  if (!res.ok) return { error: `Send failed: ${res.status}` };

  await supabase.from("sms_messages").insert({
    account_id: booking.account_id,
    customer_id: booking.customer_id,
    direction: "outbound",
    kind: "otw",
    body,
    status: "sent",
    sent_at: new Date().toISOString(),
  });
  return {};
}
