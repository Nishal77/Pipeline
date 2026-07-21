// Phase 7 weekly review (CLAUDE.md: "Track per PRD §7.2 ... weekly triage
// confusion matrix"). Run: pnpm --filter @pipeline/api beta-metrics <account_id> [days]
import { supabase } from "../lib/supabase.js";
import { computeBetaMetrics } from "@pipeline/shared";

const accountId = process.argv[2];
const days = Number(process.argv[3] ?? 7);
if (!accountId) {
  console.error("Usage: beta-metrics <account_id> [days=7]");
  process.exit(1);
}

const sinceISO = new Date(Date.now() - days * 86_400_000).toISOString();
const m = await computeBetaMetrics(supabase, accountId, sinceISO);

console.log(`Beta metrics for ${accountId}, last ${days}d:`);
console.log(`  Total calls:            ${m.totalCalls}`);
console.log(`  Hang-up rate:           ${(m.hangUpRate * 100).toFixed(1)}%  (exit gate: <10%)`);
console.log(`  Booking completion:     ${(m.bookingCompletionRate * 100).toFixed(1)}%  (target: >60%)`);
console.log(`  Jobs booked/week:       ${m.jobsBookedPerWeek.toFixed(1)}  (north star)`);
console.log(`  Answer rate:            not computable from our DB — needs Twilio's call log (calls that never reached us aren't here)`);
