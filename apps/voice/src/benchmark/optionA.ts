// Option A: realtime speech-to-speech (OpenAI Realtime-class, PRD §14.2).
// Measures wall-clock ms from committing caller audio to the first audio byte back —
// the number that maps to NFR-1 (<1.0s p50 / <1.8s p95, caller-speech-end -> AI-audio-start).
import { readFileSync } from "node:fs";
import WebSocket from "ws";

const REALTIME_URL = "wss://api.openai.com/v1/realtime?model=gpt-realtime";

// $/min from OpenAI's published realtime pricing at benchmark time — this drifts,
// re-check against current pricing before trusting the number in the ADR.
const EST_COST_PER_MIN_USD = 0.24;

export async function runOptionATrial(pcm16Base64: string): Promise<number> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY not set");

  return new Promise((resolve, reject) => {
    const ws = new WebSocket(REALTIME_URL, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    let committedAt = 0;
    const timeout = setTimeout(() => {
      ws.close();
      reject(new Error("Option A trial timed out after 10s"));
    }, 10_000);

    ws.on("open", () => {
      ws.send(
        JSON.stringify({
          type: "session.update",
          session: {
            type: "realtime",
            output_modalities: ["audio"],
            // Manual commit, not server VAD: our synthetic fixture is a quiet tone
            // that a voice-activity detector would never trigger on.
            audio: { input: { turn_detection: null } },
          },
        }),
      );
    });

    ws.on("message", (raw) => {
      const event = JSON.parse(raw.toString());

      // Session isn't ready to accept audio until the server acks our session.update —
      // appending before this landed is what caused "buffer has 0.00ms of audio".
      if (event.type === "session.updated") {
        ws.send(JSON.stringify({ type: "input_audio_buffer.append", audio: pcm16Base64 }));
        committedAt = performance.now();
        ws.send(JSON.stringify({ type: "input_audio_buffer.commit" }));
        ws.send(JSON.stringify({ type: "response.create" }));
      }
      if (event.type === "response.output_audio.delta") {
        const latencyMs = performance.now() - committedAt;
        clearTimeout(timeout);
        ws.close();
        resolve(latencyMs);
      }
      if (event.type === "error") {
        clearTimeout(timeout);
        ws.close();
        reject(new Error(`Option A error: ${JSON.stringify(event)}`));
      }
    });

    ws.on("error", (err) => {
      clearTimeout(timeout);
      reject(err);
    });
  });
}

export async function runOptionABenchmark(sampleAudioPath: string, trials: number): Promise<number[]> {
  // Sample audio must be 24kHz mono PCM16 raw, base64-encoded on read (Realtime API format).
  const pcm16Base64 = readFileSync(sampleAudioPath).toString("base64");
  const latencies: number[] = [];
  for (let i = 0; i < trials; i++) {
    latencies.push(await runOptionATrial(pcm16Base64));
  }
  return latencies;
}

export const optionACostPerMinUsd = EST_COST_PER_MIN_USD;
