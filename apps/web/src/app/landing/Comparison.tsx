import React from "react";

const COMPARISONS = [
  {
    capability: "Answers instantly, 24/7",
    voicemail: "No — goes to voicemail, most callers hang up",
    answeringService: "Sometimes — hold queue, scripted operator",
    pipeline: "Yes, every call, every time",
  },
  {
    capability: "Knows your trade",
    voicemail: "No",
    answeringService: "No — reads a generic script, doesn't know a burst pipe from a clogged drain",
    pipeline: "Yes — trained on your services, your price sheet",
  },
  {
    capability: "Triages urgency",
    voicemail: "No",
    answeringService: "Rarely — operator isn't trained to tell emergency from routine",
    pipeline: "Yes — sorts EMERGENCY / URGENT-TODAY / ROUTINE automatically",
  },
  {
    capability: "Handles safety-critical calls",
    voicemail: "No",
    answeringService: "Inconsistent — depends who's on shift",
    pipeline: "Yes — hard-coded gas/safety scripts, never skipped",
  },
  {
    capability: "Books the job on the spot",
    voicemail: "No — you call back later, if you remember",
    answeringService: "No — takes a message, you still have to call back",
    pipeline: "Yes — straight into your calendar, no round-trip",
  },
  {
    capability: "Confirms with the customer",
    voicemail: "No",
    answeringService: "No",
    pipeline: "Yes — instant SMS confirmation, reminders, reschedule by text",
  },
  {
    capability: "Sounds like your business",
    voicemail: "N/A",
    answeringService: "Generic, same script every caller hears everywhere",
    pipeline: "Yes — your name, your rules, your numbers",
  },
  {
    capability: "Cost",
    voicemail: "Free, but the job's gone",
    answeringService: "$1–3/min, adds up fast on a busy day",
    pipeline: "Flat $59–99/mo, no per-minute meter",
  },
  {
    capability: "Setup time",
    voicemail: "None",
    answeringService: "Days, contracts",
    pipeline: "Under 15 minutes, no contract",
  },
  {
    capability: "Never claims to be human",
    voicemail: "N/A",
    answeringService: "N/A",
    pipeline: "Always discloses it's AI, recording disclosure every call",
  },
];

export default function Comparison() {
  return (
    <section id="comparison" className="relative w-full bg-[#FBFBFA] pt-8 pb-20 sm:pt-12 sm:pb-24">
      {/* Eyebrow & Left-Aligned Header */}
      <div className="mx-auto max-w-7xl px-6 sm:px-12 lg:px-8 mb-16">
        <span className="text-xl font-normal tracking-tight text-lime-600">What actually happens to the call</span>
        <h2 className="text-3xl font-medium tracking-tight text-neutral-900 sm:text-4xl mt-3 max-w-2xl leading-tight">
          Every other option loses you the job. <br />
          This one doesn&apos;t.
        </h2>
      </div>

      {/* Comparison Table Container */}
      <div className="mx-auto max-w-7xl px-6 sm:px-12 lg:px-8 w-full">
        <div className="w-full overflow-x-auto border border-neutral-200 bg-white">
          <table className="w-full min-w-[800px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50/50">
                <th className="py-4 px-6 font-semibold text-neutral-900 w-[22%]">Capability</th>
                <th className="py-4 px-6 font-medium text-neutral-500 w-[24%] border-l border-neutral-200">Voicemail</th>
                <th className="py-4 px-6 font-medium text-neutral-500 w-[30%] border-l border-neutral-200">Generic Answering Service</th>
                <th className="py-4 px-6 font-semibold text-lime-700 bg-lime-50/30 w-[24%] border-l border-neutral-200">PipeLine</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISONS.map((row, idx) => (
                <tr 
                  key={row.capability}
                  className={`border-b border-neutral-200/60 ${
                    idx === COMPARISONS.length - 1 ? "border-b-0" : ""
                  }`}
                >
                  {/* Capability */}
                  <td className="py-4 px-6 font-medium text-neutral-900 leading-normal">
                    {row.capability}
                  </td>
                  
                  {/* Voicemail */}
                  <td className="py-4 px-6 text-neutral-500 leading-relaxed border-l border-neutral-200/60">
                    {row.voicemail}
                  </td>
                  
                  {/* Generic Answering Service */}
                  <td className="py-4 px-6 text-neutral-500 leading-relaxed border-l border-neutral-200/60">
                    {row.answeringService}
                  </td>
                  
                  {/* PipeLine (Highlighted Column) */}
                  <td className="py-4 px-6 font-medium text-neutral-800 leading-relaxed bg-lime-50/10 border-l border-neutral-200/60">
                    <div className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-lime-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{row.pipeline}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
