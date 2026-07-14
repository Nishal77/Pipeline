// CLI: pnpm --filter @pipeline/voice benchmark -- --option=both --trials=10 --audio=./fixture.raw
// Prints the p50/p95/$-per-min score matrix that feeds docs/adr/001-voice-stack.md.
// Twilio-vs-Telnyx trunk latency is a separate manual test (see that ADR's template) —
// this harness only benchmarks the STT/LLM/TTS pipeline choice (Option A vs B).
import { runOptionABenchmark, optionACostPerMinUsd } from "./optionA.js";
import { runOptionBBenchmark, optionBCostPerMinUsd } from "./optionB.js";
import { summarize, type BenchmarkResult } from "./stats.js";

function arg(name: string, fallback: string): string {
  const flag = process.argv.find((a) => a.startsWith(`--${name}=`));
  return flag ? flag.split("=")[1] : fallback;
}

async function main(): Promise<void> {
  const option = arg("option", "both"); // A | B | both
  const trials = Number(arg("trials", "10"));
  const audioPath = arg("audio", "./fixtures/synthetic-tone.raw");

  const results: BenchmarkResult[] = [];

  if (option === "A" || option === "both") {
    const latencies = await runOptionABenchmark(audioPath, trials);
    results.push(summarize("A", "direct", latencies, optionACostPerMinUsd));
  }
  if (option === "B" || option === "both") {
    const latencies = await runOptionBBenchmark(audioPath, trials);
    results.push(summarize("B", "direct", latencies, optionBCostPerMinUsd));
  }

  console.table(results);
  console.log(
    "\nBarge-in quality is not automated here — score it manually per PRD §14.2 " +
      "(interrupt mid-response on a live trial and note reaction time), then fill " +
      "docs/adr/001-voice-stack.md with these numbers plus that judgment call.",
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
