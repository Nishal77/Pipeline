import Fastify from "fastify";
import { env } from "./lib/env.js";
import { initSentry } from "./lib/sentry.js";
import { healthRoutes } from "./routes/health.js";
import { gcalRoutes } from "./routes/gcal.js";

initSentry();

const app = Fastify({ logger: true });
await app.register(healthRoutes);
await app.register(gcalRoutes);

app.setErrorHandler((err: Error & { statusCode?: number }, _req, reply) => {
  app.log.error(err);
  reply.code(err.statusCode ?? 500).send({ ok: false, error: err.message });
});

const address = await app.listen({ port: env.PORT, host: "0.0.0.0" });
app.log.info(`api listening on ${address}`);

for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.on(signal, async () => {
    await app.close();
    process.exit(0);
  });
}
