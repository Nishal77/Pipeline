import { test } from "node:test";
import assert from "node:assert/strict";
import { percentile } from "./stats.js";

test("p50 of 1..10 is the median", () => {
  const xs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  assert.equal(percentile(xs, 50), 5);
});

test("p95 of 100 evenly spaced samples is near the top", () => {
  const xs = Array.from({ length: 100 }, (_, i) => i + 1);
  assert.equal(percentile(xs, 95), 95);
});

test("single sample returns itself for any percentile", () => {
  assert.equal(percentile([42], 95), 42);
});
