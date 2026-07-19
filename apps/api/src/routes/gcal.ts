// FR-4.1 Google Calendar OAuth — plain fetch against Google's endpoints, no
// googleapis SDK needed for a token exchange + one list-calendars smoke test.
// This proves the OAuth handshake and stores real tokens; the actual two-way
// sync (conflict rule, re-auth banner) is separate follow-on work.
import type { FastifyInstance } from "fastify";
import { env } from "../lib/env.js";
import { supabase } from "../lib/supabase.js";

const SCOPE = "https://www.googleapis.com/auth/calendar";

export async function gcalRoutes(app: FastifyInstance): Promise<void> {
  app.get("/oauth/google/start", async (req, reply) => {
    const accountId = (req.query as { account_id?: string }).account_id;
    if (!accountId) return reply.code(400).send({ ok: false, error: "account_id query param required" });

    const params = new URLSearchParams({
      client_id: env.GOOGLE_CLIENT_ID,
      redirect_uri: env.GOOGLE_REDIRECT_URI,
      response_type: "code",
      scope: SCOPE,
      access_type: "offline",
      prompt: "consent",
      state: accountId,
    });
    return reply.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
  });

  app.get("/oauth/google/callback", async (req, reply) => {
    const { code, state, error } = req.query as { code?: string; state?: string; error?: string };
    if (error) return reply.code(400).send({ ok: false, error });
    if (!code || !state) return reply.code(400).send({ ok: false, error: "missing code or state" });

    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: env.GOOGLE_CLIENT_ID,
        client_secret: env.GOOGLE_CLIENT_SECRET,
        redirect_uri: env.GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
      }),
    });
    if (!tokenRes.ok) return reply.code(502).send({ ok: false, error: `token exchange failed: ${await tokenRes.text()}` });
    const tokens = (await tokenRes.json()) as { access_token: string; refresh_token?: string; expires_in: number };

    await supabase
      .from("business_profile")
      .update({
        gcal_credentials: {
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
        },
      })
      .eq("account_id", state);

    // Smoke test: prove the token actually works, not just that the exchange returned 200.
    const calListRes = await fetch("https://www.googleapis.com/calendar/v3/users/me/calendarList", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    const calList = (await calListRes.json()) as { items?: { summary: string }[] };

    return reply.send({
      ok: true,
      token_stored: true,
      has_refresh_token: Boolean(tokens.refresh_token),
      calendars_found: calList.items?.map((c) => c.summary) ?? [],
    });
  });
}
