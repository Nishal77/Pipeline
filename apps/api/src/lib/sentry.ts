import * as Sentry from "@sentry/node";
import { env } from "./env.js";

export function initSentry(): void {
  if (!env.SENTRY_DSN) return; // ponytail: no-op in dev until a DSN is configured
  Sentry.init({ dsn: env.SENTRY_DSN, environment: env.NODE_ENV, tracesSampleRate: 0.1 });
}
