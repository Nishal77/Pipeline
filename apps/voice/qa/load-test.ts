// Phase 6 load test (NFR-6: 500 accounts / 50 concurrent calls without re-architecture).
// Impersonates Twilio's Media Streams protocol against this server's own /media WS
// endpoint — opens N concurrent fake "calls" that each drive a real bridgeToOpenAI
// session (real OpenAI Realtime connection, real Supabase call-row insert), so this
// exercises the actual concurrency path, not a mock. Requires the voice server
// (`pnpm dev`) already running locally, and a seeded test account/phone number.
//
// Usage: pnpm --filter @pipeline/voice load-test -- --calls=50 --to=+1XXXXXXXXXX --port=8788
import WebSocket from "ws";

function arg(name: string, fallback: string): string {
  const found = process.argv.find((a) => a.startsWith(`--${name}=`));
  return found ? found.split("=")[1] : fallback;
}

const NUM_CALLS = Number(arg("calls", "50"));
const TO_NUMBER = arg("to", process.env.TWILIO_TEST_NUMBER ?? "");
const PORT = arg("port", "8788");
const CALL_DURATION_MS = Number(arg("duration-ms", "8000"));
// 0 = a true instantaneous burst (harshest case); real Twilio traffic never arrives
// in the same millisecond, so a nonzero spread models realistic arrival jitter.
const SPREAD_MS = Number(arg("spread-ms", "0"));

if (!TO_NUMBER) {
  console.error("Need a seeded test account's number: --to=+1XXXXXXXXXX (or set TWILIO_TEST_NUMBER)");
  process.exit(1);
}

interface CallResult {
  index: number;
  ok: boolean;
  connectedMs: number;
  firstAudioMs: number | null;
  error?: string;
}

function simulateCall(index: number, startDelayMs: number): Promise<CallResult> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const startedAt = performance.now();
      const ws = new WebSocket(`ws://localhost:${PORT}/media`);
    let firstAudioMs: number | null = null;
    let connectedMs = -1;

    const hardTimeout = setTimeout(() => {
      ws.close();
      resolve({ index, ok: false, connectedMs, firstAudioMs, error: "timed out" });
    }, CALL_DURATION_MS + 15_000);

    ws.on("open", () => {
      connectedMs = performance.now() - startedAt;
      ws.send(
        JSON.stringify({
          event: "start",
          start: {
            streamSid: `MZload${index}`,
            callSid: `CAload${index}${Date.now()}`,
            customParameters: { to: TO_NUMBER, from: `+1555000${String(1000 + index).slice(-4)}` },
          },
        }),
      );
      // A few seconds of silent media frames — enough to keep the Twilio-side
      // socket alive while the real OpenAI Realtime session spins up and greets.
      const silentFrame = Buffer.alloc(160, 0xff).toString("base64"); // mu-law silence
      const mediaInterval = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ event: "media", media: { payload: silentFrame } }));
      }, 20);
      setTimeout(() => {
        clearInterval(mediaInterval);
        // Real Twilio sends "stop" then closes the media socket itself — the server
        // only tears down its own OpenAI-side connection on "stop", it doesn't hang
        // up the caller's socket (that's Twilio's job in production).
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ event: "stop" }));
          setTimeout(() => ws.close(), 300);
        }
      }, CALL_DURATION_MS);
    });

    ws.on("message", (raw) => {
      const msg = JSON.parse(raw.toString());
      if (msg.event === "media" && firstAudioMs === null) firstAudioMs = performance.now() - startedAt;
    });

    ws.on("close", () => {
      clearTimeout(hardTimeout);
      resolve({ index, ok: connectedMs >= 0, connectedMs, firstAudioMs });
    });

    ws.on("error", (err) => {
      clearTimeout(hardTimeout);
      resolve({ index, ok: false, connectedMs, firstAudioMs, error: err.message });
    });
    }, startDelayMs);
  });
}

async function main() {
  console.log(`Load test: ${NUM_CALLS} concurrent simulated calls against ws://localhost:${PORT}/media (to=${TO_NUMBER})`);
  const startedAt = performance.now();
  const results = await Promise.all(
    Array.from({ length: NUM_CALLS }, (_, i) => simulateCall(i, SPREAD_MS ? Math.random() * SPREAD_MS : 0)),
  );
  const totalMs = performance.now() - startedAt;

  const ok = results.filter((r) => r.ok).length;
  const gotAudio = results.filter((r) => r.firstAudioMs !== null).length;
  const connectTimes = results.filter((r) => r.connectedMs >= 0).map((r) => r.connectedMs).sort((a, b) => a - b);
  const p50 = connectTimes[Math.floor(connectTimes.length * 0.5)] ?? NaN;
  const p95 = connectTimes[Math.floor(connectTimes.length * 0.95)] ?? NaN;

  console.log(`\n--- Load test results ---`);
  console.log(`Total wall time: ${Math.round(totalMs)}ms`);
  console.log(`Connected cleanly: ${ok}/${NUM_CALLS}`);
  console.log(`Got at least one audio frame back (real greeting reached): ${gotAudio}/${NUM_CALLS}`);
  console.log(`WS connect latency p50/p95: ${Math.round(p50)}ms / ${Math.round(p95)}ms`);
  for (const r of results.filter((r) => !r.ok)) console.log(`  FAIL #${r.index}: ${r.error ?? "unknown"}`);

  if (ok < NUM_CALLS) process.exitCode = 1;
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
