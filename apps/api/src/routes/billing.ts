// Phase 5 billing — plain Stripe REST (fetch), no `stripe` SDK, consistent
// with the rest of this codebase (Twilio/Google are also raw REST). Webhook
// signature verification uses Node's built-in crypto (Stripe's scheme is
// documented HMAC-SHA256 over "timestamp.body") — no SDK needed for that either.
import type { FastifyInstance, FastifyRequest } from "fastify";
import { createHmac, timingSafeEqual } from "node:crypto";
import { env } from "../lib/env.js";
import { supabase } from "../lib/supabase.js";

const STRIPE_API = "https://api.stripe.com/v1";
const PRICE_IDS = {
  solo_monthly: "price_1TuZrxIjPSXy5TYrVsBhPbIl",
  solo_annual: "price_1TuwwSIjPSXy5TYrMrSjx4ij",
  pro_monthly: "price_1TuZryIjPSXy5TYrq0szbuP6",
  pro_annual: "price_1TuwwTIjPSXy5TYrf939WpUO",
} as const;

function stripeAuth(): string {
  return `Basic ${Buffer.from(`${env.STRIPE_SECRET_KEY}:`).toString("base64")}`;
}

function verifyStripeSignature(rawBody: Buffer, sigHeader: string, secret: string): boolean {
  const parts = Object.fromEntries(sigHeader.split(",").map((p) => p.split("=") as [string, string]));
  const expected = createHmac("sha256", secret).update(`${parts.t}.${rawBody.toString()}`).digest("hex");
  const actual = parts.v1 ?? "";
  return actual.length === expected.length && timingSafeEqual(Buffer.from(actual), Buffer.from(expected));
}

export async function billingRoutes(app: FastifyInstance): Promise<void> {
  // Stripe needs the exact raw bytes to verify the signature — Fastify's
  // default JSON parser already consumed/reserialized it, so this route gets
  // its own content-type parser that preserves the raw buffer.
  app.addContentTypeParser("application/json", { parseAs: "buffer" }, (req, body, done) => {
    (req as FastifyRequest & { rawBody?: Buffer }).rawBody = body as Buffer;
    try {
      done(null, (body as Buffer).length ? JSON.parse((body as Buffer).toString()) : undefined);
    } catch (err) {
      done(err as Error, undefined);
    }
  });

  // Card-upfront 14-day trial (FR-8.1/8.2). account_id + plan chosen during
  // onboarding; Checkout Session collects the card without charging until
  // the trial ends.
  app.post("/billing/checkout-session", async (req, reply) => {
    const { account_id, plan, interval } = req.body as { account_id: string; plan: "solo" | "pro"; interval: "monthly" | "annual" };
    const priceId = PRICE_IDS[`${plan}_${interval}`];
    if (!priceId) return reply.code(400).send({ error: "invalid plan/interval" });

    const { data: account } = await supabase.from("accounts").select("email").eq("id", account_id).single();
    if (!account) return reply.code(404).send({ error: "account not found" });

    const res = await fetch(`${STRIPE_API}/checkout/sessions`, {
      method: "POST",
      headers: { Authorization: stripeAuth(), "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        mode: "subscription",
        customer_email: account.email,
        "line_items[0][price]": priceId,
        "line_items[0][quantity]": "1",
        "subscription_data[trial_period_days]": "14",
        payment_method_collection: "always",
        success_url: `${env.SITE_URL}/settings?billing=success`,
        cancel_url: `${env.SITE_URL}/settings?billing=cancelled`,
        "metadata[account_id]": account_id,
      }),
    });
    const session = (await res.json()) as { url?: string; error?: unknown };
    if (!session.url) return reply.code(502).send({ error: session.error ?? "checkout session failed" });
    return { url: session.url };
  });

  app.post("/billing/cancel", async (req, reply) => {
    const { account_id } = req.body as { account_id: string };
    const { data: account } = await supabase.from("accounts").select("stripe_customer_id").eq("id", account_id).single();
    if (!account?.stripe_customer_id) return reply.code(404).send({ error: "no active subscription" });

    const subsRes = await fetch(`${STRIPE_API}/subscriptions?customer=${account.stripe_customer_id}&status=active`, {
      headers: { Authorization: stripeAuth() },
    });
    const subs = (await subsRes.json()) as { data: { id: string }[] };
    for (const sub of subs.data) {
      await fetch(`${STRIPE_API}/subscriptions/${sub.id}`, {
        method: "POST",
        headers: { Authorization: stripeAuth(), "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ cancel_at_period_end: "true" }),
      });
    }
    return { ok: true };
  });

  // FR-8.4 dunning — Stripe's own Smart Retries handle the retry cadence;
  // we just mirror subscription status onto accounts.status as it changes.
  // Fallback on pause/cancel is "plain forwarding + voicemail" per §17,
  // handled by the voice pipeline reading accounts.status, not here.
  app.post("/billing/webhook", async (req, reply) => {
    const sig = req.headers["stripe-signature"] as string | undefined;
    const rawBody = (req as FastifyRequest & { rawBody?: Buffer }).rawBody;
    if (!sig || !rawBody || !env.STRIPE_WEBHOOK_SECRET || !verifyStripeSignature(rawBody, sig, env.STRIPE_WEBHOOK_SECRET)) {
      return reply.code(400).send({ error: "invalid signature" });
    }

    const event = req.body as { type: string; data: { object: Record<string, unknown> } };
    const obj = event.data.object;

    if (event.type === "checkout.session.completed") {
      const accountId = (obj.metadata as { account_id?: string })?.account_id;
      if (accountId) {
        await supabase
          .from("accounts")
          .update({ stripe_customer_id: obj.customer as string, status: "trial" })
          .eq("id", accountId);
      }
    }

    if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
      const statusMap: Record<string, string> = {
        trialing: "trial",
        active: "active",
        past_due: "past_due",
        unpaid: "past_due",
        canceled: "canceled",
      };
      const status = statusMap[obj.status as string] ?? "active";
      await supabase.from("accounts").update({ status }).eq("stripe_customer_id", obj.customer as string);
    }

    if (event.type === "invoice.payment_failed") {
      const { data: account } = await supabase.from("accounts").select("id").eq("stripe_customer_id", obj.customer as string).maybeSingle();
      if (account) {
        await supabase.from("accounts").update({ status: "past_due" }).eq("id", account.id);
        await supabase.from("events_analytics").insert({ account_id: account.id, name: "payment_failed", properties: {} });
      }
    }

    return { received: true };
  });
}
