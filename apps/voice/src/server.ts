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
} from "@pipeline/shared";
import { checkAvailability, bookJob, holdSlot, lookupCaller, rescheduleBooking, cancelBooking } from "@pipeline/shared";

const PORT = Number(process.env.PORT ?? 8788);
const REALTIME_URL = "wss://api.openai.com/v1/realtime?model=gpt-realtime";

const { OPENAI_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
if (!OPENAI_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("OPENAI_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY required");
}
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

// Only the tools this pass actually wires up — the rest of agentTools
// (escalate_to_owner, send_sms, classify_urgency) stay defined in the shared
// contract for later phases but aren't exposed to the model yet.
const VOICE_TOOLS = [
  "check_availability",
  "hold_slot",
  "book_job",
  "reschedule",
  "cancel",
  "lookup_caller",
  "take_message",
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
    "Call end_call once the call is wrapped up, with the right disposition. " +
    (prices ? `Only quote these exact prices, never invent numbers: ${prices}. ` : "") +
    "If the caller describes a gas smell or gas leak, immediately and firmly tell them to leave the building " +
    "and call the gas company or 911 before anything else — do not continue with booking until they confirm " +
    "they are safe."
  );
}

function bridgeToOpenAI(
  twilioWs: WebSocket,
  streamSidPromise: Promise<string>,
  ctx: Awaited<ReturnType<typeof loadAccountForNumber>>,
  callerPhoneE164: string,
  onCallEnd: (outcome: string, summary: string) => void,
) {
  if (!ctx) {
    twilioWs.close();
    return;
  }
  const openaiWs = new WebSocket(REALTIME_URL, { headers: { Authorization: `Bearer ${OPENAI_API_KEY}` } });
  let disposition = "abandoned";
  let lastSummary = "";

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
          output_modalities: ["audio"],
          instructions: buildInstructions(ctx.profile, callerPhoneE164),
          tools: toolSchemas,
          audio: {
            // semantic_vad waits for the sentence to sound complete instead of firing
            // on a fixed silence timer — server_vad's default was cutting callers off
            // mid-thought during natural pauses. eagerness "low" favors patience over
            // snappy turnaround, which is the right tradeoff for a booking call.
            input: {
              format: { type: "audio/pcmu" },
              turn_detection: { type: "semantic_vad", eagerness: "low" },
            },
            output: { format: { type: "audio/pcmu" }, voice: "marin" },
          },
        },
      }),
    );
  });

  async function runTool(name: string, args: Record<string, unknown>): Promise<unknown> {
    const jobType = ctx!.jobTypes[0]; // Phase 2 stub: one job type per account, per CLAUDE.md scope
    switch (name) {
      case "check_availability": {
        CheckAvailabilityInput.parse(args);
        if (!jobType) return { error: "no job types configured for this account" };
        const slots = await checkAvailability(supabase, ctx!.account.id, jobType.id);
        return { slots };
      }
      case "hold_slot": {
        const input = HoldSlotInput.parse(args);
        if (!jobType) return { error: "no job types configured for this account" };
        return await holdSlot(supabase, ctx!.account.id, jobType.id, input.slot_id);
      }
      case "lookup_caller": {
        const input = LookupCallerInput.parse(args);
        return await lookupCaller(supabase, ctx!.account.id, input.phone_e164);
      }
      case "reschedule": {
        const input = RescheduleInput.parse(args);
        const result = await rescheduleBooking(supabase, ctx!.account.id, input.booking_id, input.new_slot_id);
        if ("ok" in result) {
          disposition = "booked";
          lastSummary = `Rescheduled booking ${input.booking_id} to ${input.new_slot_id}`;
        }
        return result;
      }
      case "cancel": {
        const input = CancelInput.parse(args);
        const result = await cancelBooking(supabase, ctx!.account.id, input.booking_id);
        if ("ok" in result) {
          disposition = "callback";
          lastSummary = `Canceled booking ${input.booking_id}`;
        }
        return result;
      }
      case "book_job": {
        const input = BookJobInput.parse(args);
        if (!jobType) return { error: "no job types configured for this account" };
        const result = await bookJob(supabase, {
          accountId: ctx!.account.id,
          jobTypeId: jobType.id,
          slotId: input.slot_id,
          customerName: input.customer_name,
          customerPhoneE164: input.customer_phone_e164,
          address: input.address,
          durationMin: jobType.duration_min,
        });
        if ("booking_id" in result) {
          disposition = "booked";
          lastSummary = `Booked ${jobType.name} for ${input.customer_name} at ${input.slot_id}`;
        }
        return result;
      }
      case "take_message": {
        const input = TakeMessageInput.parse(args);
        disposition = "message";
        lastSummary = `Message from ${input.customer_phone_e164}: ${input.message}`.slice(0, 280);
        return { ok: true };
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
    if (event.type === "error") console.error("OpenAI error:", event.error);
  });

  twilioWs.on("message", (raw) => {
    const msg = JSON.parse(raw.toString());
    if (msg.event === "media" && openaiWs.readyState === WebSocket.OPEN) {
      openaiWs.send(JSON.stringify({ type: "input_audio_buffer.append", audio: msg.media.payload }));
    }
    if (msg.event === "stop") {
      openaiWs.close();
      onCallEnd(disposition, lastSummary || `Call ended, disposition: ${disposition}`);
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
  res.writeHead(404);
  res.end();
});

const wss = new WebSocketServer({ server, path: "/media" });
wss.on("connection", (twilioWs) => {
  const startedAt = new Date().toISOString();

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

    bridgeToOpenAI(twilioWs, streamSidPromise, ctx, from, async (outcome, summary) => {
      await supabase.from("calls").insert({
        account_id: ctx.account.id,
        direction: "inbound",
        from_e164: from,
        started_at: startedAt,
        duration_s: Math.round((Date.now() - new Date(startedAt).getTime()) / 1000),
        outcome,
        summary,
        triage_class: "ROUTINE",
      });
      console.log(`Call logged: ${outcome} — ${summary}`);
    });
  });
});

server.listen(PORT, () => console.log(`Voice engine listening on :${PORT}`));
