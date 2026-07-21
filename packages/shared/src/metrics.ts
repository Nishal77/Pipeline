// Phase 7 exit-gate metrics (PRD §7.2): hang-up rate <10%, booking completion
// >60%, north star = jobs booked/customer/week. "Answer rate >99%" needs
// Twilio's own call log (calls that never reached this server at all aren't
// in our DB) — not computable from here, flagged rather than faked.
import type { SupabaseClient } from "@supabase/supabase-js";

export interface BetaMetrics {
  totalCalls: number;
  hangUpRate: number; // 0-1
  bookingCompletionRate: number; // 0-1, excludes spam
  jobsBookedPerWeek: number;
}

export async function computeBetaMetrics(supabase: SupabaseClient, accountId: string, sinceISO: string): Promise<BetaMetrics> {
  const { data: calls } = await supabase
    .from("calls")
    .select("outcome, hang_up_within_10s, started_at")
    .eq("account_id", accountId)
    .gte("started_at", sinceISO);
  const rows = calls ?? [];

  const totalCalls = rows.length;
  const nonSpam = rows.filter((c) => c.outcome !== "spam");
  const booked = nonSpam.filter((c) => c.outcome === "booked");
  const hungUp = rows.filter((c) => c.hang_up_within_10s);

  const weeksElapsed = Math.max(1, (Date.now() - new Date(sinceISO).getTime()) / (7 * 86_400_000));

  return {
    totalCalls,
    hangUpRate: totalCalls ? hungUp.length / totalCalls : 0,
    bookingCompletionRate: nonSpam.length ? booked.length / nonSpam.length : 0,
    jobsBookedPerWeek: booked.length / weeksElapsed,
  };
}
