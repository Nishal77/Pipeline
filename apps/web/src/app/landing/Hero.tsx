import { DEMO_NUMBER, DEMO_NUMBER_DISPLAY } from "./data";

export default function Hero() {
  return (
    <>
      <section className="relative flex flex-col items-start gap-10 px-8 pt-20 pb-20 bg-transparent overflow-hidden w-full">
        {/* Context badge */}
        <span className="rounded-full px-3 py-1.5 text-xs font-semibold tracking-wide text-neutral-800 bg-neutral-100/80 border border-neutral-200">
          The AI receptionist built specifically for plumbers
        </span>

        {/* Headline with Yellow Highlights */}
        <h1 className="max-w-4xl text-5xl leading-[1.1] font-normal tracking-tight sm:text-7xl text-neutral-900 text-left">
          Your Phone Just Got a Lot  <br />
          <span className="bg-[#FAFB86] px-3.5 py-0.5 rounded-sm inline-block">Better</span> at <span className="bg-[#FAFB86] px-3.5 py-0.5 rounded-sm inline-block">Its Job</span>
        </h1>

        {/* Two Column Section: Sub-text & CTA Buttons */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between w-full mt-2">
          {/* Description Column */}
          <div className="flex-1 max-w-xl">
            <p className="text-lg text-neutral-600 leading-relaxed">
              A 24/7 AI receptionist for home service businesses — it picks up, sorts urgent from routine, and books the job while you&apos;re still on the tools.
            </p>
           
          </div>

          {/* Action Buttons Column */}
          <div className="flex flex-wrap items-center gap-4 lg:justify-end">
            <a
              href={`tel:${DEMO_NUMBER}`}
              className="rounded-md bg-black px-4.5 py-2.5 text-base font-normal text-white hover:bg-neutral-800 transition-colors shadow-sm whitespace-nowrap cursor-pointer"
            >
              Call {DEMO_NUMBER_DISPLAY} — try it now
            </a>
            <a
              href="#comparison"
              className="flex items-center justify-center rounded-md border border-neutral-300 bg-white px-4.5 py-2.5 text-base font-normal text-neutral-950 hover:bg-neutral-50 transition-colors whitespace-nowrap cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 mr-2 stroke-[2.5] text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
              See how it works
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
