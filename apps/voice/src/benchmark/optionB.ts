// Option B: Deepgram STT -> OpenAI chat completion -> OpenAI TTS, composed by hand
// here (Pipecat/LiveKit orchestration comes in Phase 2 if this option wins). Measures
// the same caller-speech-end -> AI-audio-start gap as Option A, summed across stages.
// ponytail: swapped in OpenAI for the LLM+TTS legs (Anthropic/ElevenLabs keys aren't
// provisioned yet) — both stages are plain fetch, no new SDK dependency needed.
import { readFileSync } from "node:fs";
import { createClient as createDeepgramClient } from "@deepgram/sdk";

// $/min from Deepgram + OpenAI (short completion + tts-1) published pricing at
// benchmark time — re-check before trusting the number in the ADR.
const EST_COST_PER_MIN_USD = 0.14;

export async function runOptionBTrial(audioPath: string): Promise<number> {
  const deepgramKey = process.env.DEEPGRAM_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;
  if (!deepgramKey || !openaiKey) {
    throw new Error("DEEPGRAM_API_KEY and OPENAI_API_KEY must both be set");
  }

  const start = performance.now();

  const deepgram = createDeepgramClient(deepgramKey);
  const { result, error: dgError } = await deepgram.listen.prerecorded.transcribeFile(
    readFileSync(audioPath),
    // Fixture is headerless raw PCM16 (same format the Realtime API takes) — Deepgram
    // needs encoding/rate/channels spelled out explicitly for that, unlike a wav/mp3 file.
    { model: "nova-2", smart_format: true, encoding: "linear16", sample_rate: 24000, channels: 1 },
  );
  if (dgError) throw dgError;
  const transcript = result.results.channels[0]?.alternatives[0]?.transcript ?? "";

  const chatResponse = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${openaiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      max_tokens: 120,
      messages: [
        { role: "user", content: `Caller said: "${transcript}". Reply as a plumbing dispatcher in one short sentence.` },
      ],
    }),
  });
  if (!chatResponse.ok) throw new Error(`OpenAI chat completion failed: ${chatResponse.status}`);
  const chatJson = await chatResponse.json();
  const replyText = chatJson.choices?.[0]?.message?.content ?? "";

  const ttsResponse = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: { Authorization: `Bearer ${openaiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: "tts-1", voice: "alloy", input: replyText, response_format: "pcm" }),
  });
  if (!ttsResponse.ok || !ttsResponse.body) throw new Error(`OpenAI TTS failed: ${ttsResponse.status}`);
  const reader = ttsResponse.body.getReader();
  await reader.read(); // first chunk = first audio byte
  const latencyMs = performance.now() - start;
  await reader.cancel();

  return latencyMs;
}

export async function runOptionBBenchmark(sampleAudioPath: string, trials: number): Promise<number[]> {
  const latencies: number[] = [];
  for (let i = 0; i < trials; i++) {
    latencies.push(await runOptionBTrial(sampleAudioPath));
  }
  return latencies;
}

export const optionBCostPerMinUsd = EST_COST_PER_MIN_USD;
