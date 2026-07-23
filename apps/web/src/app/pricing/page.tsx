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

function CheckMatrix({ value }: { value: boolean | string }) {
  if (value === true)
    return (
      <div className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-neutral-900 text-white">
        <CheckIcon className="w-3 h-3 text-white" />
      </div>
    );
  if (value === false) return <span className="text-neutral-300">—</span>;
  return <span className="text-xs font-medium text-neutral-600">{value}</span>;
}

/* Intersection Ticks */
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
  const [isAnnual, setIsAnnual] = useState(false);
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

          <section className="relative flex flex-col items-center gap-4 px-8 pt-16 pb-12 text-center">
            <span className="inline-flex items-center gap-1 rounded-full border border-neutral-200/80 bg-white/80 backdrop-blur-md px-3.5 py-1 text-xs font-medium text-neutral-600 shadow-sm">
              Pricing — {marketLabel}
            </span>
            <h1 className="max-w-3xl text-3xl font-semibold tracking-tight sm:text-5xl text-neutral-900 leading-[1.15]">
              Pay like a subscription. Work like you hired someone.
            </h1>
            <p className="max-w-xl text-sm sm:text-base text-neutral-500 font-normal">
              $49 or $89 a month, flat. What you see is what you pay, no per-minute counter ticking in the background.
            </p>

            {/* Monthly / Annual Toggle */}
            <div className="mt-4 flex items-center justify-center gap-3 text-sm font-medium tracking-tight text-neutral-500">
              <span className={!isAnnual ? "text-neutral-900 font-semibold" : ""}>Monthly</span>
              <button
                type="button"
                onClick={() => setIsAnnual(!isAnnual)}
                className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-neutral-200 transition-colors duration-200 ease-in-out focus:outline-none"
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${isAnnual ? "translate-x-5" : "translate-x-0"
                    }`}
                />
              </button>
              <span className={isAnnual ? "text-neutral-900 font-semibold" : ""}>
                Annually <span className="text-neutral-400 font-medium lowercase">(Save 10%)</span>
              </span>
            </div>
          </section>
        </div>

        {/* Pricing Cards Container matching Image: Light Gray Rounded Outer Container */}
        <section className="relative mx-auto w-full max-w-7xl px-6 py-12">
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
                    ${isAnnual ? Math.floor(49 * 0.9) : 49}
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
            <div className="flex flex-col justify-between rounded-3xl bg-white p-6 sm:p-8">
              <div>
                {/* Icon & Popular Badge */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-200 via-pink-300 to-sky-300 shadow-sm">
                    <div className="h-5 w-5 rounded-full bg-white/40 backdrop-blur-sm" />
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full border border-neutral-200/80 bg-white px-3 py-1 text-xs font-medium text-neutral-700 shadow-sm">
                    <span>📌</span> Most Popular
                  </span>
                </div>

                <div>
                  <h2 className="text-2xl font-medium tracking-tight text-neutral-900">Crew - Calls all day</h2>
                  <p className="mt-1 text-sm text-neutral-500 font-normal">Best for a growing team with multiple technicians.</p>
                </div>

                {/* Price */}
                <div className="mt-6 flex items-baseline">
                  <span className="text-4xl sm:text-5xl font-medium tracking-tight text-neutral-900">
                    ${isAnnual ? Math.floor(89 * 0.9) : 89}
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

        {/* Feature Comparison Matrix Wrapper */}
        <section className="relative border-t border-neutral-200/80 px-8 py-12">
          <GridTick position="top-left" />
          <GridTick position="top-right" />

          <div className="mx-auto max-w-4xl rounded-[28px] border border-neutral-200/80 bg-white/80 backdrop-blur-xl p-6 sm:p-8 shadow-sm">
            <h2 className="mb-6 text-lg font-semibold tracking-tight text-neutral-900">Solo vs. Pro, side by side</h2>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px] border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-200/80 text-neutral-400 font-medium">
                    <th className="pb-3 font-medium">Feature</th>
                    <th className="pb-3 text-center font-semibold text-neutral-900">Solo — $59/mo</th>
                    <th className="pb-3 text-center font-semibold text-neutral-900">Pro — $99/mo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {FEATURE_MATRIX.map((row) => (
                    <tr key={row.label} className="hover:bg-neutral-50/50">
                      <td className="py-3.5 pr-4 text-neutral-700 font-medium">{row.label}</td>
                      <td className="py-3.5 text-center">
                        <CheckMatrix value={row.solo} />
                      </td>
                      <td className="py-3.5 text-center">
                        <CheckMatrix value={row.pro} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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