import CostCalculator from "./CostCalculator";
import WaitlistForm from "./WaitlistForm";

// GTM asset (§21 Phase 1): live demo line, missed-call cost calculator,
// waitlist. Demo number is whatever's provisioned for the seeded test
// account — swap for a dedicated public demo line before real launch.
const DEMO_NUMBER = "+16895882988";
const DEMO_NUMBER_DISPLAY = "(689) 588-2988";

const FEATURES = [
  {
    title: "It answers on the second ring. Every time.",
    body: "Not a queue, not a callback promise. The second your line forwards, the AI picks up — nights, weekends, mid-job, doesn't matter.",
  },
  {
    title: "It can tell a drip from a disaster.",
    body: "Gas smell, active flooding, a burst pipe — it recognizes the real emergencies and gets you on the phone immediately. Everything else gets booked without pulling you off the job you're already on.",
  },
  {
    title: "It books straight into your real calendar.",
    body: "Checks what's actually open, holds the slot so two callers can't grab the same window, confirms the address back to the caller before it locks it in.",
  },
  {
    title: "It only says numbers you've told it to say.",
    body: "You set the price sheet once. It quotes exactly that — never rounds up to close a booking, never invents a number to sound helpful.",
  },
  {
    title: "It handles the whole text thread, not just the call.",
    body: "Booking confirmation, a reminder the day before, one an hour before, reschedule by replying — all of it automatic. Reply STOP and it stops, immediately, everywhere.",
  },
  {
    title: "It never pretends to be you.",
    body: "Every single call opens with 'this is an AI assistant, and this call is recorded.' No exceptions, no configuration to turn it off. Your customers know exactly who they're talking to.",
  },
];

const STEPS = [
  {
    n: "1",
    title: "Forward your number",
    body: "A two-minute carrier star-code. Your business number stays yours — customers dial the exact same digits they always have.",
  },
  {
    n: "2",
    title: "It answers, triages, books",
    body: "The AI greets the caller, figures out how urgent it is, and either books the job or gets you on the phone if it can't wait.",
  },
  {
    n: "3",
    title: "You get a text, you show up",
    body: "Job's on your calendar with the address already confirmed. No callback, no voicemail to dig through.",
  },
];

const FAQS = [
  {
    q: "Does it actually sound like a person, or a robot reading a script?",
    a: "It's a real conversational AI, not a phone tree — it can handle a rambling caller, a bad connection, someone who changes their mind mid-sentence. But it always tells the caller up front that it's an AI. That's not a setting you can turn off, and we're not going to pretend otherwise.",
  },
  {
    q: "What happens if it genuinely can't help the caller?",
    a: "After two failed attempts to understand what they need, it stops guessing, takes a message with whatever contact info it has, and texts you. It never loops a confused caller forever.",
  },
  {
    q: "What if it's a real emergency — gas leak, flooding, whatever?",
    a: "It's built to catch those specifically and treat them differently from a routine call: safety instructions first, then it gets you on the phone right away instead of quietly booking an appointment for Tuesday.",
  },
  {
    q: "Do I have to give up my business number?",
    a: "No. You forward your existing number to it. Customers dial what they've always dialed — they never see a new number, never know anything changed on your end.",
  },
  {
    q: "What's the contract length?",
    a: "Month to month. Cancel whenever — you keep every job it already booked, and your number just forwards to voicemail again.",
  },
  {
    q: "Is call data actually private?",
    a: "Recordings and transcripts are encrypted and only visible to you, behind a signed link that expires. Nothing about your calls trains a model that anyone else's business touches.",
  },
];

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "PipeLine",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      description:
        "24/7 AI phone receptionist for solo plumbers. Answers every call, triages emergencies, and books jobs straight into the calendar.",
      offers: [
        { "@type": "Offer", name: "Solo", price: "59", priceCurrency: "USD", priceValidUntil: "2027-01-01" },
        { "@type": "Offer", name: "Pro", price: "99", priceCurrency: "USD", priceValidUntil: "2027-01-01" },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-background text-foreground">
      {/* Structured data — SoftwareApplication + FAQPage, read by search crawlers
          and AI answer engines (ChatGPT/Perplexity-style citations), not just Google. */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />

      {/* Sticky nav */}
      <nav className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-background/80 px-6 py-4 backdrop-blur">
        <span className="text-lg font-semibold tracking-tight">PipeLine</span>
        <div className="hidden items-center gap-6 sm:flex">
          <a href="#features" className="text-sm text-muted hover:text-foreground">
            Features
          </a>
          <a href="#how" className="text-sm text-muted hover:text-foreground">
            How it works
          </a>
          <a href="#pricing" className="text-sm text-muted hover:text-foreground">
            Pricing
          </a>
          <a href="#faq" className="text-sm text-muted hover:text-foreground">
            FAQ
          </a>
        </div>
        <a href={`tel:${DEMO_NUMBER}`} className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground">
          Call the demo line
        </a>
      </nav>

      {/* Glow motif behind hero — CSS-only, no external asset */}
      <div className="pointer-events-none absolute top-0 left-1/2 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-accent/20 blur-[140px]" />

      {/* Hero */}
      <section className="relative flex flex-col items-center gap-8 px-6 pt-24 pb-16 text-center">
        <span className="rounded-full border border-border px-3 py-1 text-xs font-medium tracking-wide text-muted">
          AI phone receptionist, built for solo plumbers
        </span>
        <h1 className="max-w-3xl text-5xl leading-[1.05] font-semibold tracking-tight sm:text-6xl">
          The phone never goes to <span className="text-accent">voicemail</span> again.
        </h1>
        <p className="max-w-xl text-lg text-muted">
          PipeLine answers every call to your business line, tells a real emergency from routine work, and
          books the job straight into your calendar — 24/7, while you&apos;re still under the sink.
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

      {/* Product visual — a stylized illustration of the owner app's Today
          view, built in CSS/markup (not a photo/screenshot — no real
          production UI has been captured yet, and a fabricated "screenshot"
          would be dishonest). Shows the actual real features: live call log,
          emergency flag, a job the AI just booked. */}
      <section className="relative flex justify-center px-6 pb-24">
        <div className="w-full max-w-3xl overflow-hidden rounded-2xl border border-border bg-white/[0.02] shadow-[0_0_80px_-20px_rgba(255,107,61,0.25)]">
          <div className="flex items-center gap-2 border-b border-border px-5 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <span className="ml-3 text-xs text-muted">pipeline.app/today</span>
          </div>
          <div className="flex flex-col gap-3 p-5 text-left">
            <div className="flex items-center justify-between rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-red-400">Emergency — gas smell reported</p>
                <p className="text-xs text-muted">Escalated to your cell · 2 min ago</p>
              </div>
              <span className="rounded-full bg-red-500/20 px-2 py-1 text-xs font-medium text-red-400">Live</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
              <div>
                <p className="text-sm font-medium">Drain cleaning — Maria T.</p>
                <p className="text-xs text-muted">Today, 2:00 PM · 118 Birchwood Ave</p>
              </div>
              <span className="rounded-full border border-accent/40 px-2 py-1 text-xs font-medium text-accent">Booked</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
              <div>
                <p className="text-sm font-medium">Leak repair — James O.</p>
                <p className="text-xs text-muted">Tomorrow, 9:30 AM · confirmed by SMS</p>
              </div>
              <span className="rounded-full border border-border px-2 py-1 text-xs text-muted">Confirmed</span>
            </div>
            <div className="mt-1 flex items-center justify-between rounded-lg bg-white/[0.03] px-4 py-3">
              <p className="text-sm text-muted">Calls answered today</p>
              <p className="text-sm font-medium">7 / 7 — zero missed</p>
            </div>
          </div>
        </div>
        <p className="sr-only">
          Illustration of the PipeLine owner dashboard, showing a live emergency escalation and two booked jobs.
        </p>
      </section>

      {/* Problem framing — one job per section, hairline-divided, no card grid */}
      <section className="relative mx-auto flex w-full max-w-3xl flex-col divide-y divide-border border-t border-border px-6">
        <div className="flex flex-col gap-3 py-14">
          <h2 className="text-2xl font-semibold">Every miss is a job your competitor just booked.</h2>
          <p className="text-muted">
            Solo plumbers miss 30–60% of their calls — hands full, truck loud, mid-repair. Most of those
            callers don&apos;t leave a voicemail. They call the next name on the list.
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

      {/* Features */}
      <section id="features" className="relative border-t border-border px-6 py-24">
        <div className="mx-auto mb-14 flex max-w-2xl flex-col items-center gap-3 text-center">
          <h2 className="text-3xl font-semibold tracking-tight">Everything a good receptionist would do. Awake at 2am.</h2>
          <p className="text-muted">Not a chatbot bolted onto a form. A real phone assistant that does the actual job.</p>
        </div>
        <div className="mx-auto grid w-full max-w-4xl grid-cols-1 gap-x-12 gap-y-10 sm:grid-cols-2">
          {FEATURES.map((f) => (
            <div key={f.title} className="flex flex-col gap-2">
              <h3 className="text-lg font-medium">{f.title}</h3>
              <p className="text-sm text-muted">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="relative border-t border-border px-6 py-24">
        <div className="mx-auto mb-14 flex max-w-2xl flex-col items-center gap-3 text-center">
          <h2 className="text-3xl font-semibold tracking-tight">Live in one afternoon. Not a rollout.</h2>
        </div>
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-10 sm:flex-row sm:gap-6">
          {STEPS.map((s) => (
            <div key={s.n} className="flex flex-1 flex-col gap-2">
              <span className="text-sm font-medium text-accent">{s.n}</span>
              <h3 className="text-lg font-medium">{s.title}</h3>
              <p className="text-sm text-muted">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="calculator" className="relative flex flex-col items-center gap-4 border-t border-border px-6 py-20">
        <CostCalculator />
      </section>

      {/* Pricing */}
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

      {/* FAQ */}
      <section id="faq" className="relative border-t border-border px-6 py-24">
        <div className="mx-auto mb-12 flex max-w-2xl flex-col items-center gap-3 text-center">
          <h2 className="text-3xl font-semibold tracking-tight">Questions you&apos;d actually ask</h2>
        </div>
        <div className="mx-auto flex w-full max-w-2xl flex-col divide-y divide-border">
          {FAQS.map((item) => (
            <details key={item.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left font-medium">
                {item.q}
                <span className="shrink-0 text-muted transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm text-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative flex flex-col items-center gap-4 border-t border-border px-6 py-20 text-center">
        <h2 className="text-2xl font-semibold">Not ready to switch your line over yet?</h2>
        <p className="max-w-md text-muted">Get on the list — we&apos;ll text you the day it&apos;s live.</p>
        <WaitlistForm />
      </section>

      <footer className="relative flex flex-col items-center gap-4 border-t border-border px-6 py-10 text-xs text-muted">
        <div className="flex gap-4">
          <a href="#features" className="underline">
            Features
          </a>
          <a href="#pricing" className="underline">
            Pricing
          </a>
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
