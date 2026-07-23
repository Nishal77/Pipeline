"use client";

import { useState } from "react";

const PLANS = [
  {
    tag: "Solo plumber",
    name: "Solo",
    monthlyPrice: 59,
    yearlyPrice: 53,
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
    monthlyPrice: 99,
    yearlyPrice: 89,
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

export default function PricingCards() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section className="relative mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-10">
      {/* Monthly/Yearly Toggle */}
      <div className="flex items-center justify-center gap-3">
        <span
          className={`text-sm font-medium transition-colors ${
            !isYearly ? "text-[#08090a]" : "text-neutral-400"
          }`}
        >
          MONTHLY
        </span>
        <button
          onClick={() => setIsYearly(!isYearly)}
          className={`relative h-6 w-12 rounded-full transition-colors ${
            isYearly ? "bg-[#FF6B3D]" : "bg-neutral-300"
          }`}
        >
          <span
            className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${
              isYearly ? "left-7" : "left-1"
            }`}
          />
        </button>
        <span
          className={`text-sm font-medium transition-colors ${
            isYearly ? "text-[#08090a]" : "text-neutral-400"
          }`}
        >
          ANNUALLY (SAVE 10%)
        </span>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {PLANS.map((plan) => {
          const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
          const period = isYearly ? "/mo (billed annually)" : "/mo";

          return (
            <div
              key={plan.name}
              className={`relative flex flex-col gap-6 rounded-2xl border p-8 shadow-xl transition-all hover:shadow-2xl ${
                plan.highlight
                  ? "border-[#FF6B3D] bg-gradient-to-br from-[#FFF7ED] to-white"
                  : "border-neutral-200 bg-white"
              }`}
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#FF6B3D] px-4 py-1 text-xs font-semibold text-white shadow-lg">
                  Most Popular
                </span>
              )}

              <div className="flex items-center justify-between">
                <span
                  className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${
                    plan.highlight
                      ? "border border-[#FF6B3D] bg-[#FF6B3D]/10 text-[#FF6B3D]"
                      : "border border-neutral-200 text-neutral-500"
                  }`}
                >
                  {plan.tag}
                </span>
              </div>

              <div>
                <h2 className="text-xl font-bold text-[#08090a]">{plan.name}</h2>
                <p className="mt-1 text-sm text-neutral-500">{plan.tagline}</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-bold tracking-tight text-[#08090a]">
                  ${price}
                </span>
                <span className="text-sm font-normal text-neutral-500">{period}</span>
              </div>

              <div className="flex flex-col gap-3">
                <p className="text-sm font-semibold text-[#08090a]">What's included:</p>
                <ul className="flex flex-col gap-3 text-sm text-neutral-600">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#FF6B3D]/10 text-[#FF6B3D]">
                        ✓
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href="/onboarding"
                className={`mt-auto rounded-lg px-4 py-3 text-center text-sm font-semibold transition-all hover:scale-105 ${
                  plan.highlight
                    ? "bg-[#FF6B3D] text-white shadow-lg shadow-[#FF6B3D]/25 hover:bg-[#E55A2D]"
                    : "border-2 border-[#08090a] bg-[#08090a] text-white hover:bg-[#1A1B1E]"
                }`}
              >
                Start 14-day trial
              </a>
            </div>
          );
        })}
      </div>
    </section>
  );
}
