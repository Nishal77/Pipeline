"use client";

import { GridTick } from "./icons";

export default function PricingHero({
  marketLabel,
  isAnnual,
  setIsAnnual,
}: {
  marketLabel: string;
  isAnnual: boolean;
  setIsAnnual: (v: boolean) => void;
}) {
  return (
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

      {/* Toggle centered on the border divider */}
      <div className="absolute bottom-0 left-0 right-0 translate-y-1/2 z-20 flex justify-center">
        <div className="inline-flex items-center rounded-full border border-neutral-200/90 bg-white p-1 backdrop-blur-md">
          <button
            type="button"
            onClick={() => setIsAnnual(true)}
            className={`relative flex items-center justify-center rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200 ${
              isAnnual ? "bg-[#091E1D] text-white shadow-md" : "text-[#2B4741] hover:text-neutral-900"
            }`}
          >
            Annual
            <span
              className={`ml-2 rounded-full px-2 py-0.5 text-[11px] font-bold transition-all duration-200 ${
                isAnnual ? "bg-white text-[#091E1D]" : "bg-[#091E1D]/10 text-[#091E1D]"
              }`}
            >
              -29%
            </span>
          </button>
          <button
            type="button"
            onClick={() => setIsAnnual(false)}
            className={`relative flex items-center justify-center rounded-full px-6 py-2 text-sm font-semibold transition-all duration-200 ${
              !isAnnual ? "bg-[#091E1D] text-white shadow-md" : "text-[#2B4741] hover:text-neutral-900"
            }`}
          >
            Monthly
          </button>
        </div>
      </div>
    </div>
  );
}
