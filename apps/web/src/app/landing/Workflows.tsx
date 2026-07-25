import React from "react";

const WORKFLOWS = [
  {
    title: "Plumbers, HVAC, Garage Doors, Roadside Assistance",
    description: "Real-time phone triage and immediate dispatching for high-urgency local services.",
    imageUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Electricians & Electrical Contractors",
    description: "Multi-point estimates, safety inspection logs, and copper wire inventory tracking on site.",
    imageUrl: "https://images.unsplash.com/photo-1621905252507-b354bc25edac?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Clinics, Doctor Offices, Local Consulting Desks",
    description: "Front-desk patient reception, appointment slot booking, and missed call callbacks.",
    imageUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Locksmiths & Emergency Lockout Experts",
    description: "On-the-go lockout service dispatching, lock status tracking, and instant job deposits.",
    imageUrl: "https://images.unsplash.com/photo-1562240020-ce31ccb0fa7d?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Home, Appliance, Pest & Handyman Care",
    description: "Appliance repair diagnostics, material lists, and team pricing sheets.",
    imageUrl: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Landscapers, Lawn Care & Cleaning Services",
    description: "Recurring route scheduling, seasonal service booking, and automated billing.",
    imageUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80",
  },
];

export default function Workflows() {
  return (
    <section className="relative w-full bg-[#FBFBFA] pt-8 pb-20 sm:pt-12 sm:pb-24">
      {/* Humanized, Left-Aligned Header */}
      <div className="mx-auto max-w-7xl px-6 sm:px-12 lg:px-8 mb-16">
        <h2 className="text-3xl font-medium tracking-tight text-neutral-900 sm:text-4xl max-w-2xl leading-tight">
          Where all <span className="bg-[#FAFB86] px-2 rounded-sm inline-block">PipeLine</span> is useful for work
        </h2>
        <p className="text-base text-neutral-500 mt-4 max-w-2xl leading-relaxed">
          Adapting to the unique dispatch, scheduling, and billing flows of your trade.
        </p>
      </div>

      {/* Grid Layout */}
      <div className="mx-auto max-w-7xl w-full">
        <div className="mt-0 grid w-full grid-cols-1 md:grid-cols-3 gap-0 border-t border-neutral-200 border-b border-neutral-200">
          
          {/* Row 1 Headers */}
          {WORKFLOWS.slice(0, 3).map((w, idx) => (
            <div 
              key={w.title}
              className={`flex flex-col border-b border-neutral-200 ${
                idx < 2 ? "md:border-r md:border-neutral-200" : ""
              }`}
            >
              <div className="flex items-center min-h-[72px] px-6 py-4 bg-neutral-50/50">
                <span className="text-sm font-medium text-neutral-900 leading-snug">{w.title}</span>
              </div>
            </div>
          ))}

          {/* Row 1 Content Cells */}
          {WORKFLOWS.slice(0, 3).map((w, idx) => (
            <div 
              key={`${w.imageUrl}-content-r1`}
              className={`relative bg-white flex flex-col border-b border-neutral-200 ${
                idx < 2 ? "md:border-r md:border-neutral-200" : ""
              }`}
            >
              {/* Image Section */}
              <div className="relative h-48 w-full overflow-hidden bg-neutral-100 border-b border-neutral-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={w.imageUrl}
                  alt={w.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Text / Info Section */}
              <div className="p-6 flex-1 flex flex-col justify-between min-h-[100px]">
                <p className="text-sm leading-relaxed text-neutral-600">
                  {w.description}
                </p>
              </div>
            </div>
          ))}

          {/* Row 2 Divider Band (represented as 3 empty cells with vertical divider borders to keep them continuous) */}
          <div className="h-10 border-b border-neutral-200 bg-neutral-50/30 md:border-r md:border-neutral-200"></div>
          <div className="h-10 border-b border-neutral-200 bg-neutral-50/30 md:border-r md:border-neutral-200"></div>
          <div className="h-10 border-b border-neutral-200 bg-neutral-50/30"></div>

          {/* Row 2 Headers */}
          {WORKFLOWS.slice(3, 6).map((w, idx) => (
            <div 
              key={w.title}
              className={`flex flex-col border-b border-neutral-200 ${
                idx < 2 ? "md:border-r md:border-neutral-200" : ""
              }`}
            >
              <div className="flex items-center min-h-[72px] px-6 py-4 bg-neutral-50/50">
                <span className="text-sm font-medium text-neutral-900 leading-snug">{w.title}</span>
              </div>
            </div>
          ))}

          {/* Row 2 Content Cells */}
          {WORKFLOWS.slice(3, 6).map((w, idx) => (
            <div 
              key={`${w.imageUrl}-content-r2`}
              className={`relative bg-white flex flex-col ${
                idx < 2 ? "md:border-r md:border-neutral-200" : ""
              }`}
            >
              {/* Image Section */}
              <div className="relative h-48 w-full overflow-hidden bg-neutral-100 border-b border-neutral-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={w.imageUrl}
                  alt={w.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Text / Info Section */}
              <div className="p-6 flex-1 flex flex-col justify-between min-h-[100px]">
                <p className="text-sm leading-relaxed text-neutral-600">
                  {w.description}
                </p>
              </div>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}
