import { test } from "node:test";
import assert from "node:assert/strict";
import { computeBetaMetrics } from "./metrics.js";

function fakeSupabase(rows: { outcome: string; hang_up_within_10s: boolean; started_at: string }[]) {
  return {
    from: () => ({
      select: () => ({
        eq: () => ({
          gte: () => Promise.resolve({ data: rows }),
        }),
      }),
    }),
  } as unknown as Parameters<typeof computeBetaMetrics>[0];
}

test("hang-up rate and booking completion exclude spam correctly", async () => {
  const rows = [
    { outcome: "booked", hang_up_within_10s: false, started_at: "2026-01-01T00:00:00Z" },
    { outcome: "booked", hang_up_within_10s: false, started_at: "2026-01-01T00:00:00Z" },
    { outcome: "abandoned", hang_up_within_10s: true, started_at: "2026-01-01T00:00:00Z" },
    { outcome: "spam", hang_up_within_10s: false, started_at: "2026-01-01T00:00:00Z" },
  ];
  const result = await computeBetaMetrics(fakeSupabase(rows), "acc1", "2026-01-01T00:00:00Z");
  assert.equal(result.totalCalls, 4);
  assert.equal(result.hangUpRate, 0.25); // 1/4 total calls
  assert.equal(result.bookingCompletionRate, 2 / 3); // 2 booked / 3 non-spam
});

test("no calls yields zero rates, not NaN", async () => {
  const result = await computeBetaMetrics(fakeSupabase([]), "acc1", "2026-01-01T00:00:00Z");
  assert.equal(result.hangUpRate, 0);
  assert.equal(result.bookingCompletionRate, 0);
  assert.equal(result.jobsBookedPerWeek, 0);
});
