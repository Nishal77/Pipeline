// Phase 2 inbound voice engine (CLAUDE.md Phase 2 exit gate: caller phones the
// test number and books a fake job with no human involved). Scope for this pass:
// greeting + recording disclosure, check_availability, book_job, take_message,
// end_call, gas-safety hard-code, per-call artifact write. Deferred (separate
// Phase 2 line items, not silently dropped): SMS confirmation loop, live-transfer
// escalation chain, two-strike fallback, entity-extraction repeat-back, and the
// 40-dialogue QA corpus — none of those are wired yet.
import { createServer } from "node:http";
import { WebSocketServer, WebSocket } from "ws";
import { createClient } from "@supabase/supabase-js";
import { zodToJsonSchema } from "zod-to-json-schema";
import {
  agentTools,
  CheckAvailabilityInput,
  BookJobInput,
  TakeMessageInput,
  EndCallInput,
  HoldSlotInput,
  LookupCallerInput,
  RescheduleInput,
  CancelInput,
  ClassifyUrgencyInput,
  EscalateToOwnerInput,
  SendSmsInput,
} from "@pipeline/shared";
import {
  checkAvailability,
  bookJob,
  holdSlot,
  lookupCaller,
  rescheduleBooking,
  cancelBooking,
  classifyUrgency,
  escalateToOwner,
  sendSms,
  type BusinessHoursConfig,
  logEvent,
  handleInboundSms,
  sweepReminders,
  sweepOwnerDigests,
  sweepForwardingChecks,
  sendPushToAccount,
} from "@pipeline/shared";

// Generic E.164 shape alone isn't enough — "+1917975247012" (14 digits after
// +1) matches it but isn't a real NANP number (should be exactly 10 digits
// after +1). Twilio rejects these silently at send time (error 21211), not
// at booking time, so this slipped through the earlier fallback. Length-check
// the two country codes actually in use (+1 US/CA, +91 India); anything else
// falls back to generic E.164 shape.
const E164_RE = {
  test(phone: string): boolean {
    if (phone.startsWith("+1")) return /^\+1\d{10}$/.test(phone);
    if (phone.startsWith("+91")) return /^\+91\d{10}$/.test(phone);
    return /^\+[1-9]\d{1,14}$/.test(phone);
  },
};

// PRD FR-2.6: after two consecutive turns where the AI had to ask the caller to
// repeat themselves, stop trying a third time — take a message and end the
// call instead of looping. Detected from the AI's own transcript text (needs
// output_modalities to include "text"), not a real ASR-confidence signal —
// the Realtime API doesn't expose one, so phrase-matching is the ceiling here.
const CLARIFICATION_PHRASES = [
  "sorry, i didn't catch",
  "sorry, could you repeat",
  "can you say that again",
  "i didn't quite understand",
  "could you repeat that",
  "sorry, what was that",
];
function soundsLikeClarificationRequest(text: string): boolean {
  const lower = text.toLowerCase();
  return CLARIFICATION_PHRASES.some((p) => lower.includes(p));
}

const PORT = Number(process.env.PORT ?? 8788);
const REALTIME_URL = "wss://api.openai.com/v1/realtime?model=gpt-realtime";

const { OPENAI_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_TEST_NUMBER } =
  process.env;
if (
  !OPENAI_API_KEY ||
  !SUPABASE_URL ||
  !SUPABASE_SERVICE_ROLE_KEY ||
  !TWILIO_ACCOUNT_SID ||
  !TWILIO_AUTH_TOKEN ||
  !TWILIO_TEST_NUMBER
) {
  throw new Error(
    "OPENAI_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_TEST_NUMBER required",
  );
}
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const twilioCreds = { accountSid: TWILIO_ACCOUNT_SID, authToken: TWILIO_AUTH_TOKEN, fromE164: TWILIO_TEST_NUMBER };

// Optional — Google Calendar sync degrades gracefully to "not connected" for
// accounts (or whole deployments) that haven't set these up, per gcal.ts.
const googleCreds =
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
    ? { clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET }
    : undefined;

// Optional — push degrades to "no devices subscribed yet" if unset/empty.
const vapidCreds =
  process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY
    ? { publicKey: process.env.VAPID_PUBLIC_KEY, privateKey: process.env.VAPID_PRIVATE_KEY, contactEmail: "owner@pipeline-test.local" }
    : undefined;

const VOICE_TOOLS = [
  "check_availability",
  "hold_slot",
  "book_job",
  "reschedule",
  "cancel",
  "lookup_caller",
  "take_message",
  "classify_urgency",
  "escalate_to_owner",
  "send_sms",
  "end_call",
] as const;

async function loadAccountForNumber(to: string, from: string) {
  // Real inbound calls put the platform number in `To`. Outbound-triggered test
  // calls (Twilio calling out to dodge a caller's ISD restriction) put it in
  // `From` instead — check both rather than assuming call direction.
  const { data: phones } = await supabase.from("phone_numbers").select("account_id").in("e164", [to, from]);
  const phone = phones?.[0];
  if (!phone) return null;

  const [{ data: account }, { data: profile }, { data: jobTypes }] = await Promise.all([
    supabase.from("accounts").select("*").eq("id", phone.account_id).single(),
    supabase.from("business_profile").select("*").eq("account_id", phone.account_id).single(),
    supabase.from("job_types").select("*").eq("account_id", phone.account_id).eq("active", true),
  ]);
  if (!account || !profile) return null;
  return { account, profile, jobTypes: jobTypes ?? [] };
}

function buildInstructions(
  profile: { greeting_name: string; price_sheet: Record<string, unknown> },
  callerPhoneE164: string,
): string {
  const prices = Object.entries(profile.price_sheet)
    .map(([k, v]) => `${k}: $${v}`)
    .join(", ");
  return (
    `You are the AI phone assistant for ${profile.greeting_name}, a plumbing business. ` +
    "Always respond in English only, regardless of what language the caller speaks. Never claim to be human. " +
    `Open every call with: 'Hi, thanks for calling ${profile.greeting_name} — this is the AI assistant, ` +
    "and this call is recorded. How can I help you today?' " +
    `The caller's phone number is ${callerPhoneE164} (from caller ID) — call lookup_caller with this number ` +
    "right away, silently, before greeting. If they're a known returning customer, you may skip re-asking for " +
    "their name/address if lookup_caller returns one, but always confirm it's still correct. " +
    "To book a new job: use check_availability to find open slots, call hold_slot on the one the caller " +
    "picks to make sure it's still free, collect their name, callback phone number, and full service address " +
    "(repeat it back to confirm you heard it correctly), then call book_job. " +
    "If a known caller wants to change or cancel an existing booking, use reschedule or cancel. " +
    "If they just want to leave a message instead, use take_message. " +
    "As soon as you have enough signal on how serious the problem is, call classify_urgency with the " +
    "phrases the caller used describing it. If that returns EMERGENCY, call escalate_to_owner immediately " +
    "with a short reason — do this before finishing the booking, urgent situations get the owner involved " +
    "right away, not after wrapping up the call. After a successful book_job, call send_sms with kind " +
    "'confirm' to text the caller a confirmation. " +
    "Call end_call once the call is wrapped up, with the right disposition. " +
    (prices ? `Only quote these exact prices, never invent numbers: ${prices}. ` : "") +
    "If the caller describes a gas smell or gas leak, immediately and firmly tell them to leave the building " +
    "and call the gas company or 911 before anything else, then call classify_urgency and escalate_to_owner " +
    "right away — do not continue with booking until they confirm they are safe."
  );
}

interface CallSession {
  ctx: NonNullable<Awaited<ReturnType<typeof loadAccountForNumber>>>;
  callerPhoneE164: string;
  callId: string;
  callSid: string;
  whisperTwimlUrl: string;
}

function bridgeToOpenAI(
  twilioWs: WebSocket,
  streamSidPromise: Promise<string>,
  session: CallSession,
  onCallEnd: (outcome: string, summary: string, triageClass: string, transcript: string, anyToolCalled: boolean) => void,
) {
  const { ctx } = session;
  const openaiWs = new WebSocket(REALTIME_URL, { headers: { Authorization: `Bearer ${OPENAI_API_KEY}` } });
  let disposition = "abandoned";
  let lastSummary = "";
  let triageClass = "ROUTINE";
  let consecutiveClarifications = 0;
  let anyToolCalled = false;
  const transcriptLines: string[] = [];

  const toolSchemas = VOICE_TOOLS.map((name) => ({
    type: "function" as const,
    name,
    parameters: zodToJsonSchema(agentTools[name]),
  }));

  openaiWs.on("open", () => {
    openaiWs.send(
      JSON.stringify({
        type: "session.update",
        session: {
          type: "realtime",
          // GA API only supports ["audio"] or ["text"] alone, not combined
          // (learned live: combining them rejects the whole session.update,
          // silently killing every call — no greeting, no session at all).
          // The AI's spoken-text transcript still comes through separately
          // via response.audio_transcript.done regardless of this setting.
          output_modalities: ["audio"],
          instructions: buildInstructions(ctx.profile, session.callerPhoneE164),
          tools: toolSchemas,
          audio: {
            // semantic_vad waits for the sentence to sound complete instead of firing
            // on a fixed silence timer — server_vad's default was cutting callers off
            // mid-thought during natural pauses. eagerness "low" favors patience over
            // snappy turnaround, which is the right tradeoff for a booking call.
            input: {
              format: { type: "audio/pcmu" },
              turn_detection: { type: "semantic_vad", eagerness: "low" },
              transcription: { model: "whisper-1" },
            },
            output: { format: { type: "audio/pcmu" }, voice: "marin" },
          },
        },
      }),
    );
  });

  async function runTool(name: string, args: Record<string, unknown>): Promise<unknown> {
    anyToolCalled = true; // FR-1.6 spam signal: a real caller reaches at least one tool call
    const jobType = ctx!.jobTypes[0]; // Phase 2 stub: one job type per account, per CLAUDE.md scope
    switch (name) {
      case "check_availability": {
        CheckAvailabilityInput.parse(args);
        if (!jobType) return { error: "no job types configured for this account" };
        const slots = await checkAvailability(supabase, ctx!.account.id, jobType.id, {
          hours: ctx!.profile.hours as BusinessHoursConfig,
          timeZone: ctx!.account.tz,
          durationMin: jobType.duration_min,
          bufferMin: jobType.buffer_min,
          allowSameDay: triageClass === "EMERGENCY",
          google: googleCreds,
        });
        return { slots };
      }
      case "hold_slot": {
        const input = HoldSlotInput.parse(args);
        if (!jobType) return { error: "no job types configured for this account" };
        return await holdSlot(supabase, ctx!.account.id, jobType.id, input.slot_id, jobType.duration_min);
      }
      case "lookup_caller": {
        const input = LookupCallerInput.parse(args);
        return await lookupCaller(supabase, ctx!.account.id, input.phone_e164);
      }
      case "reschedule": {
        const input = RescheduleInput.parse(args);
        const result = await rescheduleBooking(supabase, ctx!.account.id, input.booking_id, input.new_slot_id, googleCreds);
        if ("ok" in result) {
          disposition = "booked";
          lastSummary = `Rescheduled booking ${input.booking_id} to ${input.new_slot_id}`;
        }
        return result;
      }
      case "cancel": {
        const input = CancelInput.parse(args);
        const result = await cancelBooking(supabase, ctx!.account.id, input.booking_id, googleCreds);
        if ("ok" in result) {
          disposition = "callback";
          lastSummary = `Canceled booking ${input.booking_id}`;
        }
        return result;
      }
      case "book_job": {
        const input = BookJobInput.parse(args);
        if (!jobType) return { error: "no job types configured for this account" };
        // The model sometimes mis-transcribes spoken digits into a malformed
        // E.164 number (seen live: "+1917975247012" — US country code
        // prepended to an Indian number). Twilio's caller ID is ground truth;
        // fall back to it rather than trusting a garbled spoken number.
        const phone = E164_RE.test(input.customer_phone_e164) ? input.customer_phone_e164 : session.callerPhoneE164;
        const serviceAreaZips = (ctx!.profile.service_area as { zips?: string[] })?.zips;
        const result = await bookJob(supabase, {
          accountId: ctx!.account.id,
          jobTypeId: jobType.id,
          slotId: input.slot_id,
          customerName: input.customer_name,
          customerPhoneE164: phone,
          address: input.address,
          durationMin: jobType.duration_min,
          serviceAreaZips,
          jobTypeName: jobType.name,
          google: googleCreds,
        });
        if ("out_of_area" in result && result.out_of_area) {
          disposition = "callback";
          lastSummary = `Out-of-area lead: ${input.address.zip}`;
        }
        if ("booking_id" in result) {
          disposition = "booked";
          lastSummary = `Booked ${jobType.name} for ${input.customer_name} at ${input.slot_id}`;
          if (vapidCreds) {
            const when = new Date(input.slot_id).toLocaleString("en-US", { timeZone: ctx!.account.tz });
            sendPushToAccount(supabase, vapidCreds, ctx!.account.id, {
              title: "New job booked",
              body: `${jobType.name} for ${input.customer_name} at ${when}`,
              url: "/today",
            }).catch((err) => console.error("Push send failed:", err));
          }
        }
        return result;
      }
      case "take_message": {
        const input = TakeMessageInput.parse(args);
        disposition = "message";
        lastSummary = `Message from ${input.customer_phone_e164}: ${input.message}`.slice(0, 280);
        return { ok: true };
      }
      case "classify_urgency": {
        const input = ClassifyUrgencyInput.parse(args);
        const result = classifyUrgency(input.features);
        triageClass = result.triage_class;
        return result;
      }
      case "escalate_to_owner": {
        const input = EscalateToOwnerInput.parse(args); // call_id in the schema is ignored — session.callId is authoritative
        const result = await escalateToOwner(supabase, twilioCreds, {
          accountId: ctx!.account.id,
          callId: session.callId,
          callSid: session.callSid,
          ownerCellE164: ctx!.account.owner_cell,
          reason: input.reason,
          whisperTwimlUrl: session.whisperTwimlUrl,
        });
        disposition = result.transferred ? "escalated_connected" : "escalated_unreached";
        lastSummary = `Escalated: ${input.reason}`;
        if (vapidCreds) {
          sendPushToAccount(supabase, vapidCreds, ctx!.account.id, {
            title: "🚨 Emergency call",
            body: input.reason,
            url: "/today",
          }).catch((err) => console.error("Push send failed:", err));
        }
        return result;
      }
      case "send_sms": {
        const input = SendSmsInput.parse(args);
        const { data: customer } = await supabase
          .from("customers")
          .select("id, name")
          .eq("account_id", ctx!.account.id)
          .eq("phone_e164", input.to_e164)
          .maybeSingle();
        if (!customer) return { error: "no customer record for that number yet — book_job creates one" };

        let when = "";
        if (input.booking_id) {
          const { data: booking } = await supabase
            .from("bookings")
            .select("starts_at")
            .eq("id", input.booking_id)
            .maybeSingle();
          if (booking) when = new Date(booking.starts_at).toLocaleString("en-US", { timeZone: ctx!.account.tz });
        }
        return await sendSms(supabase, twilioCreds, {
          accountId: ctx!.account.id,
          customerId: customer.id,
          toE164: input.to_e164,
          kind: input.kind,
          vars: { name: customer.name ?? "there", job: jobType?.name ?? "your service", when, body: input.body_override ?? "" },
        });
      }
      case "end_call": {
        const input = EndCallInput.parse(args);
        disposition = input.disposition;
        return { ok: true };
      }
      default:
        return { error: `unknown tool ${name}` };
    }
  }

  openaiWs.on("message", async (raw) => {
    const event = JSON.parse(raw.toString());

    if (event.type === "session.updated") {
      openaiWs.send(JSON.stringify({ type: "response.create" }));
    }
    if (event.type === "response.output_audio.delta") {
      const streamSid = await streamSidPromise;
      twilioWs.send(JSON.stringify({ event: "media", streamSid, media: { payload: event.delta } }));
    }
    if (event.type === "response.function_call_arguments.done") {
      const args = JSON.parse(event.arguments || "{}");
      const output = await runTool(event.name, args);
      openaiWs.send(
        JSON.stringify({
          type: "conversation.item.create",
          item: { type: "function_call_output", call_id: event.call_id, output: JSON.stringify(output) },
        }),
      );
      openaiWs.send(JSON.stringify({ type: "response.create" }));
    }
    if (event.type === "conversation.item.input_audio_transcription.completed") {
      transcriptLines.push(`Caller: ${event.transcript}`);
    }
    if (event.type === "response.audio_transcript.done") {
      transcriptLines.push(`AI: ${event.transcript}`);

      if (soundsLikeClarificationRequest(event.transcript)) {
        consecutiveClarifications++;
        if (consecutiveClarifications >= 2) {
          consecutiveClarifications = 0;
          openaiWs.send(
            JSON.stringify({
              type: "conversation.item.create",
              item: {
                type: "message",
                role: "system",
                content: [
                  {
                    type: "input_text",
                    text:
                      "You've now failed to understand the caller twice in a row. Stop trying to clarify " +
                      "further — apologize once, let them know someone will call them back shortly, call " +
                      "take_message with whatever contact info you have, then call end_call.",
                  },
                ],
              },
            }),
          );
          openaiWs.send(JSON.stringify({ type: "response.create" }));
        }
      } else {
        consecutiveClarifications = 0;
      }
    }
    if (event.type === "error") console.error("OpenAI error:", event.error);
  });

  twilioWs.on("message", (raw) => {
    const msg = JSON.parse(raw.toString());
    if (msg.event === "media" && openaiWs.readyState === WebSocket.OPEN) {
      openaiWs.send(JSON.stringify({ type: "input_audio_buffer.append", audio: msg.media.payload }));
    }
    if (msg.event === "stop") {
      openaiWs.close();
      onCallEnd(
        disposition,
        lastSummary || `Call ended, disposition: ${disposition}`,
        triageClass,
        transcriptLines.join("\n"),
        anyToolCalled,
      );
    }
  });

  twilioWs.on("close", () => openaiWs.close());
}

const server = createServer((req, res) => {
  if (req.method === "POST" && req.url === "/voice") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      const params = new URLSearchParams(body);
      const to = params.get("To") ?? "";
      const from = params.get("From") ?? "";
      const wsUrl = `wss://${req.headers.host}/media`;
      res.writeHead(200, { "Content-Type": "text/xml" });
      res.end(
        `<?xml version="1.0" encoding="UTF-8"?><Response><Connect><Stream url="${wsUrl}">` +
          `<Parameter name="to" value="${to}" /><Parameter name="from" value="${from}" />` +
          `</Stream></Connect></Response>`,
      );
    });
    return;
  }
  if (req.method === "POST" && req.url === "/whisper") {
    res.writeHead(200, { "Content-Type": "text/xml" });
    res.end(
      `<?xml version="1.0" encoding="UTF-8"?><Response><Say>Urgent PipeLine call — connecting you now.</Say></Response>`,
    );
    return;
  }
  if (req.method === "POST" && req.url === "/sms") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", async () => {
      const params = new URLSearchParams(body);
      const to = params.get("To") ?? "";
      const from = params.get("From") ?? "";
      const text = params.get("Body") ?? "";
      const ctx = await loadAccountForNumber(to, from);
      res.writeHead(200, { "Content-Type": "text/xml" });
      if (!ctx) {
        res.end(`<?xml version="1.0" encoding="UTF-8"?><Response></Response>`);
        return;
      }
      const reply = await handleInboundSms(supabase, twilioCreds, { accountId: ctx.account.id, fromE164: from, body: text }, googleCreds);
      res.end(
        `<?xml version="1.0" encoding="UTF-8"?><Response>${reply ? `<Message>${reply}</Message>` : ""}</Response>`,
      );
    });
    return;
  }
  res.writeHead(404);
  res.end();
});

const wss = new WebSocketServer({ server, path: "/media" });
wss.on("connection", (twilioWs, req) => {
  const startedAt = new Date().toISOString();
  const host = req.headers.host;

  let resolveStreamSid: (sid: string) => void;
  const streamSidPromise = new Promise<string>((resolve) => (resolveStreamSid = resolve));

  // Twilio strips query params from the <Stream> url entirely — custom data must
  // travel as nested <Parameter> tags, delivered here in start.customParameters.
  twilioWs.on("message", async function onFirstMessage(raw) {
    const msg = JSON.parse(raw.toString());
    if (msg.event !== "start") return;
    resolveStreamSid(msg.start.streamSid);
    twilioWs.off("message", onFirstMessage);

    const to = msg.start.customParameters?.to ?? "";
    const from = msg.start.customParameters?.from ?? "";
    const ctx = await loadAccountForNumber(to, from);
    if (!ctx) {
      console.error(`No account found for To=${to} From=${from} — hanging up`);
      twilioWs.close();
      return;
    }

    // Inserted now (not at call end) so escalate_to_owner has a real call_id to
    // attach escalations rows to mid-call; updated in place once the call ends.
    const { data: callRow } = await supabase
      .from("calls")
      .insert({ account_id: ctx.account.id, direction: "inbound", from_e164: from, started_at: startedAt, outcome: "abandoned" })
      .select("id")
      .single();
    if (!callRow) {
      console.error("Failed to create call row — hanging up");
      twilioWs.close();
      return;
    }

    const callSid = msg.start.callSid as string;
    const session: CallSession = {
      ctx,
      callerPhoneE164: from,
      callId: callRow.id,
      callSid,
      whisperTwimlUrl: `https://${host}/whisper`,
    };

    await logEvent(supabase, ctx.account.id, "call_answered", { call_id: callRow.id, from_e164: from });

    // Dual-channel recording of the live call via Twilio's REST API (not a
    // <Record> TwiML verb, which we can't use since <Connect><Stream> already
    // owns the TwiML). Best-effort — a failed recording start shouldn't kill
    // the call itself.
    const twilioAuth = Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString("base64");
    fetch(`https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Calls/${callSid}/Recordings.json`, {
      method: "POST",
      headers: { Authorization: `Basic ${twilioAuth}`, "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ RecordingChannels: "dual" }),
    }).catch((err) => console.error("Failed to start call recording:", err));

    bridgeToOpenAI(twilioWs, streamSidPromise, session, async (outcome, summary, triageClass, transcript, anyToolCalled) => {
      const durationS = Math.round((Date.now() - new Date(startedAt).getTime()) / 1000);

      // FR-1.6 spam filtering v1: a call that ended abandoned, was very
      // short, and never reached a single tool call looks like a robocall/
      // silent hangup rather than a real caller who got interrupted. Simple
      // heuristic ceiling — no caller-ID reputation lookup, no ML; upgrade
      // path is a real spam-list integration once there's call volume to
      // tune against.
      if (outcome === "abandoned" && durationS < 8 && !anyToolCalled) {
        outcome = "spam";
      }

      // Twilio's own recording media URL — auth-protected with our Twilio creds,
      // not a fully public signed URL (that would mean downloading and
      // re-uploading to Supabase Storage; deferred, this is the pragmatic v1).
      let audioUrl: string | null = null;
      const recordingsRes = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Calls/${callSid}/Recordings.json`,
        { headers: { Authorization: `Basic ${twilioAuth}` } },
      ).catch(() => null);
      if (recordingsRes?.ok) {
        const { recordings } = (await recordingsRes.json()) as { recordings: { sid: string }[] };
        if (recordings[0]) {
          audioUrl = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Recordings/${recordings[0].sid}.mp3`;
        }
      }

      let transcriptUrl: string | null = null;
      if (transcript) {
        const path = `${ctx.account.id}/${callRow.id}.txt`;
        const { error: uploadErr } = await supabase.storage
          .from("call-transcripts")
          .upload(path, transcript, { contentType: "text/plain", upsert: true });
        if (!uploadErr) {
          const { data: signed } = await supabase.storage
            .from("call-transcripts")
            .createSignedUrl(path, 60 * 60 * 24 * 7); // 7 days
          transcriptUrl = signed?.signedUrl ?? null;
        } else {
          console.error("Transcript upload failed:", uploadErr.message);
        }
      }

      await supabase
        .from("calls")
        .update({ duration_s: durationS, outcome, summary, triage_class: triageClass, audio_url: audioUrl, transcript_url: transcriptUrl })
        .eq("id", callRow.id);

      await logEvent(supabase, ctx.account.id, "call_ended", {
        call_id: callRow.id,
        outcome,
        triage_class: triageClass,
        duration_s: durationS,
      });
      console.log(`Call logged: ${outcome} — ${summary}`);
    });
  });
});

server.listen(PORT, () => console.log(`Voice engine listening on :${PORT}`));

// No cron infra yet (Fly.io not deployed) — an in-process interval is the
// lazy correct thing for a single-process dev/early-launch deployment. Move
// to a real scheduled job before running more than one instance of this
// process, or reminders/digests would double-send.
const SWEEP_INTERVAL_MS = 5 * 60_000;
setInterval(() => {
  sweepReminders(supabase, twilioCreds).catch((err) => console.error("Reminder sweep failed:", err));
  sweepOwnerDigests(supabase, twilioCreds).catch((err) => console.error("Digest sweep failed:", err));
  if (process.env.VOICE_WEBHOOK_BASE_URL) {
    sweepForwardingChecks(supabase, twilioCreds, process.env.VOICE_WEBHOOK_BASE_URL).catch((err) =>
      console.error("Forwarding check sweep failed:", err),
    );
  }
}, SWEEP_INTERVAL_MS);
