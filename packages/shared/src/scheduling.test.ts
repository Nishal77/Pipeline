import { test } from "node:test";
import assert from "node:assert/strict";
import { createClient } from "@supabase/supabase-js";
import { holdSlot } from "./scheduling.js";

// Integration test — needs a real DB, skips cleanly without one (CI without
// live secrets shouldn't fail). This is the actual FR-4.5 exit-gate check:
// "concurrency test two simultaneous calls on one slot" — the unique partial
// index is what's really being tested here, not application code.
const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;

test(
  "10 concurrent holds on the same slot: exactly one wins, every run",
  { skip: !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY ? "no live Supabase creds in env" : false },
  async () => {
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });

    const { data: account } = await supabase.from("accounts").select("id").limit(1).single();
    const { data: jobType } = await supabase.from("job_types").select("id, duration_min").eq("account_id", account!.id).limit(1).single();
    assert.ok(account && jobType, "seed data (account + job_type) must exist to run this test");

    for (let run = 0; run < 10; run++) {
      const slotId = new Date(Date.now() + (run + 1) * 3_600_000).toISOString(); // a distinct future hour each run
      const attempts: Awaited<ReturnType<typeof holdSlot>>[] = await Promise.all(
        Array.from({ length: 10 }, () => holdSlot(supabase, account!.id, jobType!.id, slotId, jobType!.duration_min)),
      );
      const wins = attempts.filter((a) => a.held).length;
      assert.equal(wins, 1, `run ${run}: expected exactly 1 winner among 10 concurrent holds, got ${wins}`);

      await supabase
        .from("bookings")
        .delete()
        .eq("account_id", account!.id)
        .eq("job_type_id", jobType!.id)
        .eq("starts_at", slotId);
    }
  },
);
