import React from "react";

const TIERS = [
  {
    type: "Emergency",
    badgeColor: "bg-red-500/10 text-red-700 font-semibold",
    indicatorColor: "bg-red-500",
    title: "Instant Triage & Dispatch",
    body: "If there's a burst pipe flooding a room, a gas leak, or a broken heater in freezing weather, the AI immediately shares safety steps and gets a technician on their way.",
    visual: {
      status: "Dispatched technician",
      action: "Safety text sent",
    },
  },
  {
    type: "Urgent - Today",
    badgeColor: "bg-amber-500/10 text-amber-700 font-semibold",
    indicatorColor: "bg-amber-500",
    title: "Same-Day Optimization",
    body: "For situations like a dead water heater or an AC that stopped working in mid-summer, the AI spots the urgency and schedules them in for today or tomorrow.",
    visual: {
      status: "Booked same-day slot",
      action: "Scheduled for today",
    },
  },
  {
    type: "Routine",
    badgeColor: "bg-neutral-500/10 text-neutral-700 font-semibold",
    indicatorColor: "bg-neutral-400",
    title: "Auto-Pilot Booking",
    body: "When someone calls for a minor issue like a slow drain, maintenance check, or a free price estimate, the AI books them into your next open slot without any back-and-forth.",
    visual: {
      status: "Scheduled next opening",
      action: "Confirmation text sent",
    },
  },
];

export default function TriageTiers() {
  return (
    <section className="relative w-full bg-[#FBFBFA] pt-8 pb-0 sm:pt-12 sm:pb-0">
      
      {/* Eyebrow & Left-Aligned Header */}
      <div className="mx-auto max-w-7xl px-6 sm:px-12 lg:px-8 mb-16">
        <span className="text-xl font-normal tracking-tight text-lime-600">Built for how service calls actually come in</span>
        <h2 className="text-3xl font-normal tracking-tight text-neutral-900 sm:text-5xl mt-3 max-w-2xl leading-tight">
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
              {/* Header block: Title Left, Type Badge Right */}
              <div className="flex items-center justify-between px-6 py-4 bg-neutral-50/50 border-b border-neutral-200 gap-4">
                <span className="text-base font-medium text-neutral-900 leading-normal">
                  {t.title}
                </span>
                <span className={`text-sm font-medium tracking-tight px-2 py-0.5 rounded-md shrink-0 ${t.badgeColor}`}>
                  {t.type}
                </span>
              </div>

              {/* Content Body */}
              <div className="p-6 flex-1 flex flex-col justify-between min-h-[220px] md:min-h-[250px]">
                <div className="flex flex-col gap-3">
                  <p className="text-[15px] leading-relaxed text-neutral-500 max-w-sm">
                    {t.body}
                  </p>
                </div>

                {/* Simulated CSS Action Card (Monochromatic Dashboard without outer border) */}
                <div className="mt-6 bg-neutral-100 p-4 rounded-xl flex flex-col gap-2.5 text-xs text-neutral-600">
                  <div className="flex items-center justify-between text-[12px] text-neutral-600 font-medium tracking-tight">
                    <span className="text-[12px] font-medium text-neutral-900">Incoming Call log</span>
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-lime-500 animate-pulse flex" />
                      Active
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between border-t border-neutral-200 pt-2">
                    <span className="text-[12px] font-medium text-neutral-900">Action:</span>
                    <span className="font-medium text-neutral-900">{t.visual.status}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-medium text-neutral-900">Result:</span>
                    <span className="text-[12px] font-medium px-2 py-0.5 bg-white text-neutral-800 rounded-md select-none">
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
