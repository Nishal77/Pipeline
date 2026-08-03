// Phase 5 billing — Lemon Squeezy REST (fetch), no SDK, consistent with the
// rest of this codebase (Twilio/Google are also raw REST). Lemon Squeezy is a
// merchant-of-record: no US entity required to go live, they collect sales
// tax themselves — chosen over Stripe because we don't have a filed entity
// yet and no Stripe invite. Webhook signature verification uses Node's
// built-in crypto (LS scheme: HMAC-SHA256 hex digest over the raw body,
// header X-Signature) — no SDK needed for that either.
import type { FastifyInstance, FastifyRequest } from "fastify";
import { createHmac, timingSafeEqual } from "node:crypto";
import { env } from "../lib/env.js";
import { supabase } from "../lib/supabase.js";

const LS_API = "https://api.lemonsqueezy.com/v1";

// ponytail: Variant IDs are created in the Lemon Squeezy dashboard (Products
// tab), one per plan x interval, each with a 14-day free trial + "require
// payment method upfront" turned on (FR-8.1/8.2 — no API param for this,
// it's a per-variant dashboard toggle). Fill these in once the store exists.
const VARIANT_IDS = {
  solo_monthly: "",
  solo_annual: "",
  pro_monthly: "",
  pro_annual: "",
} as const;

function lsHeaders(): Record<string, string> {
  return {
    Authorization: `Bearer ${env.LEMONSQUEEZY_API_KEY}`,
    Accept: "application/vnd.api+json",
    "Content-Type": "application/vnd.api+json",
  };
}

function verifyLsSignature(rawBody: Buffer, sigHeader: string, secret: string): boolean {
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  const actual = Buffer.from(sigHeader, "utf8");
  const expectedBuf = Buffer.from(expected, "utf8");
  return actual.length === expectedBuf.length && timingSafeEqual(actual, expectedBuf);
}

export async function billingRoutes(app: FastifyInstance): Promise<void> {
  // Lemon Squeezy needs the exact raw bytes to verify the signature — same
  // reason Stripe did — so this route keeps its own raw-buffer parser.
  app.addContentTypeParser("application/json", { parseAs: "buffer" }, (req, body, done) => {
    (req as FastifyRequest & { rawBody?: Buffer }).rawBody = body as Buffer;
    try {
      done(null, (body as Buffer).length ? JSON.parse((body as Buffer).toString()) : undefined);
    } catch (err) {
      done(err as Error, undefined);
    }
  });

  // Card-upfront 14-day trial (FR-8.1/8.2). Trial length + payment-required
  // are configured on the variant in the LS dashboard, not passed here.
  app.post("/billing/checkout-session", async (req, reply) => {
    const { account_id, plan, interval } = req.body as { account_id: string; plan: "solo" | "pro"; interval: "monthly" | "annual" };
    const variantId = VARIANT_IDS[`${plan}_${interval}`];
    if (!variantId) return reply.code(400).send({ error: "invalid plan/interval" });

    const { data: account } = await supabase.from("accounts").select("email").eq("id", account_id).single();
    if (!account) return reply.code(404).send({ error: "account not found" });

    const res = await fetch(`${LS_API}/checkouts`, {
      method: "POST",
      headers: lsHeaders(),
      body: JSON.stringify({
        data: {
          type: "checkouts",
          attributes: {
            checkout_data: { email: account.email, custom: { account_id } },
            product_options: {
              redirect_url: `${env.SITE_URL}/settings?billing=success`,
            },
          },
          relationships: {
            store: { data: { type: "stores", id: env.LEMONSQUEEZY_STORE_ID } },
            variant: { data: { type: "variants", id: variantId } },
          },
        },
      }),
    });
    const body = (await res.json()) as { data?: { attributes: { url: string } }; errors?: unknown };
    if (!body.data) return reply.code(502).send({ error: body.errors ?? "checkout creation failed" });
    return { url: body.data.attributes.url };
  });

  app.post("/billing/cancel", async (req, reply) => {
    const { account_id } = req.body as { account_id: string };
    const { data: account } = await supabase.from("accounts").select("ls_subscription_id").eq("id", account_id).single();
    if (!account?.ls_subscription_id) return reply.code(404).send({ error: "no active subscription" });

    // Cancelling in LS sets status to "cancelled" and access continues until
    // the end of the current billing period — same behavior as Stripe's
    // cancel_at_period_end, just the default (no separate flag needed).
    const res = await fetch(`${LS_API}/subscriptions/${account.ls_subscription_id}`, {
      method: "PATCH",
      headers: lsHeaders(),
      body: JSON.stringify({
        data: { type: "subscriptions", id: account.ls_subscription_id, attributes: { cancelled: true } },
      }),
    });
    if (!res.ok) return reply.code(502).send({ error: "cancel failed" });
    return { ok: true };
  });

  // FR-8.4 dunning — Lemon Squeezy retries failed payments itself; we just
  // mirror subscription status onto accounts.status as it changes. Fallback
  // on pause/cancel is "plain forwarding + voicemail" per §17, handled by the
  // voice pipeline reading accounts.status, not here.
  app.post("/billing/webhook", async (req, reply) => {
    const sig = req.headers["x-signature"] as string | undefined;
    const rawBody = (req as FastifyRequest & { rawBody?: Buffer }).rawBody;
    if (!sig || !rawBody || !env.LEMONSQUEEZY_WEBHOOK_SECRET || !verifyLsSignature(rawBody, sig, env.LEMONSQUEEZY_WEBHOOK_SECRET)) {
      return reply.code(400).send({ error: "invalid signature" });
    }

    const event = req.body as {
      meta: { event_name: string; custom_data?: { account_id?: string } };
      data: { id: string; attributes: Record<string, unknown> };
    };
    const attrs = event.data.attributes;

    if (event.meta.event_name === "subscription_created") {
      const accountId = event.meta.custom_data?.account_id;
      if (accountId) {
        await supabase
          .from("accounts")
          .update({ ls_customer_id: String(attrs.customer_id), ls_subscription_id: event.data.id, status: "trial" })
          .eq("id", accountId);
      }
    }

    if (event.meta.event_name === "subscription_updated" || event.meta.event_name === "subscription_cancelled") {
      const statusMap: Record<string, string> = {
        on_trial: "trial",
        active: "active",
        past_due: "past_due",
        unpaid: "past_due",
        cancelled: "canceled",
        expired: "canceled",
        paused: "paused",
      };
      const status = statusMap[attrs.status as string] ?? "active";
      await supabase.from("accounts").update({ status }).eq("ls_subscription_id", event.data.id);
    }

    if (event.meta.event_name === "subscription_payment_failed") {
      const { data: account } = await supabase.from("accounts").select("id").eq("ls_subscription_id", event.data.id).maybeSingle();
      if (account) {
        await supabase.from("accounts").update({ status: "past_due" }).eq("id", account.id);
        await supabase.from("events_analytics").insert({ account_id: account.id, name: "payment_failed", properties: {} });
      }
    }

    return { received: true };
  });
}
