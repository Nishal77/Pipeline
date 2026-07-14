export function percentile(samplesMs: number[], p: number): number {
  if (samplesMs.length === 0) throw new Error("no samples");
  const sorted = [...samplesMs].sort((a, b) => a - b);
  const idx = Math.min(sorted.length - 1, Math.ceil((p / 100) * sorted.length) - 1);
  return sorted[Math.max(0, idx)];
}

export interface BenchmarkResult {
  option: "A" | "B";
  // "twilio" / "telnyx" once run over a live phone call through that trunk;
  // "direct" = this harness's own numbers, model API only, no telephony leg.
  telephonyLeg: "twilio" | "telnyx" | "direct";
  trials: number;
  latencyP50Ms: number;
  latencyP95Ms: number;
  estCostPerMinUsd: number;
}

export function summarize(
  option: BenchmarkResult["option"],
  telephonyLeg: BenchmarkResult["telephonyLeg"],
  latenciesMs: number[],
  estCostPerMinUsd: number,
): BenchmarkResult {
  return {
    option,
    telephonyLeg,
    trials: latenciesMs.length,
    latencyP50Ms: percentile(latenciesMs, 50),
    latencyP95Ms: percentile(latenciesMs, 95),
    estCostPerMinUsd,
  };
}
