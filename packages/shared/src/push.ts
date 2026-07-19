// Web Push — real triggers wired in apps/voice (emergency escalation, new
// booking), not just a manual test button. VAPID keys are the only config;
// no push-notification service/SDK needed beyond the `web-push` library.
import webpush from "web-push";
import type { SupabaseClient } from "@supabase/supabase-js";

export interface VapidCreds {
  publicKey: string;
  privateKey: string;
  contactEmail: string;
}

export async function sendPushToAccount(
  supabase: SupabaseClient,
  vapid: VapidCreds,
  accountId: string,
  notification: { title: string; body: string; url?: string },
): Promise<void> {
  const { data: subs } = await supabase.from("push_subscriptions").select("id, endpoint, p256dh, auth").eq("account_id", accountId);
  if (!subs || subs.length === 0) return;

  webpush.setVapidDetails(`mailto:${vapid.contactEmail}`, vapid.publicKey, vapid.privateKey);

  await Promise.all(
    subs.map(async (sub) => {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          JSON.stringify(notification),
        );
      } catch (err: unknown) {
        const statusCode = (err as { statusCode?: number }).statusCode;
        if (statusCode === 404 || statusCode === 410) {
          // Subscription expired/revoked on the browser side — clean it up.
          await supabase.from("push_subscriptions").delete().eq("id", sub.id);
        } else {
          console.error(`Push send failed for subscription ${sub.id}:`, err);
        }
      }
    }),
  );
}
