"use client";

import React from "react";

export default function Pricing() {
  return (
    <section 
      id="pricing" 
      className="relative w-full bg-transparent text-white py-20 sm:py-24 px-6 sm:px-12 lg:px-8 overflow-hidden flex flex-col items-center text-center"
    >
      {/* Blurred watermark mockup element for premium depth */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-lime-500/5 rounded-full blur-3xl pointer-events-none z-0" />

      {/* Header */}
      <div className="relative z-10 max-w-2xl flex flex-col items-center gap-1">
        <span className="inline-flex items-center px-4 py-1.5 rounded-md text-base font-normal tracking-tight text-lime-400 bg-lime-500/10 border border-lime-500/20 select-none">
          Starting at $49/mo
        </span>
        <h2 className="text-3xl font-normal tracking-tight sm:text-5xl text-white mt-4 max-w-2xl leading-tight">
          One booked job pays for the{" "}
          <span className="bg-[#FAFB86] text-neutral-900 px-2 rounded-sm inline-block"> entire </span> {" "}
          year.
        </h2>
        <p className="text-sm sm:text-base text-neutral-400 tracking-tight max-w-lg mt-3">
          No per-minute billing, no contract locks, and no setup fees. Just a flat-rate receptionist working for you 24/7.
        </p>
      </div>

      {/* Giant Pricing Figure */}
      <div className="relative z-10 mt-12 mb-4 flex flex-col items-center">
        <div className="text-[110px] sm:text-[150px] font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-[#E2F9EE] to-[#9CD9B9] leading-none select-none">
          $34
        </div>
        <span className="text-sm sm:text-base tracking-tight text-lime-400 font-normal mt-4">
          per month, flat rate
        </span>
      </div>

      {/* Action Button */}
      <div className="relative z-10 mt-4">
        <a
          href="/pricing"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-md border border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30 backdrop-blur-sm text-base font-normal tracking-tight transition-all"
        >
          <span>View all plans</span>
          <svg className="w-4 h-4 text-lime-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      </div>

    </section>
  );
}
