import { test } from "node:test";
import assert from "node:assert/strict";
import { classifyUrgency } from "./triage.js";

test("gas smell classifies as EMERGENCY", () => {
  assert.equal(classifyUrgency(["I smell gas near the water heater"]).triage_class, "EMERGENCY");
});

test("no hot water classifies as URGENT_TODAY", () => {
  assert.equal(classifyUrgency(["no hot water since this morning"]).triage_class, "URGENT_TODAY");
});

test("maintenance request classifies as ROUTINE", () => {
  assert.equal(classifyUrgency(["wants a quote for annual maintenance"]).triage_class, "ROUTINE");
});

test("ambiguous non-empty signal resolves upward, not down to ROUTINE", () => {
  assert.equal(classifyUrgency(["something about the kitchen sink"]).triage_class, "URGENT_TODAY");
});

test("no signals yet defaults to ROUTINE", () => {
  assert.equal(classifyUrgency([]).triage_class, "ROUTINE");
});
