// PRD §15 — every feature ships with its analytics events, no silent features.
import type { SupabaseClient } from "@supabase/supabase-js";

export async function logEvent(
  supabase: SupabaseClient,
  accountId: string,
  name: string,
  properties: Record<string, unknown> = {},
): Promise<void> {
  await supabase.from("events_analytics").insert({ account_id: accountId, name, properties });
}
