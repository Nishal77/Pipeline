"use client";

import React from "react";

export default function HowItWorks() {
  return (
    <section id="how" className="relative w-full bg-[#191919] pt-8 pb-0 sm:pt-12 sm:pb-0">
      {/* Clean, Left-Aligned Header */}
      <div className="mx-auto max-w-7xl px-6 sm:px-12 lg:px-8 mb-16">
        <span className="text-xl font-normal tracking-tight text-lime-500">Setup in 2 minutes</span>
        <h2 className="text-3xl font-medium tracking-tight text-white sm:text-4xl mt-3 max-w-2xl leading-tight">
          Every call <span className="bg-[#FAFB86] text-neutral-900 px-2 rounded-sm inline-block">answered.</span> Every job <span className="bg-[#FAFB86] text-neutral-900 px-2 rounded-sm inline-block">booked.</span> While you&apos;re under a sink.
        </h2>
      </div>

      {/* Horizontal Steps Grid (Blueprint grid layout) */}
      <div className="mx-auto max-w-7xl w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 border-t border-neutral-800">

          {/* Step 1 Column */}
          <div className="flex flex-col border-b border-neutral-800 lg:border-b-0 lg:border-r lg:border-neutral-800">
            {/* Visual Mockup Showcase with grid backdrop */}
            <div className="relative w-full h-[360px] bg-neutral-950/40 bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:16px_16px] border-b border-neutral-800 flex items-center justify-center overflow-hidden">
              {/* Responsive Scale Wrapper */}
              <div className="transform scale-[0.8] sm:scale-90 lg:scale-[0.8] xl:scale-100 transition-transform duration-300 origin-center">
                <div className="w-[360px] h-[260px] bg-white border border-neutral-200 p-5 shadow-[0_8px_30px_rgba(0,0,0,0.12)] flex flex-col justify-between">
                  <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                    <span className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase">Call Forwarding Setup</span>
                    <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-xs text-neutral-500 font-medium">Dial this carrier code from your phone:</p>
                    <div className="bg-neutral-50 border border-neutral-200 px-4 py-2 font-mono text-sm text-neutral-800 flex justify-between items-center">
                      <span>*72 (689) 588-2988</span>
                      <svg className="w-4 h-4 text-neutral-400 cursor-pointer hover:text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-lime-50/50 border border-lime-100 p-3">
                    <svg className="w-5 h-5 text-lime-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-xs text-neutral-700 leading-normal">Your phone number remains yours. Customers dial the exact same number.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step Meta and Content */}
            <div className="pt-6 pb-8 px-6 lg:px-8 flex flex-col gap-1">
              <span className="text-xs font-semibold text-lime-500 uppercase tracking-wider">Step 1</span>
              <h3 className="text-lg font-medium text-white mt-1">Forward your number</h3>
              <p className="text-sm text-neutral-400 leading-relaxed mt-2">
                Dial one carrier code from your phone. Takes 10 seconds. Your number stays yours — customers dial the same number, but reach the AI when you can&apos;t pick up.
              </p>
            </div>
          </div>

          {/* Step 2 Column */}
          <div className="flex flex-col border-b border-neutral-800 lg:border-b-0 lg:border-r lg:border-neutral-800">
            {/* Visual Mockup Showcase with grid backdrop */}
            <div className="relative w-full h-[360px] bg-neutral-950/40 bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:16px_16px] border-b border-neutral-800 flex items-center justify-center overflow-hidden">
              {/* Responsive Scale Wrapper */}
              <div className="transform scale-[0.8] sm:scale-90 lg:scale-[0.8] xl:scale-100 transition-transform duration-300 origin-center">
                <div className="w-[360px] h-[260px] bg-white border border-neutral-200 p-5 shadow-[0_8px_30px_rgba(0,0,0,0.12)] flex flex-col justify-between">
                  <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                    <span className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase">Live Call Transcript</span>
                    <div className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-lime-500 animate-pulse"></span>
                      <span className="text-[10px] font-bold text-lime-600">Active</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1 items-start">
                      <span className="text-[9px] font-medium text-neutral-400">Caller (Kitchen Leak)</span>
                      <div className="bg-neutral-100 text-neutral-800 text-xs px-3 py-1.5 max-w-[90%] rounded-sm leading-normal">
                        &quot;Hey, my sink is spraying water everywhere and I can&apos;t shut it off!&quot;
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 items-end">
                      <span className="text-[9px] font-medium text-neutral-400">PipeLine AI</span>
                      <div className="bg-lime-50 border border-lime-100 text-neutral-800 text-xs px-3 py-1.5 max-w-[90%] rounded-sm leading-normal">
                        &quot;Emergency detected. Shut off the valve. Booking immediate dispatch for 1:30 PM.&quot;
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-neutral-100 pt-2.5 flex items-center justify-between text-[10px] text-neutral-400">
                    <span>Length: 44s</span>
                    <span className="font-semibold text-neutral-700">Triage: High Emergency</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step Meta and Content */}
            <div className="pt-6 pb-8 px-6 lg:px-8 flex flex-col gap-1">
              <span className="text-xs font-semibold text-lime-500 uppercase tracking-wider">Step 2</span>
              <h3 className="text-lg font-medium text-white mt-1">Live AI triaging</h3>
              <p className="text-sm text-neutral-400 leading-relaxed mt-2">
                Every call gets answered instantly. The AI figures out if it&apos;s a high-priority emergency (like flooding) or a routine request (like a slow drain) on the fly.
              </p>
            </div>
          </div>

          {/* Step 3 Column */}
          <div className="flex flex-col">
            {/* Visual Mockup Showcase with grid backdrop */}
            <div className="relative w-full h-[360px] bg-neutral-950/40 bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:16px_16px] border-b border-neutral-800 flex items-center justify-center overflow-hidden">
              {/* Responsive Scale Wrapper */}
              <div className="transform scale-[0.8] sm:scale-90 lg:scale-[0.8] xl:scale-100 transition-transform duration-300 origin-center">
                <div className="flex flex-col justify-between w-[360px] h-[260px]">
                  {/* Floating SMS Notification */}
                  <div className="w-[360px] h-[85px] bg-white border border-neutral-200 p-4 shadow-[0_8px_30px_rgba(0,0,0,0.12)] flex items-start gap-4">
                    <div className="h-8 w-8 rounded-full bg-lime-100 flex items-center justify-center text-lime-600 shrink-0">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] font-bold text-neutral-800">PipeLine Notification</span>
                      <p className="text-xs text-neutral-500 leading-tight">New Emergency Job: 450 Oak Ave. Auto-booked for 1:30 PM.</p>
                    </div>
                  </div>

                  {/* Calendar Sheet */}
                  <div className="w-[360px] h-[155px] bg-white border border-neutral-200 p-4 shadow-[0_8px_30px_rgba(0,0,0,0.12)] flex flex-col justify-between">
                    <div className="flex items-center justify-between border-b border-neutral-100 pb-2 text-[10px] text-neutral-400">
                      <span>Calendar — Today</span>
                      <span className="font-semibold text-neutral-700">Google Calendar synced</span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <div className="h-8 bg-neutral-50 border border-neutral-100 flex items-center px-3 text-xs text-neutral-400 rounded-none line-through">
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

            {/* Step Meta and Content */}
            <div className="pt-6 pb-8 px-6 lg:px-8 flex flex-col gap-1">
              <span className="text-xs font-semibold text-lime-500 uppercase tracking-wider">Step 3</span>
              <h3 className="text-lg font-medium text-white mt-1">Auto-booked & dispatched</h3>
              <p className="text-sm text-neutral-400 leading-relaxed mt-2">
                Jobs land straight into your schedule and sync automatically to Google Calendar, CRM, or are pushed to you via SMS text before you even look at the app.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
