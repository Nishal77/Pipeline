import { test } from "node:test";
import assert from "node:assert/strict";
import { agentTools } from "./agent-tools.js";

test("book_job rejects missing address", () => {
  const result = agentTools.book_job.safeParse({
    slot_id: "s1",
    customer_name: "Maria",
    customer_phone_e164: "+15555550182",
    job_type: "minor_repair",
  });
  assert.equal(result.success, false);
});

test("classify_urgency accepts feature list", () => {
  const result = agentTools.classify_urgency.safeParse({ features: ["water everywhere"] });
  assert.equal(result.success, true);
});
