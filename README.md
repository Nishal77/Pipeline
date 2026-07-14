# PipeLine

AI phone-office for solo US plumbers. See `/claude.md` for the roadmap and
`spec/` for per-phase specs (source: `PRD.pdf` v2.0).

## Monorepo layout
- `apps/api` — Fastify backend (Supabase client, health checks; grows into the
  booking/owner-app API in later phases)
- `apps/voice` — voice pipeline + the Phase 1 Option A/B latency benchmark
- `apps/web` — Next.js PWA (owner app ships Phase 4; currently a placeholder)
- `packages/shared` — DB row types + the agent tool contract (PRD §14.2),
  shared by `voice` and `api` so both pipelines dispatch through one schema
- `supabase/migrations` — schema v1 (PRD §13) with per-account RLS
- `docs/adr` — architecture decisions (start with `001-voice-stack.md`)
- `docs/forwarding.md` — carrier forwarding test matrix (A5)

## Setup
```
cp .env.example .env   # fill in real keys before running anything live
pnpm install
pnpm typecheck && pnpm lint && pnpm test
```

## Phase 1 status
Repo, CI, Supabase schema, agent tool contracts, and the voice benchmark
harness are scaffolded. Still open (see `spec/phase-1-foundations.md`):
run the benchmark against real API keys + sample audio, decide Option A vs B
and Twilio vs Telnyx in `docs/adr/001-voice-stack.md`, file the US entity,
open Stripe test mode, submit A2P 10DLC, and verify carrier forwarding
(`docs/forwarding.md`). Those four are business/legal or require live
credentials this environment doesn't have — no code blocks them.
