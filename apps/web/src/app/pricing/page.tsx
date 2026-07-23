"use client";

import React, { useState } from "react";
import Nav from "../landing/Nav";
import Footer from "../landing/Footer";

const MARKETS: Record<string, { currency: string; label: string }> = {
  us: { currency: "USD", label: "United States" },
};

const PLANS = [
  {
    tag: "Solo",
    name: "Solo",
    price: 49,
    tagline: "Best for an independent solo operator",
    featuresHeader: "What's included:",
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
    name: "Crew",
    price: 89,
    tagline: "Best for a growing team with multiple technicians.",
    featuresHeader: "Everything in Solo, plus:",
    features: [
      "Live-transfer to your cell on emergencies, not just SMS",
      "2 calendars — split jobs across two techs",
      "Cloned-voice greeting — sounds like you, not a default AI",
      "Priority support",
    ],
    highlight: true,
  },
];

const FEATURE_CATEGORIES: { icon: string; name: string; rows: { label: string; solo: boolean | string; crew: boolean | string }[] }[] = [
  {
    icon: "phone",
    name: "Phone numbers",
    rows: [
      { label: "Business number", solo: "1 included", crew: "1 included" },
      { label: "Number porting", solo: "Forward your existing number instead", crew: "Forward your existing number instead" },
    ],
  },
  {
    icon: "call",
    name: "Calling",
    rows: [
      { label: "AI answers every call, 24/7", solo: true, crew: true },
      { label: "Call recording", solo: true, crew: true },
      { label: "Barge-in (caller can interrupt)", solo: true, crew: true },
      { label: "Live transfer on emergencies", solo: "SMS alert only", crew: true },
      { label: "Custom voice greeting", solo: "Default AI voice", crew: "Cloned to sound like you" },
      { label: "Desktop / mobile companion app", solo: false, crew: false },
    ],
  },
  {
    icon: "message",
    name: "Messaging",
    rows: [
      { label: "Booking confirmation SMS", solo: true, crew: true },
      { label: "24h + 1h reminders", solo: true, crew: true },
      { label: "Reschedule by text reply", solo: true, crew: true },
      { label: "STOP compliance", solo: true, crew: true },
      { label: "Owner morning digest SMS", solo: true, crew: true },
    ],
  },
  {
    icon: "calendar",
    name: "Booking & calendar",
    rows: [
      { label: "Real-time availability check", solo: true, crew: true },
      { label: "Atomic slot hold (no double-booking)", solo: true, crew: true },
      { label: "Calendars", solo: "1", crew: "2" },
      { label: "Google Calendar sync", solo: "Partial — OAuth built, not fully live", crew: "Partial — OAuth built, not fully live" },
      { label: "Vacation mode", solo: true, crew: true },
    ],
  },
  {
    icon: "alert",
    name: "Emergency handling",
    rows: [
      { label: "Emergency triage (gas / flooding / burst pipe)", solo: true, crew: true },
      { label: "Hard-coded gas-safety script", solo: true, crew: true },
      { label: "Escalation", solo: "SMS to your cell", crew: "Live transfer + SMS" },
    ],
  },
  {
    icon: "doc",
    name: "AI transcripts",
    rows: [
      { label: "Call summary + transcript", solo: true, crew: true },
      { label: "Signed audio playback", solo: true, crew: true },
      { label: "History retention", solo: "30 days", crew: "30 days" },
    ],
  },
  {
    icon: "tag",
    name: "Pricing",
    rows: [
      { label: "Minutes / month", solo: "300", crew: "600" },
      { label: "Per-seat fees", solo: "None — flat rate", crew: "None — flat rate" },
      { label: "Setup fee", solo: "$0", crew: "$0" },
      { label: "Contract", solo: "Month to month", crew: "Month to month" },
    ],
  },
  {
    icon: "support",
    name: "Support",
    rows: [{ label: "Response time", solo: "Async, <24h", crew: "Priority, <4h" }],
  },
  {
    icon: "shield",
    name: "Security",
    rows: [
      { label: "Row-level data isolation (RLS)", solo: true, crew: true },
      { label: "Signed URLs on recordings (expiring)", solo: true, crew: true },
    ],
  },
];

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  phone: (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57a1 1 0 01-.25 1.02l-2.2 2.2z" />
    </svg>
  ),
  call: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  ),
  message: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  ),
  calendar: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  alert: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  doc: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  tag: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>
  ),
  support: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 0a5 5 0 10-7.07 7.07 5 5 0 007.07-7.07zm0 0L18.364 18.364M5.636 5.636l3.536 3.536" />
    </svg>
  ),
  shield: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
};

function FeatureCell({ value }: { value: boolean | string }) {
  if (value === true)
    return (
      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white">
        <CheckIcon className="h-3 w-3 text-white" />
      </span>
    );
  if (value === false) return <span className="text-neutral-300">—</span>;
  return <span className="text-xs font-medium text-neutral-600">{value}</span>;
}

function CheckIcon({ className = "w-4 h-4 text-neutral-700" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function PhoneIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57a1 1 0 01-.25 1.02l-2.2 2.2z" />
    </svg>
  );
}


/* Structural Grid Intersection Tick (T-Bar matching screenshot) */
function GridTick({ position }: { position: "top-left" | "top-right" | "bottom-left" | "bottom-right" }) {
  const positionClasses = {
    "top-left": "-left-[6.5px] -top-[6.5px]",
    "top-right": "-right-[6.5px] -top-[6.5px]",
    "bottom-left": "-left-[6.5px] -bottom-[6.5px]",
    "bottom-right": "-right-[6.5px] -bottom-[6.5px]",
  };

  return (
    <div className={`absolute ${positionClasses[position]} z-20 pointer-events-none text-neutral-300`}>
      <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1">
        <line x1="6.5" y1="0" x2="6.5" y2="13" />
        <line x1="0" y1="6.5" x2="13" y2="6.5" />
      </svg>
    </div>
  );
}

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(true);
  const marketLabel = MARKETS["us"].label;

  return (
    <main className="relative min-h-screen bg-[#FBFBFA] text-[#09090b] font-sans overflow-hidden">
      {/* Background Ambient Glowing Gradient Effects */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-gradient-to-tr from-amber-100/30 via-purple-100/30 to-sky-100/40 blur-3xl opacity-80 rounded-full" />
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-r from-yellow-100/40 via-pink-100/30 to-sky-200/40 blur-3xl opacity-70 rounded-full" />
      </div>

      <div className="fixed top-0 right-0 left-0 z-50">
        <Nav />
      </div>
      <div className="h-[68px] shrink-0" />

      {/* Main Grid Outer Container */}
      <div className="relative mx-auto max-w-7xl border-x border-neutral-200/80 bg-white/20 backdrop-blur-[2px]">

        {/* Header Section */}
        <div className="relative border-b border-neutral-200/80">
          <GridTick position="top-left" />
          <GridTick position="top-right" />

          <section className="relative flex flex-col items-center gap-4 px-8 pt-16 pb-16 text-center">
            <span className="inline-flex items-center gap-1 rounded-full border border-neutral-200/80 bg-white/80 backdrop-blur-md px-3.5 py-1 text-xs font-medium text-neutral-600 shadow-sm">
              Pricing — {marketLabel}
            </span>
            <h1 className="max-w-3xl text-3xl font-medium tracking-tight sm:text-5xl text-neutral-900 leading-[1.15]">
              Pay like a subscription. Work like you hired someone.
            </h1>
            <p className="max-w-xl text-sm sm:text-base text-neutral-500 font-normal">
              $49 or $89 a month, flat. What you see is what you pay, no per-minute counter ticking in the background.
            </p>
          </section>

          {/* Replicated Toggle Component directly centered on the border divider */}
          <div className="absolute bottom-0 left-0 right-0 translate-y-1/2 z-20 flex justify-center">
            <div className="inline-flex items-center rounded-full border border-neutral-200/90 bg-white p-1 backdrop-blur-md">
              {/* Annual Button */}
              <button
                type="button"
                onClick={() => setIsAnnual(true)}
                className={`relative flex items-center justify-center rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200 ${
                  isAnnual
                    ? "bg-[#091E1D] text-white shadow-md"
                    : "text-[#2B4741] hover:text-neutral-900"
                }`}
              >
                Annual
                <span
                  className={`ml-2 rounded-full px-2 py-0.5 text-[11px] font-bold transition-all duration-200 ${
                    isAnnual
                      ? "bg-white text-[#091E1D]"
                      : "bg-[#091E1D]/10 text-[#091E1D]"
                  }`}
                >
                  -29%
                </span>
              </button>

              {/* Monthly Button */}
              <button
                type="button"
                onClick={() => setIsAnnual(false)}
                className={`relative flex items-center justify-center rounded-full px-6 py-2 text-sm font-semibold transition-all duration-200 ${
                  !isAnnual
                    ? "bg-[#091E1D] text-white shadow-md"
                    : "text-[#2B4741] hover:text-neutral-900"
                }`}
              >
                Monthly
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards Container matching Image: Light Gray Rounded Outer Container */}
        <section className="relative mx-auto w-full max-w-7xl px-6 pt-20 pb-12">
          <div className="rounded-3xl bg-[#F2F2F2] p-4 sm:p-8 grid grid-cols-1 sm:grid-cols-2 gap-6 items-stretch">

            {/* LEFT CARD (Solo) - Integrated into the gray background */}
            <div className="flex flex-col justify-between p-6 sm:p-8">
              <div>
                {/* Icon & Badge */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-800 text-white shadow-sm">
                    <div className="h-4 w-4 rounded-full border-2 border-white/80 bg-neutral-800" />
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-medium tracking-tight text-neutral-900">Solo - A few calls a day</h2>
                  <p className="mt-1 text-sm text-neutral-500 font-normal">Best for an independent solo operator</p>
                </div>

                {/* Price */}
                <div className="mt-6 flex items-baseline">
                  <span className="text-4xl sm:text-5xl font-medium tracking-tight text-neutral-900">
                    ${isAnnual ? Math.floor(49 * 0.71) : 49}
                  </span>
                  <span className="ml-1 text-sm font-medium text-neutral-500">/Month</span>
                </div>

                <div className="my-6 h-[1px] w-full bg-neutral-300/60" />

                <p className="mb-3 text-sm font-medium text-neutral-800 tracking-wide">What's included:</p>
                <ul className="flex flex-col gap-3 text-sm text-neutral-600">
                  {PLANS[0].features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <CheckIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-neutral-800" />
                      <span className="leading-snug">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                <a
                  href="/onboarding"
                  className="block w-full rounded-2xl bg-[#FFEA5D] border border-gray-100 py-3.5 text-center text-sm font-medium text-black transition-all duration-200 hover:bg-[#FFEE33]"
                >
                  Try free for 7 days
                </a>
              </div>
            </div>

            {/* RIGHT CARD (Pro) - Embedded Crisp White Rounded Container */}
            <div className="flex flex-col justify-between rounded-3xl bg-white p-6 sm:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.02)]">
              <div>
                {/* Icon & Popular Badge */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-200 via-pink-300 to-sky-300 shadow-sm">
                    <div className="h-5 w-5 rounded-full bg-white/40 backdrop-blur-sm" />
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-medium tracking-tight text-neutral-900">Crew - Calls all day</h2>
                  <p className="mt-1 text-sm text-neutral-500 font-normal">Best for a growing team with multiple technicians.</p>
                </div>

                {/* Price */}
                <div className="mt-6 flex items-baseline">
                  <span className="text-4xl sm:text-5xl font-medium tracking-tight text-neutral-900">
                    ${isAnnual ? Math.floor(89 * 0.71) : 89}
                  </span>
                  <span className="ml-1 text-sm font-medium text-neutral-500">/Month</span>
                </div>

                <div className="my-6 h-[1px] w-full bg-neutral-200" />

                <p className="mb-3 text-sm font-medium text-neutral-800 tracking-wide">Everything in Solo, plus:</p>
                <ul className="flex flex-col gap-3 text-sm text-neutral-600">
                  {PLANS[1].features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <CheckIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-neutral-800" />
                      <span className="leading-snug">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                <a
                  href="/onboarding"
                  className="block w-full rounded-2xl bg-[#FFEA5D] border border-gray-100 py-3.5 text-center text-sm font-medium text-black transition-all duration-200 hover:bg-[#FFEE33]"
                >
                  Try free for 7 days
                </a>
              </div>
            </div>

          </div>
        </section>

        {/* Compare every feature — category-grouped, matches reference layout */}
        <section className="relative border-t border-neutral-200/80 px-4 sm:px-8 py-14">
          <GridTick position="top-left" />
          <GridTick position="top-right" />

          <div className="mx-auto max-w-5xl">
            {/* Sticky column headers */}
            <div className="sticky top-[68px] z-10 border-b border-neutral-200 bg-[#FBFBFA]/95 backdrop-blur-md">
              <div className="grid grid-cols-[1fr_140px_140px] items-end gap-4 py-6 sm:grid-cols-[1fr_200px_200px]">
                <h2 className="text-2xl font-medium tracking-tight text-neutral-900 sm:text-3xl">Compare every feature</h2>
                <div className="flex flex-col items-center gap-2">
                  <span className="text-lg font-medium text-neutral-900">Solo</span>
                  <a
                    href="/onboarding"
                    className="w-full rounded-full border border-neutral-200 bg-white py-1.5 text-center text-xs font-medium text-neutral-700 hover:border-neutral-300"
                  >
                    Start trial
                  </a>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <span className="text-lg font-medium text-neutral-900">Crew</span>
                  <a
                    href="/onboarding"
                    className="w-full rounded-full bg-[#FFEA5D] py-1.5 text-center text-xs font-medium text-black hover:bg-[#FFEE33]"
                  >
                    Start trial
                  </a>
                </div>
              </div>
            </div>

            {FEATURE_CATEGORIES.map((cat) => (
              <div key={cat.name}>
                <div className="flex items-center gap-2 pt-8 pb-3 text-neutral-900">
                  {CATEGORY_ICONS[cat.icon]}
                  <h3 className="text-sm font-semibold">{cat.name}</h3>
                </div>
                <div className="divide-y divide-neutral-100">
                  {cat.rows.map((row) => (
                    <div key={row.label} className="grid grid-cols-[1fr_140px_140px] items-center gap-4 py-4 sm:grid-cols-[1fr_200px_200px]">
                      <span className="text-sm text-neutral-600">{row.label}</span>
                      <div className="flex justify-center">
                        <FeatureCell value={row.solo} />
                      </div>
                      <div className="flex justify-center">
                        <FeatureCell value={row.crew} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <p className="mt-10 text-center text-xs text-neutral-400">
              Not offered on either plan: CRM integrations, Zapier/Make, public API, multi-agent AI suite, browser
              dialer extension. This answers phones and books jobs for plumbers — that&apos;s the whole product.
            </p>
          </div>
        </section>

        {/* Consultation Banner Section */}
        <section className="relative border-t border-neutral-200/80 px-8 py-14">
          <GridTick position="top-left" />
          <GridTick position="top-right" />

          <div className="mx-auto max-w-4xl relative overflow-hidden rounded-[36px] border border-white/60 bg-gradient-to-r from-amber-100/70 via-pink-100/70 via-purple-100/60 to-sky-200/70 p-8 sm:p-12 text-center shadow-lg backdrop-blur-2xl">
            <div className="flex justify-center mb-4">
              <div className="flex items-center -space-x-2">
                <div className="relative h-12 w-12 rounded-full border-2 border-white overflow-hidden shadow-md bg-neutral-200">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                    alt="Strategy Advisor"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-white text-neutral-900 shadow-md">
                  <PhoneIcon className="w-4 h-4" />
                </div>
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-neutral-900">
              Not sure which plan is right for you?
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-neutral-600">
              Book a free 30-minute AI strategy session.
            </p>

            <div className="mt-6 flex justify-center">
              <a
                href="/consultation"
                className="inline-flex items-center gap-2 rounded-full bg-[#09090b] px-6 py-3.5 text-sm font-medium text-white transition-all duration-200 hover:bg-neutral-800 shadow-md active:scale-[0.99]"
              >
                Book a Free Consultation
                <span className="text-base leading-none">→</span>
              </a>
            </div>
          </div>
        </section>

        {/* Bottom Corner Grid Ticks */}
        <GridTick position="bottom-left" />
        <GridTick position="bottom-right" />
      </div>

      <Footer />
    </main>
  );
}