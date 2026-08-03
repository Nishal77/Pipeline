// Escalation chain v1 (PRD FR-3.2): live transfer attempt to the owner's cell,
// with a whisper prompt so the owner knows it's a business call before it
// connects, then an SMS fallback regardless of whether the transfer succeeded
// (never drop a lead — CLAUDE.md non-negotiable rule #1). Retry x2 on an
// unanswered transfer: Twilio's <Dial action> callback reports DialCallStatus
// (completed/no-answer/busy/failed) once the dial leg ends, and whatever TwiML
// that callback returns keeps running on the *same live call* — no separate
// REST redirect, no polling needed. Retry state (attempt number, who/why)
// rides along in the callback URL's query string since there's no session to
// keep it in between requests.
import type { SupabaseClient } from "@supabase/supabase-js";
import type { TwilioCreds } from "./sms.js";
import { logEvent } from "./analytics.js";

const MAX_TRANSFER_ATTEMPTS = 2;

function buildDialTwiml(ownerCellE164: string, whisperTwimlUrl: string, actionUrl: string): string {
  return (
    `<?xml version="1.0" encoding="UTF-8"?><Response><Dial action="${actionUrl}">` +
    `<Number url="${whisperTwimlUrl}">${ownerCellE164}</Number></Dial></Response>`
  );
}

function buildEscalationActionUrl(origin: string, params: Record<string, string>): string {
  const url = new URL("/escalation-status", origin);
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);
  return url.toString();
}

// Pure decision, no I/O — the actual "did we retry correctly" logic, testable
// without a fake Twilio or Supabase.
export function decideEscalationRetry(dialCallStatus: string, attempt: number): "connected" | "retry" | "exhausted" {
  if (dialCallStatus === "completed") return "connected";
  return attempt < MAX_TRANSFER_ATTEMPTS ? "retry" : "exhausted";
}

export async function escalateToOwner(
  supabase: SupabaseClient,
  twilio: TwilioCreds,
  input: {
    accountId: string;
    callId: string;
    callSid: string;
    ownerCellE164: string;
    reason: string;
    whisperTwimlUrl: string;
    // Pro plan extra (PRD §8 "live-transfer chain default-on") — Solo gets
    // SMS-only escalation, Pro gets the live transfer attempt too.
    attemptTransfer: boolean;
  },
): Promise<{ transferred: boolean; sms_sent: boolean }> {
  const auth = Buffer.from(`${twilio.accountSid}:${twilio.authToken}`).toString("base64");
  let transferred = false;

  if (input.attemptTransfer) {
    const origin = new URL(input.whisperTwimlUrl).origin;
    const actionUrl = buildEscalationActionUrl(origin, {
      account_id: input.accountId,
      call_id: input.callId,
      owner_cell: input.ownerCellE164,
      reason: input.reason,
      attempt: "1",
    });
    const redirectTwiml = buildDialTwiml(input.ownerCellE164, input.whisperTwimlUrl, actionUrl);

    const transferRes = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${twilio.accountSid}/Calls/${input.callSid}.json`,
      {
        method: "POST",
        headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ Twiml: redirectTwiml }),
      },
    );
    transferred = transferRes.ok;

    await supabase.from("escalations").insert({
      call_id: input.callId,
      chain_step: 1,
      method: "transfer",
      result: transferred ? "redirected" : `redirect_failed:${transferRes.status}`,
    });
    await logEvent(supabase, input.accountId, "escalation_step", {
      call_id: input.callId,
      chain_step: 1,
      method: "transfer",
      result: transferred ? "redirected" : "failed",
    });
  }

  const smsRes = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilio.accountSid}/Messages.json`, {
    method: "POST",
    headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      To: input.ownerCellE164,
      From: twilio.fromE164,
      Body: `PipeLine: urgent call needs you. ${input.reason}`.slice(0, 300),
    }),
  });
  const smsSent = smsRes.ok;

  await supabase.from("escalations").insert({
    call_id: input.callId,
    chain_step: 2,
    method: "sms",
    result: smsSent ? "sent" : `sms_failed:${smsRes.status}`,
  });
  await logEvent(supabase, input.accountId, "escalation_step", {
    call_id: input.callId,
    chain_step: 2,
    method: "sms",
    result: smsSent ? "sent" : "failed",
  });

  return { transferred, sms_sent: smsSent };
}

// Called from the voice server's /escalation-status route — the TwiML this
// returns becomes the next step of the *same live call* Twilio already has
// open, per the <Dial action> contract. SMS fallback already went out in
// escalateToOwner above; this only ever affects the transfer leg's outcome.
export async function handleEscalationDialStatus(
  supabase: SupabaseClient,
  input: {
    accountId: string;
    callId: string;
    ownerCellE164: string;
    reason: string;
    attempt: number;
    dialCallStatus: string;
    origin: string;
  },
): Promise<string> {
  const decision = decideEscalationRetry(input.dialCallStatus, input.attempt);
  const chainStep = input.attempt + 1;
  const whisperTwimlUrl = `${input.origin}/whisper`;

  if (decision === "connected") {
    await supabase.from("escalations").insert({ call_id: input.callId, chain_step: chainStep, method: "transfer", result: "connected" });
    await supabase.from("calls").update({ outcome: "escalated_connected" }).eq("id", input.callId);
    await logEvent(supabase, input.accountId, "escalation_step", {
      call_id: input.callId,
      chain_step: chainStep,
      method: "transfer",
      result: "connected",
    });
    return `<?xml version="1.0" encoding="UTF-8"?><Response></Response>`;
  }

  if (decision === "retry") {
    await supabase.from("escalations").insert({
      call_id: input.callId,
      chain_step: chainStep,
      method: "retry_call",
      result: `retry_${input.attempt}_${input.dialCallStatus}`,
    });
    await logEvent(supabase, input.accountId, "escalation_step", {
      call_id: input.callId,
      chain_step: chainStep,
      method: "retry_call",
      result: input.dialCallStatus,
    });
    const actionUrl = buildEscalationActionUrl(input.origin, {
      account_id: input.accountId,
      call_id: input.callId,
      owner_cell: input.ownerCellE164,
      reason: input.reason,
      attempt: String(input.attempt + 1),
    });
    return buildDialTwiml(input.ownerCellE164, whisperTwimlUrl, actionUrl);
  }

  // Exhausted both attempts — owner never picked up. SMS already sent
  // (rule #1 "never drop a lead"); give the caller a way to leave a message
  // instead of a silent hang-up.
  await supabase.from("escalations").insert({
    call_id: input.callId,
    chain_step: chainStep,
    method: "retry_call",
    result: `exhausted_${input.dialCallStatus}`,
  });
  await supabase.from("calls").update({ outcome: "escalated_unreached" }).eq("id", input.callId);
  await logEvent(supabase, input.accountId, "escalation_step", {
    call_id: input.callId,
    chain_step: chainStep,
    method: "retry_call",
    result: "exhausted",
  });
  const recordActionUrl = new URL("/voicemail-callback", input.origin);
  recordActionUrl.searchParams.set("account_id", input.accountId);
  recordActionUrl.searchParams.set("call_id", input.callId);
  return (
    `<?xml version="1.0" encoding="UTF-8"?><Response>` +
    `<Say>Sorry, we couldn't reach anyone right now. This call is recorded — please leave a message after the tone.</Say>` +
    `<Record maxLength="120" action="${recordActionUrl.toString()}" />` +
    `<Say>We didn't receive a message. Goodbye.</Say></Response>`
  );
}
