// Real Twilio Media Streams leg for Option A (gpt-realtime), per the ADR's
// "still open" item: model-only latency was measured (673ms p95), this adds
// the actual Twilio hop. Run: pnpm --filter @pipeline/voice twilio-leg
// Needs a public HTTPS tunnel to :8787 first. With ngrok running, this
// auto-detects the URL. With any other tunnel (Pinggy, localtunnel, etc),
// pass it directly: pnpm --filter @pipeline/voice twilio-leg -- --tunnel-url=https://xxxx.a.free.pinggy.link
// Then call TWILIO_TEST_NUMBER from a real phone and speak — latency per
// utterance (Twilio media stop -> first Twilio media frame sent back) prints
// to stdout. Ctrl+C to stop.
import { createServer } from "node:http";
import { WebSocketServer, WebSocket } from "ws";

const PORT = 8787;
const REALTIME_URL = "wss://api.openai.com/v1/realtime?model=gpt-realtime";

const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_TEST_NUMBER, OPENAI_API_KEY } = process.env;
if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_TEST_NUMBER || !OPENAI_API_KEY) {
  throw new Error("TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_TEST_NUMBER, OPENAI_API_KEY required");
}

async function getNgrokPublicUrl(): Promise<string> {
  const res = await fetch("http://127.0.0.1:4040/api/tunnels");
  const { tunnels } = (await res.json()) as { tunnels: { public_url: string }[] };
  const https = tunnels.find((t) => t.public_url.startsWith("https://"));
  if (!https) throw new Error("No ngrok tunnel found — start `ngrok http 8787` first");
  return https.public_url;
}

async function pointNumberAt(publicUrl: string): Promise<void> {
  const sidRes = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/IncomingPhoneNumbers.json?PhoneNumber=${encodeURIComponent(TWILIO_TEST_NUMBER!)}`,
    { headers: { Authorization: `Basic ${Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString("base64")}` } },
  );
  const { incoming_phone_numbers } = (await sidRes.json()) as { incoming_phone_numbers: { sid: string }[] };
  const sid = incoming_phone_numbers[0]?.sid;
  if (!sid) throw new Error(`${TWILIO_TEST_NUMBER} not found on this account`);

  const body = new URLSearchParams({ VoiceUrl: `${publicUrl}/voice`, VoiceMethod: "POST" });
  await fetch(`https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/IncomingPhoneNumbers/${sid}.json`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });
  console.log(`Twilio voice webhook set to ${publicUrl}/voice`);
}

function bridgeToOpenAI(twilioWs: WebSocket, streamSidPromise: Promise<string>): void {
  const openaiWs = new WebSocket(REALTIME_URL, { headers: { Authorization: `Bearer ${OPENAI_API_KEY}` } });
  let lastCallerAudioAt = 0;

  openaiWs.on("open", () => {
    openaiWs.send(
      JSON.stringify({
        type: "session.update",
        session: {
          type: "realtime",
          output_modalities: ["audio"],
          audio: {
            input: { format: { type: "audio/pcmu" }, turn_detection: { type: "server_vad" } },
            output: { format: { type: "audio/pcmu" } },
          },
        },
      }),
    );
  });

  openaiWs.on("message", async (raw) => {
    const event = JSON.parse(raw.toString());
    if (event.type === "response.output_audio.delta") {
      if (lastCallerAudioAt) {
        console.log(`Twilio-leg latency: ${(performance.now() - lastCallerAudioAt).toFixed(0)}ms`);
        lastCallerAudioAt = 0;
      }
      const streamSid = await streamSidPromise;
      twilioWs.send(JSON.stringify({ event: "media", streamSid, media: { payload: event.delta } }));
    }
    if (event.type === "error") console.error("OpenAI error:", event.error);
  });

  twilioWs.on("message", (raw) => {
    const msg = JSON.parse(raw.toString());
    if (msg.event === "media" && openaiWs.readyState === WebSocket.OPEN) {
      lastCallerAudioAt = performance.now();
      openaiWs.send(JSON.stringify({ type: "input_audio_buffer.append", audio: msg.media.payload }));
    }
    if (msg.event === "stop") openaiWs.close();
  });

  twilioWs.on("close", () => openaiWs.close());
}

const server = createServer((req, res) => {
  if (req.method === "POST" && req.url === "/voice") {
    const wsUrl = `wss://${req.headers.host}/media`;
    res.writeHead(200, { "Content-Type": "text/xml" });
    res.end(
      `<?xml version="1.0" encoding="UTF-8"?><Response><Connect><Stream url="${wsUrl}" /></Connect></Response>`,
    );
    return;
  }
  res.writeHead(404);
  res.end();
});

const wss = new WebSocketServer({ server, path: "/media" });
wss.on("connection", (twilioWs) => {
  let resolveStreamSid: (sid: string) => void;
  const streamSidPromise = new Promise<string>((resolve) => (resolveStreamSid = resolve));

  twilioWs.on("message", (raw) => {
    const msg = JSON.parse(raw.toString());
    if (msg.event === "start") {
      console.log(`Call started, streamSid=${msg.start.streamSid}`);
      resolveStreamSid(msg.start.streamSid);
    }
  });

  bridgeToOpenAI(twilioWs, streamSidPromise);
});

server.listen(PORT, async () => {
  console.log(`Listening on :${PORT}`);
  const tunnelFlag = process.argv.find((a) => a.startsWith("--tunnel-url="));
  const publicUrl = tunnelFlag ? tunnelFlag.split("=")[1] : await getNgrokPublicUrl();
  await pointNumberAt(publicUrl);
  console.log(`Call ${TWILIO_TEST_NUMBER} now and speak.`);
});
