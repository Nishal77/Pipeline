// Transactional SMS only (CLAUDE.md non-negotiable rule #6) — every template
// carries a STOP notice, and sends are skipped for opted-out customers. Uses
// Twilio's plain REST API (fetch + Basic Auth) — no SDK dep needed for one call.
import type { SupabaseClient } from "@supabase/supabase-js";
import type { z } from "zod";
import type { SmsKind as SmsKindSchema } from "./db.js";

type SmsKind = z.infer<typeof SmsKindSchema>;

export interface TwilioCreds {
  accountSid: string;
  authToken: string;
  fromE164: string;
}

function renderTemplate(kind: SmsKind, vars: Record<string, string>): string {
  const stop = " Reply STOP to opt out.";
  switch (kind) {
    case "confirm":
      return `Hi ${vars.name}, your ${vars.job} is booked for ${vars.when}. We'll text reminders before the visit.${stop}`;
    case "reminder24":
      return `Reminder: your ${vars.job} appointment is tomorrow at ${vars.when}.${stop}`;
    case "reminder1":
      return `Reminder: your ${vars.job} appointment is in about 1 hour (${vars.when}).${stop}`;
    case "otw":
      return `Your technician is on the way for your ${vars.job} appointment.${stop}`;
    case "digest":
      return vars.body; // owner-facing, no STOP notice needed
    case "freeform":
      return vars.body;
    default:
      return vars.body;
  }
}

export async function sendSms(
  supabase: SupabaseClient,
  twilio: TwilioCreds,
  input: {
    accountId: string;
    customerId: string;
    toE164: string;
    kind: SmsKind;
    vars: Record<string, string>;
  },
): Promise<{ ok: true } | { error: string }> {
  const { data: customer } = await supabase
    .from("customers")
    .select("sms_opt_out")
    .eq("id", input.customerId)
    .maybeSingle();
  if (customer?.sms_opt_out) return { error: "customer has opted out of SMS" };

  const body = renderTemplate(input.kind, input.vars);
  const auth = Buffer.from(`${twilio.accountSid}:${twilio.authToken}`).toString("base64");
  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilio.accountSid}/Messages.json`, {
    method: "POST",
    headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ To: input.toE164, From: twilio.fromE164, Body: body }),
  });
  const sent = res.ok;

  await supabase.from("sms_messages").insert({
    account_id: input.accountId,
    customer_id: input.customerId,
    direction: "outbound",
    kind: input.kind,
    body,
    status: sent ? "sent" : "failed",
    sent_at: sent ? new Date().toISOString() : null,
  });

  return sent ? { ok: true } : { error: `Twilio send failed: ${res.status}` };
}
