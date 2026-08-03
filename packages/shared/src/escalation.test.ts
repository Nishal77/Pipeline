import { test } from "node:test";
import assert from "node:assert/strict";
import { decideEscalationRetry, handleEscalationDialStatus } from "./escalation.js";

test("decideEscalationRetry: completed always means connected, regardless of attempt", () => {
  assert.equal(decideEscalationRetry("completed", 1), "connected");
  assert.equal(decideEscalationRetry("completed", 2), "connected");
});

test("decideEscalationRetry: no-answer on attempt 1 retries, attempt 2 exhausts", () => {
  assert.equal(decideEscalationRetry("no-answer", 1), "retry");
  assert.equal(decideEscalationRetry("no-answer", 2), "exhausted");
});

test("decideEscalationRetry: busy and failed follow the same retry ceiling as no-answer", () => {
  assert.equal(decideEscalationRetry("busy", 1), "retry");
  assert.equal(decideEscalationRetry("failed", 1), "retry");
  assert.equal(decideEscalationRetry("busy", 2), "exhausted");
});

function fakeSupabase() {
  const inserts: Record<string, unknown>[] = [];
  const updates: { table: string; values: Record<string, unknown> }[] = [];
  return {
    inserts,
    updates,
    from(table: string) {
      return {
        insert: (row: Record<string, unknown>) => {
          inserts.push({ table, ...row });
          return Promise.resolve({ error: null });
        },
        update: (values: Record<string, unknown>) => ({
          eq: () => {
            updates.push({ table, values });
            return Promise.resolve({ error: null });
          },
        }),
      };
    },
  } as unknown as Parameters<typeof handleEscalationDialStatus>[0] & { inserts: typeof inserts; updates: typeof updates };
}

test("handleEscalationDialStatus: no-answer on attempt 1 returns a retry Dial with attempt=2", async () => {
  const supabase = fakeSupabase();
  const twiml = await handleEscalationDialStatus(supabase, {
    accountId: "acc1",
    callId: "call1",
    ownerCellE164: "+15551234567",
    reason: "gas smell",
    attempt: 1,
    dialCallStatus: "no-answer",
    origin: "https://voice.example.com",
  });
  assert.match(twiml, /<Dial action="https:\/\/voice\.example\.com\/escalation-status\?[^"]*attempt=2[^"]*"/);
  assert.equal(supabase.inserts[0].method, "retry_call");
  assert.equal(supabase.inserts[0].result, "retry_1_no-answer");
  assert.equal(supabase.updates.length, 0); // no calls.outcome write yet — still mid-retry
});

test("handleEscalationDialStatus: no-answer on attempt 2 (max) exhausts to a voicemail Record", async () => {
  const supabase = fakeSupabase();
  const twiml = await handleEscalationDialStatus(supabase, {
    accountId: "acc1",
    callId: "call1",
    ownerCellE164: "+15551234567",
    reason: "gas smell",
    attempt: 2,
    dialCallStatus: "no-answer",
    origin: "https://voice.example.com",
  });
  assert.match(twiml, /<Record maxLength="120" action="https:\/\/voice\.example\.com\/voicemail-callback\?[^"]*"/);
  assert.equal(supabase.inserts[0].result, "exhausted_no-answer");
  assert.deepEqual(supabase.updates[0], { table: "calls", values: { outcome: "escalated_unreached" } });
});

test("handleEscalationDialStatus: completed marks the call connected, no more Dial", async () => {
  const supabase = fakeSupabase();
  const twiml = await handleEscalationDialStatus(supabase, {
    accountId: "acc1",
    callId: "call1",
    ownerCellE164: "+15551234567",
    reason: "gas smell",
    attempt: 1,
    dialCallStatus: "completed",
    origin: "https://voice.example.com",
  });
  assert.doesNotMatch(twiml, /<Dial/);
  assert.equal(supabase.inserts[0].result, "connected");
  assert.deepEqual(supabase.updates[0], { table: "calls", values: { outcome: "escalated_connected" } });
});
