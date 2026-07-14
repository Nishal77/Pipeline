import type { FastifyInstance } from "fastify";
import { supabase } from "../lib/supabase.js";

export async function healthRoutes(app: FastifyInstance): Promise<void> {
  app.get("/health", async () => ({ ok: true, ts: new Date().toISOString() }));

  // Synthetic dependency check — cheap query, no PII. Used by NFR-2 uptime monitoring.
  app.get("/health/deps", async (_req, reply) => {
    const { error } = await supabase.from("accounts").select("id").limit(1);
    if (error) return reply.code(503).send({ ok: false, dep: "supabase", error: error.message });
    return { ok: true };
  });
}
