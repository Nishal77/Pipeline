import type { Metadata } from "next";
import Nav from "../landing/Nav";
import Footer from "../landing/Footer";

export const metadata: Metadata = {
  title: "Pricing",
  description: "PipeLine pricing: Solo $59/mo, Pro $99/mo. 14-day trial, no per-minute fees, cancel anytime.",
};

const MARKETS: Record<string, { currency: string; label: string }> = {
  us: { currency: "USD", label: "United States" },
};

const PLANS = [
  {
    tag: "Solo plumber",
    name: "Solo",
    price: 59,
    tagline: "For a one-truck operation.",
    features: [
      "24/7 AI answers every call",
      "Emergency triage & gas-safety script",
      "Real-time booking into your calendar",
      "SMS confirmations, reminders & reschedule",
      "Emergency escalation by SMS to your cell",
      "1 calendar, 1 number, unlimited calls",
    ],
    highlight: false,
  },
  {
    tag: "Small crew",
    name: "Pro",
    price: 99,
    tagline: "Running a small crew, or want a live hand-off.",
    features: [
      "Everything in Solo",
      "Live-transfer to your cell on emergencies, not just SMS",
      "2 calendars — split jobs across two techs",
      "Cloned-voice greeting — sounds like you, not a default AI",
      "Priority support",
    ],
    highlight: true,
  },
];

const FEATURE_MATRIX = [
  { label: "AI answers every call, 24/7", solo: true, pro: true },
  { label: "Emergency triage (gas leak / flooding / burst pipe)", solo: true, pro: true },
  { label: "Real-time calendar booking", solo: true, pro: true },
  { label: "SMS confirmations + reminders", solo: true, pro: true },
  { label: "Reschedule / cancel by text reply", solo: true, pro: true },
  { label: "Emergency escalation", solo: "SMS to your cell", pro: "Live transfer + SMS" },
  { label: "Calendars", solo: "1", pro: "2" },
  { label: "Greeting voice", solo: "Default AI voice", pro: "Cloned to sound like you" },
  { label: "Support", solo: "Standard (async, <24h)", pro: "Priority (<4h)" },
  { label: "Setup fee", solo: "$0", pro: "$0" },
  { label: "Contract", solo: "Month to month", pro: "Month to month" },
];

function Check({ value }: { value: boolean | string }) {
  if (value === true) return <span className="text-accent">✓</span>;
  if (value === false) return <span className="text-neutral-400">—</span>;
  return <span className="text-sm text-neutral-500">{value}</span>;
}

export default async function PricingPage({ searchParams }: { searchParams: Promise<{ market?: string }> }) {
  const { market: marketParam } = await searchParams;
  const market = marketParam && MARKETS[marketParam] ? marketParam : "us";
  const { label: marketLabel } = MARKETS[market];

  return (
    <main className="relative flex min-h-screen flex-col bg-[#F7F6F2] text-[#08090a]">
      <div className="fixed top-0 right-0 left-0 z-50">
        <Nav />
      </div>
      <div className="h-[68px] shrink-0" />

      <section className="relative flex flex-col items-center gap-6 px-6 pt-20 pb-12 text-center">
        <span className="rounded-full border border-neutral-200 px-3 py-1 text-xs font-medium tracking-wide text-neutral-500">
          Pricing — {marketLabel}
        </span>
        <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
          One flat price. No per-minute meter running.
        </h1>
        <p className="max-w-md text-neutral-600">
          14-day trial, card required upfront. Cancel anytime — you keep every job it already booked, no penalty.
        </p>
      </section>

      <section className="relative mx-auto grid w-full max-w-3xl grid-cols-1 gap-6 px-6 py-10 sm:grid-cols-2">
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            className={`flex flex-col gap-6 rounded-2xl border bg-white p-8 ${plan.highlight ? "border-accent" : "border-neutral-200"}`}
          >
            <span
              className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${
                plan.highlight ? "bg-accent text-accent-foreground" : "border border-neutral-200 text-neutral-500"
              }`}
            >
              {plan.tag}
            </span>
            <div>
              <h2 className="text-lg font-semibold">{plan.name}</h2>
              <p className="mt-1 text-sm text-neutral-500">{plan.tagline}</p>
            </div>
            <p className="text-4xl font-semibold tracking-tight">
              ${plan.price}
              <span className="text-base font-normal text-neutral-500">/mo</span>
            </p>
            <ul className="flex flex-col gap-3 text-sm text-neutral-600">
              {plan.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <span className="text-accent">✓</span> {f}
                </li>
              ))}
            </ul>
            <a
              href="/onboarding"
              className={`mt-auto rounded-lg px-4 py-3 text-center text-sm font-medium ${
                plan.highlight ? "bg-accent text-accent-foreground" : "border border-neutral-200 hover:border-accent"
              }`}
            >
              Start 14-day trial
            </a>
          </div>
        ))}
      </section>

      <section className="relative border-t border-neutral-200 px-6 py-16">
        <h2 className="mb-8 text-center text-2xl font-semibold tracking-tight">Solo vs. Pro, side by side</h2>
        <div className="mx-auto w-full max-w-3xl overflow-x-auto">
          <table className="w-full min-w-[480px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-left text-neutral-500">
                <th className="py-3 font-normal">Feature</th>
                <th className="py-3 text-center font-medium text-[#08090a]">Solo — $59/mo</th>
                <th className="py-3 text-center font-medium text-[#08090a]">Pro — $99/mo</th>
              </tr>
            </thead>
            <tbody>
              {FEATURE_MATRIX.map((row) => (
                <tr key={row.label} className="border-b border-neutral-200">
                  <td className="py-3 pr-4">{row.label}</td>
                  <td className="py-3 text-center">
                    <Check value={row.solo} />
                  </td>
                  <td className="py-3 text-center">
                    <Check value={row.pro} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="relative flex flex-col items-center gap-2 border-t border-neutral-200 px-6 py-16 text-center">
        <h2 className="text-2xl font-semibold">No hidden per-minute fees, on either plan.</h2>
        <p className="max-w-md text-sm text-neutral-600">
          Unlike per-minute answering services, both plans are flat monthly rates. It only quotes the prices you
          set for jobs — never invents a number, never rounds up.
        </p>
      </section>

      <Footer />
    </main>
  );
}
