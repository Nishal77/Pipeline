"use server";
import { createClient } from "@/lib/supabase/server";

// Subscriptions are stored per-account (RLS-scoped to the signed-in owner),
// keyed by endpoint so re-subscribing on the same device just upserts.
export async function subscribeToPush(subscription: { endpoint: string; keys: { p256dh: string; auth: string } }) {
  const supabase = await createClient();
  const { data: account } = await supabase.from("accounts").select("id").single();
  if (!account) return { error: "No account found" };

  const { error } = await supabase.from("push_subscriptions").upsert(
    {
      account_id: account.id,
      endpoint: subscription.endpoint,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
    },
    { onConflict: "endpoint" },
  );
  if (error) return { error: error.message };
  return { ok: true };
}

export async function unsubscribeFromPush(endpoint: string) {
  const supabase = await createClient();
  await supabase.from("push_subscriptions").delete().eq("endpoint", endpoint);
  return { ok: true };
}
