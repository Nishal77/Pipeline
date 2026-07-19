// Escalation chain v1 (PRD FR-3.2): live transfer attempt to the owner's cell,
// with a whisper prompt so the owner knows it's a business call before it
// connects, then an SMS fallback regardless of whether the transfer succeeded
// (never drop a lead — CLAUDE.md non-negotiable rule #1). Full retry x2 on an
// unanswered transfer needs Twilio status-callback polling to detect "no
// answer" — that's a real gap, not built here; this version only detects
// whether the *redirect API call itself* succeeded, not whether the owner
// picked up.
import type { SupabaseClient } from "@supabase/supabase-js";
import type { TwilioCreds } from "./sms.js";

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
  },
): Promise<{ transferred: boolean; sms_sent: boolean }> {
  const auth = Buffer.from(`${twilio.accountSid}:${twilio.authToken}`).toString("base64");

  const redirectTwiml =
    `<?xml version="1.0" encoding="UTF-8"?><Response><Dial>` +
    `<Number url="${input.whisperTwimlUrl}">${input.ownerCellE164}</Number>` +
    `</Dial></Response>`;

  const transferRes = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${twilio.accountSid}/Calls/${input.callSid}.json`,
    {
      method: "POST",
      headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ Twiml: redirectTwiml }),
    },
  );
  const transferred = transferRes.ok;

  await supabase.from("escalations").insert({
    call_id: input.callId,
    chain_step: 1,
    method: "transfer",
    result: transferred ? "redirected" : `redirect_failed:${transferRes.status}`,
  });

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

  return { transferred, sms_sent: smsSent };
}
