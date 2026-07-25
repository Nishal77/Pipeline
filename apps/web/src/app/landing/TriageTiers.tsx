import React from "react";

const TIERS = [
  {
    type: "EMERGENCY",
    badgeColor: "bg-red-50 text-red-600 border-red-200/50",
    indicatorColor: "bg-red-500",
    title: "Instant Triage & Dispatch",
    body: "Burst pipe flooding a kitchen. Gas smell in a house. Locked out of a running car on the highway. Power down mid-heatwave. The AI catches it instantly, runs the safety script where it matters (gas leak = leave the building, call 911 first, no exceptions), and dispatches now.",
    visual: {
      status: "Immediate Dispatch",
      action: "Safety Script Active",
      actionColor: "text-red-600 bg-red-50 border-red-100",
    },
  },
  {
    type: "URGENT — TODAY",
    badgeColor: "bg-amber-50 text-amber-600 border-amber-200/50",
    indicatorColor: "bg-amber-500",
    title: "Same-Day Optimization",
    body: "Water heater's dead. AC quit but it's not a heat emergency yet. Garage door stuck half-open. A patient needs a same-day slot. Can't wait a week, doesn't need a siren. Fit into today or tomorrow, ahead of routine work.",
    visual: {
      status: "Fit Into Today",
      action: "Scheduled < 24h",
      actionColor: "text-amber-600 bg-amber-50 border-amber-100",
    },
  },
  {
    type: "ROUTINE",
    badgeColor: "bg-neutral-100 text-neutral-600 border-neutral-200/50",
    indicatorColor: "bg-neutral-400",
    title: "Auto-Pilot Booking",
    body: "Slow kitchen drain. Seasonal lawn treatment. A wiring inspection booked two weeks out. An appliance repair estimate. No rush — booked into the next open slot, no callback, nothing dropped.",
    visual: {
      status: "Auto-Allocated",
      action: "Next Open Slot",
      actionColor: "text-neutral-600 bg-neutral-50 border-neutral-200/60",
    },
  },
];

export default function TriageTiers() {
  return (
    <section className="relative w-full bg-[#FBFBFA] pt-8 pb-20 sm:pt-12 sm:pb-24">
      {/* Eyebrow & Left-Aligned Header */}
      <div className="mx-auto max-w-7xl px-6 sm:px-12 lg:px-8 mb-16">
        <span className="text-xl font-normal tracking-tight text-lime-600">Built for how service calls actually come in</span>
        <h2 className="text-3xl font-medium tracking-tight text-neutral-900 sm:text-4xl mt-3 max-w-2xl leading-tight">
          Three ways a call goes. <br />
          The AI knows which one it&apos;s on.
        </h2>
      </div>

      {/* 3-Column Solid Grid */}
      <div className="mx-auto max-w-7xl w-full">
        <div className="mt-0 grid w-full grid-cols-1 md:grid-cols-3 gap-0 border-t border-neutral-200">
          
          {TIERS.map((t, idx) => (
            <div
              key={t.type}
              className={`flex flex-col bg-white border-b border-neutral-200 md:border-b-0 ${
                idx < 2 ? "md:border-r md:border-neutral-200" : ""
              }`}
            >
              {/* Header block */}
              <div className="flex items-center justify-between px-6 py-4 bg-neutral-50/50 border-b border-neutral-200">
                <span className={`text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-sm border uppercase ${t.badgeColor}`}>
                  {t.type}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className={`h-1.5 w-1.5 rounded-full ${t.indicatorColor} ${idx === 0 ? "animate-pulse" : ""}`}></span>
                  <span className="text-[10px] text-neutral-400 font-medium">Standard Route</span>
                </span>
              </div>

              {/* Content Body */}
              <div className="p-6 flex-1 flex flex-col justify-between min-h-[360px] md:min-h-[400px]">
                <div className="flex flex-col gap-4">
                  <h3 className="text-lg font-medium text-neutral-900">{t.title}</h3>
                  <p className="text-sm leading-relaxed text-neutral-500">
                    {t.body}
                  </p>
                </div>

                {/* Simulated CSS Action Card */}
                <div className="mt-8 border border-neutral-100 bg-neutral-50/30 p-4 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between text-[10px] text-neutral-400">
                    <span>CALL ROUTING PROTOCOL</span>
                    <span className="font-semibold text-neutral-700">ACTIVE</span>
                  </div>
                  
                  <div className="flex items-center justify-between border-t border-neutral-100/60 pt-2 text-xs">
                    <span className="text-neutral-500">Classification:</span>
                    <span className="font-medium text-neutral-800">{t.visual.status}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-500">Resolution:</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 border rounded-sm ${t.visual.actionColor}`}>
                      {t.visual.action}
                    </span>
                  </div>
                </div>

              </div>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}
