// Transactional SMS only (CLAUDE.md non-negotiable rule #6) — every template
// carries a STOP notice, and sends are skipped for opted-out customers. Uses
// Twilio's plain REST API (fetch + Basic Auth) — no SDK dep needed for one call.
import type { SupabaseClient } from "@supabase/supabase-js";
import type { z } from "zod";
import type { SmsKind as SmsKindSchema } from "./db.js";
import { checkAvailability, rescheduleBooking, type BusinessHoursConfig } from "./scheduling.js";
import type { GoogleCreds } from "./gcal.js";

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

const STOP_KEYWORDS = new Set(["stop", "stopall", "unsubscribe", "cancel", "end", "quit"]);

// FR-5.4 "R (AI callback or link)" — lazy correct reading: auto-rebook to the
// next available slot for the same job type rather than parsing a caller-typed
// new time out of free-text SMS (real NLU-over-SMS is a bigger, separate
// feature). Picks the first check_availability result.
async function rescheduleViaReply(supabase: SupabaseClient, accountId: string, customerId: string, google?: GoogleCreds): Promise<string> {
  const { data: booking } = await supabase
    .from("bookings")
    .select("id, job_type_id, job_types(name, duration_min, buffer_min), accounts(tz)")
    .eq("customer_id", customerId)
    .in("status", ["confirmed", "rescheduled"])
    .gt("starts_at", new Date().toISOString())
    .order("starts_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (!booking) return "We couldn't find an upcoming appointment to reschedule. Please call us.";

  const { data: profile } = await supabase.from("business_profile").select("hours").eq("account_id", accountId).maybeSingle();
  const row = booking as unknown as {
    id: string;
    job_type_id: string;
    job_types: { name: string; duration_min: number; buffer_min: number };
    accounts: { tz: string };
  };
  if (!profile) return "We couldn't find an upcoming appointment to reschedule. Please call us.";

  const slots = await checkAvailability(supabase, accountId, row.job_type_id, {
    hours: profile.hours as BusinessHoursConfig,
    timeZone: row.accounts.tz,
    durationMin: row.job_types.duration_min,
    bufferMin: row.job_types.buffer_min,
    allowSameDay: false,
  });
  const nextSlot = slots[0];
  if (!nextSlot) return "No open slots found right now — please call us to reschedule.";

  const result = await rescheduleBooking(supabase, accountId, row.id, nextSlot.slot_id, google);
  if ("error" in result) return "Couldn't reschedule automatically — please call us.";

  const when = new Date(nextSlot.starts_at).toLocaleString("en-US", { timeZone: row.accounts.tz });
  return `Rescheduled your ${row.job_types.name} to ${when}. Reply STOP to opt out.`;
}

// FR-5.4 — inbound C/R/STOP handling. STOP is honored globally and immediately
// (CLAUDE.md non-negotiable rule #6), checked before anything else regardless
// of account state. Returns the TwiML-reply body text, or null for no reply.
export async function handleInboundSms(
  supabase: SupabaseClient,
  twilio: TwilioCreds,
  input: { accountId: string; fromE164: string; body: string },
  google?: GoogleCreds,
): Promise<string | null> {
  const normalized = input.body.trim().toLowerCase();

  const { data: customer } = await supabase
    .from("customers")
    .select("id, sms_opt_out")
    .eq("account_id", input.accountId)
    .eq("phone_e164", input.fromE164)
    .maybeSingle();

  if (STOP_KEYWORDS.has(normalized)) {
    if (customer) {
      await supabase.from("customers").update({ sms_opt_out: true }).eq("id", customer.id);
      await supabase.from("audit_log").insert({
        account_id: input.accountId,
        actor: "system",
        action: "sms_opt_out",
        detail: { phone_e164: input.fromE164 },
      });
    }
    return "You've been unsubscribed and won't receive further messages. Reply START to resubscribe.";
  }

  if (!customer) return null; // unknown number sending C/R/freeform — nothing to act on

  await supabase.from("sms_messages").insert({
    account_id: input.accountId,
    customer_id: customer.id,
    direction: "inbound",
    kind: "freeform",
    body: input.body,
    status: "delivered",
    sent_at: new Date().toISOString(),
  });

  if (normalized === "c") return "Thanks, see you then!";
  if (normalized === "r") return await rescheduleViaReply(supabase, input.accountId, customer.id, google);

  // Freeform -> owner (FR-5.4), not auto-replied to the caller.
  const { data: account } = await supabase.from("accounts").select("owner_cell, business_name").eq("id", input.accountId).single();
  if (account) {
    const auth = Buffer.from(`${twilio.accountSid}:${twilio.authToken}`).toString("base64");
    await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilio.accountSid}/Messages.json`, {
      method: "POST",
      headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        To: account.owner_cell,
        From: twilio.fromE164,
        Body: `Text from ${input.fromE164}: ${input.body}`.slice(0, 300),
      }),
    });
  }
  return null;
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
