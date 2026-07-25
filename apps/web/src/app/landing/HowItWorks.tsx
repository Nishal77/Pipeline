"use client";

import React, { useState } from "react";
import { STEPS } from "./data";

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="how" className="relative w-full bg-[#FBFBFA] pt-8 pb-20 sm:pt-12 sm:pb-24">
      {/* Clean, Left-Aligned Header */}
      <div className="mx-auto max-w-7xl px-6 sm:px-12 lg:px-8 mb-16">
        <span className="text-xl font-normal tracking-tight text-lime-600">Setup in 2 minutes</span>
        <h2 className="text-3xl font-medium tracking-tight text-neutral-900 sm:text-4xl mt-3 max-w-2xl leading-tight">
          Every call <span className="bg-[#FAFB86] px-2 rounded-sm inline-block">answered.</span> Every job <span className="bg-[#FAFB86] px-2 rounded-sm inline-block">booked.</span> While you&apos;re under a sink.
        </h2>
      </div>

      {/* Two-Column Interactive Walkthrough */}
      <div className="mx-auto max-w-7xl px-6 sm:px-12 lg:px-8 w-full">
        <div className="flex flex-col lg:flex-row gap-12 items-stretch">

          {/* Left Column: Visual Mockup Showcase */}
          <div className="w-full lg:w-1/2 flex items-center justify-center bg-neutral-50/50 border border-neutral-200 p-8 min-h-[360px] md:min-h-[420px] relative overflow-hidden">

            {/* Visual Step 1: Forwarding */}
            <div
              className={`absolute inset-0 p-8 flex flex-col justify-center items-center transition-all duration-500 ${activeStep === 0 ? "opacity-100 translate-y-0 scale-100 pointer-events-auto" : "opacity-0 translate-y-4 scale-95 pointer-events-none"
                }`}
            >
              <div className="w-full max-w-xs bg-white border border-neutral-200 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                  <span className="text-[10px] font-semibold tracking-wider text-neutral-400 uppercase">Call Forwarding Setup</span>
                  <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <p className="text-xs text-neutral-500 font-medium">Dial this carrier code from your phone:</p>
                  <div className="bg-neutral-50 border border-neutral-200 px-3.5 py-2.5 font-mono text-sm text-neutral-800 flex justify-between items-center">
                    <span>*72 (689) 588-2988</span>
                    <svg className="w-4 h-4 text-neutral-400 cursor-pointer hover:text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-lime-50/50 border border-lime-100 p-3 mt-1">
                  <svg className="w-5 h-5 text-lime-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-[11px] text-neutral-700 leading-normal">Your phone number remains yours. Customers dial the exact same number.</p>
                </div>
              </div>
            </div>

            {/* Visual Step 2: Triaging */}
            <div
              className={`absolute inset-0 p-8 flex flex-col justify-center items-center transition-all duration-500 ${activeStep === 1 ? "opacity-100 translate-y-0 scale-100 pointer-events-auto" : "opacity-0 translate-y-4 scale-95 pointer-events-none"
                }`}
            >
              <div className="w-full max-w-sm bg-white border border-neutral-200 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                  <span className="text-[10px] font-semibold tracking-wider text-neutral-400 uppercase">Live Call Transcript</span>
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-lime-500 animate-pulse"></span>
                    <span className="text-[10px] font-medium text-lime-600">Active</span>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1 items-start">
                    <span className="text-[9px] font-medium text-neutral-400">Caller (Kitchen Leak)</span>
                    <div className="bg-neutral-100 text-neutral-800 text-xs px-3.5 py-2 max-w-[85%] rounded-sm leading-normal">
                      &quot;Hey, my sink is spraying water everywhere and I can&apos;t shut it off!&quot;
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 items-end">
                    <span className="text-[9px] font-medium text-neutral-400">PipeLine AI</span>
                    <div className="bg-lime-50 border border-lime-100 text-neutral-800 text-xs px-3.5 py-2 max-w-[85%] rounded-sm leading-normal">
                      &quot;Emergency detected. Shut off the valve under the sink. Booking immediate dispatch for 1:30 PM today.&quot;
                    </div>
                  </div>
                </div>
                <div className="mt-1 border-t border-neutral-100 pt-3 flex items-center justify-between text-[10px] text-neutral-400">
                  <span>Conversation length: 44s</span>
                  <span className="font-semibold text-neutral-700">Triage: High Emergency</span>
                </div>
              </div>
            </div>

            {/* Visual Step 3: Calendar / Notification */}
            <div
              className={`absolute inset-0 p-8 flex flex-col justify-center items-center transition-all duration-500 ${activeStep === 2 ? "opacity-100 translate-y-0 scale-100 pointer-events-auto" : "opacity-0 translate-y-4 scale-95 pointer-events-none"
                }`}
            >
              <div className="w-full max-w-xs flex flex-col gap-4">
                {/* Floating SMS Notification */}
                <div className="bg-white border border-neutral-200 p-4 shadow-[0_4px_12px_rgba(0,0,0,0.03)] flex items-start gap-3 relative z-10">
                  <div className="h-8 w-8 rounded-full bg-lime-100 flex items-center justify-center text-lime-600 shrink-0">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-bold text-neutral-800">PipeLine Notification</span>
                    <p className="text-xs text-neutral-500 leading-normal">New Emergency Job: 450 Oak Ave. Auto-booked for 1:30 PM. Plumber dispatched.</p>
                  </div>
                </div>

                {/* Calendar Sheet */}
                <div className="bg-white border border-neutral-200 p-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col gap-3">
                  <div className="flex items-center justify-between border-b border-neutral-100 pb-2 text-[10px] text-neutral-400">
                    <span>Calendar — Today</span>
                    <span className="font-semibold text-neutral-700">Google Calendar synced</span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <div className="h-8 bg-neutral-50 border border-neutral-100 flex items-center px-3 text-[10px] text-neutral-400 rounded-none line-through">
                      9:00 AM - Leak Repair (Completed)
                    </div>
                    <div className="h-10 bg-lime-50 border border-lime-200 flex items-center justify-between px-3 text-xs text-neutral-800 rounded-none font-medium">
                      <span>1:30 PM - Water Leak Triage</span>
                      <span className="text-[10px] text-lime-600 bg-white px-2 py-0.5 border border-lime-200">New</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Step Description Cards */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center gap-4">
            {STEPS.map((s, idx) => (
              <div
                key={s.n}
                onMouseEnter={() => setActiveStep(idx)}
                onClick={() => setActiveStep(idx)}
                className={`group border p-6 transition-all duration-300 cursor-pointer flex items-start gap-5 relative rounded-none ${activeStep === idx
                    ? "border-neutral-300 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.02)]"
                    : "border-transparent bg-transparent hover:bg-white/40"
                  }`}
              >
                {/* Active side indicator */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 bg-lime-500 transition-transform duration-300 ${activeStep === idx ? "scale-y-100" : "scale-y-0"
                  }`} />

                {/* Step Number */}
                <span className={`text-base font-semibold leading-none ${activeStep === idx ? "text-lime-600" : "text-neutral-400"
                  }`}>
                  0{s.n}
                </span>

                {/* Step Title and Body */}
                <div className="flex flex-col gap-1">
                  <h3 className={`text-lg font-medium ${activeStep === idx ? "text-neutral-900" : "text-neutral-700"
                    }`}>
                    {s.title}
                  </h3>
                  <p className="text-sm text-neutral-500 leading-relaxed mt-1">
                    {s.body}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
