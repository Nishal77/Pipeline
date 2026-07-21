import CostCalculator from "./CostCalculator";
import WaitlistForm from "./WaitlistForm";

// GTM asset (§21 Phase 1): live demo line, missed-call cost calculator,
// waitlist. Demo number is whatever's provisioned for the seeded test
// account — swap for a dedicated public demo line before real launch.
const DEMO_NUMBER = "+16895882988";
const DEMO_NUMBER_DISPLAY = "(689) 588-2988";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-background text-foreground">
      {/* Sticky nav */}
      <nav className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-background/80 px-6 py-4 backdrop-blur">
        <span className="text-lg font-semibold tracking-tight">PipeLine</span>
        <div className="flex items-center gap-5">
          <a href="#pricing" className="hidden text-sm text-muted sm:inline">
            Pricing
          </a>
          <a href={`tel:${DEMO_NUMBER}`} className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground">
            Call the demo line
          </a>
        </div>
      </nav>

      {/* Glow motif behind hero — CSS-only, no external asset */}
      <div className="pointer-events-none absolute top-0 left-1/2 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-accent/20 blur-[140px]" />

      <section className="relative flex flex-col items-center gap-8 px-6 pt-24 pb-28 text-center">
        <span className="rounded-full border border-border px-3 py-1 text-xs font-medium tracking-wide text-muted">
          Built for solo plumbers
        </span>
        <h1 className="max-w-3xl text-5xl leading-[1.05] font-semibold tracking-tight sm:text-6xl">
          The phone never goes to <span className="text-accent">voicemail</span> again.
        </h1>
        <p className="max-w-xl text-lg text-muted">
          A 24/7 AI answers every call, triages emergencies from routine work, and books the job —
          while you&apos;re still under the sink.
        </p>
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <a
            href={`tel:${DEMO_NUMBER}`}
            className="rounded-xl bg-accent px-8 py-4 text-lg font-medium text-accent-foreground transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Call {DEMO_NUMBER_DISPLAY} — try it now
          </a>
          <a href="#calculator" className="px-4 py-4 text-sm font-medium text-muted underline underline-offset-4">
            See what missed calls cost you
          </a>
        </div>
        <p className="text-sm text-muted">
          It&apos;s a real AI, not a script — try booking yourself a fake job. Calls are recorded, and it&apos;ll tell you that too.
        </p>
      </section>

      {/* One job per section, divided by hairline borders — no card-grid decoration */}
      <section className="relative mx-auto flex w-full max-w-3xl flex-col divide-y divide-border border-t border-border px-6">
        <div className="flex flex-col gap-3 py-14">
          <h2 className="text-2xl font-semibold">Every miss is a job your competitor just booked.</h2>
          <p className="text-muted">
            Solo plumbers miss 30–60% of their calls — hands full, truck loud, mid-repair. Most of those
            callers don&apos;t leave a voicemail. They call the next name on the list.
          </p>
        </div>

        <div className="flex flex-col gap-3 py-14">
          <h2 className="text-2xl font-semibold">It knows the difference between a drip and a disaster.</h2>
          <p className="text-muted">
            Gas smell, flooding, burst pipe — the AI recognizes real emergencies and gets you on the phone
            immediately, even mid-job. A dripping faucet gets booked into your next open slot, no interruption.
            Every emergency call is disclosed as AI, recorded, and escalated — never left guessing.
          </p>
        </div>

        <div className="flex flex-col gap-3 py-14">
          <h2 className="text-2xl font-semibold">It only quotes what you actually charge.</h2>
          <p className="text-muted">
            You set the price sheet. The AI never invents a number, never discounts to close a booking. What
            the caller hears is what you&apos;d have told them yourself.
          </p>
        </div>

        <div className="flex flex-col gap-3 py-14">
          <h2 className="text-2xl font-semibold">Set up once, forward your number, done.</h2>
          <p className="text-muted">
            No new phone, no app your customers have to install. Forward your existing line when you&apos;re
            on a job, and it picks up on the second ring.
          </p>
        </div>
      </section>

      <section id="calculator" className="relative flex flex-col items-center gap-4 border-t border-border px-6 py-20">
        <CostCalculator />
      </section>

      <section id="pricing" className="relative flex flex-col items-center gap-10 border-t border-border px-6 py-20">
        <div className="flex flex-col items-center gap-3 text-center">
          <h2 className="text-3xl font-semibold tracking-tight">One flat price. No per-minute surprises.</h2>
          <p className="max-w-md text-muted">14-day trial, card required upfront. Cancel anytime — you keep every job it already booked.</p>
        </div>

        <div className="grid w-full max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Solo */}
          <div className="flex flex-col gap-6 rounded-2xl border border-border p-8">
            <div>
              <h3 className="text-lg font-semibold">Solo</h3>
              <p className="mt-1 text-sm text-muted">For a one-truck operation.</p>
            </div>
            <p className="text-4xl font-semibold tracking-tight">
              $59<span className="text-base font-normal text-muted">/mo</span>
            </p>
            <ul className="flex flex-col gap-3 text-sm text-muted">
              <li className="flex gap-2">
                <span className="text-accent">✓</span> 24/7 AI answers every call
              </li>
              <li className="flex gap-2">
                <span className="text-accent">✓</span> Emergency triage &amp; gas-safety script
              </li>
              <li className="flex gap-2">
                <span className="text-accent">✓</span> Real-time booking into your calendar
              </li>
              <li className="flex gap-2">
                <span className="text-accent">✓</span> SMS confirmations, reminders &amp; reschedule
              </li>
              <li className="flex gap-2">
                <span className="text-accent">✓</span> Emergency escalation by SMS to your cell
              </li>
              <li className="flex gap-2">
                <span className="text-accent">✓</span> 1 calendar, 1 number, unlimited calls
              </li>
            </ul>
            <a
              href="/onboarding"
              className="mt-auto rounded-lg border border-border px-4 py-3 text-center text-sm font-medium hover:border-accent"
            >
              Start 14-day trial
            </a>
          </div>

          {/* Pro */}
          <div className="relative flex flex-col gap-6 rounded-2xl border border-accent p-8">
            <span className="absolute -top-3 left-8 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
              Most jobs booked
            </span>
            <div>
              <h3 className="text-lg font-semibold">Pro</h3>
              <p className="mt-1 text-sm text-muted">Running a small crew, or want a live hand-off.</p>
            </div>
            <p className="text-4xl font-semibold tracking-tight">
              $99<span className="text-base font-normal text-muted">/mo</span>
            </p>
            <ul className="flex flex-col gap-3 text-sm text-muted">
              <li className="flex gap-2">
                <span className="text-accent">✓</span> Everything in Solo
              </li>
              <li className="flex gap-2">
                <span className="text-accent">✓</span> Live-transfer to your cell on emergencies, not just SMS
              </li>
              <li className="flex gap-2">
                <span className="text-accent">✓</span> 2 calendars — split jobs across two techs
              </li>
              <li className="flex gap-2">
                <span className="text-accent">✓</span> Cloned-voice greeting — sounds like you, not a default AI
              </li>
              <li className="flex gap-2">
                <span className="text-accent">✓</span> Priority support
              </li>
            </ul>
            <a
              href="/onboarding"
              className="mt-auto rounded-lg bg-accent px-4 py-3 text-center text-sm font-medium text-accent-foreground"
            >
              Start 14-day trial
            </a>
          </div>
        </div>

        <p className="text-sm text-muted">Both plans: no setup fee, no long-term contract. It only quotes the prices you set — never invents a number.</p>
      </section>

      <section className="relative flex flex-col items-center gap-4 border-t border-border px-6 py-20 text-center">
        <h2 className="text-2xl font-semibold">Not ready to switch your line over yet?</h2>
        <p className="max-w-md text-muted">Get on the list — we&apos;ll text you the day it&apos;s live.</p>
        <WaitlistForm />
      </section>

      <footer className="relative flex flex-col items-center gap-4 border-t border-border px-6 py-10 text-xs text-muted">
        <div className="flex gap-4">
          <a href="/privacy" className="underline">
            Privacy
          </a>
          <a href="/terms" className="underline">
            Terms
          </a>
          <a href="/status" className="underline">
            Status
          </a>
        </div>
        <p>PipeLine — an AI phone assistant. It always says so. Every call is recorded.</p>
      </footer>
    </main>
  );
}
