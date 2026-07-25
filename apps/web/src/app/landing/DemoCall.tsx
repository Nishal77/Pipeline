import React from "react";

export default function DemoCall() {
  return (
    <section id="demo" className="relative w-full bg-white px-6 py-24 flex flex-col items-center text-center">
      
      {/* Eyebrow */}
      <span className="inline-flex items-center px-4 py-1.5 rounded-md text-sm font-medium tracking-tight text-lime-600 bg-lime-50 border border-lime-200/50 select-none uppercase tracking-wider">
        Don&apos;t take our word for it
      </span>

      {/* Heading */}
      <h2 className="text-3xl font-normal tracking-tight sm:text-5xl text-neutral-900 mt-6 max-w-3xl leading-tight">
        Call it yourself. <br className="hidden sm:inline" /> Try to book a fake job.
      </h2>

      {/* Subhead */}
      <p className="mt-6 text-base sm:text-lg text-neutral-500 max-w-2xl leading-relaxed">
        Real number, real AI, right now. Ask about a burst pipe, a slow drain, whatever your trade throws at it — see how fast it answers and what it does with the call.
      </p>

      {/* Interactive Phone Card */}
      <div className="bg-neutral-50 border border-neutral-200/60 p-8 sm:p-10 rounded-2xl max-w-md w-full mt-10 shadow-[0_4px_12px_rgba(0,0,0,0.01)] flex flex-col items-center gap-6">
        
        {/* Large Tap to Call Number */}
        <div className="flex flex-col items-center gap-1.5">
          <a 
            href="tel:+16895882988" 
            className="text-3xl sm:text-4xl font-semibold tracking-tight text-neutral-900 hover:text-lime-600 transition-colors select-all"
          >
            (689) 588-2988
          </a>
          <span className="text-[10px] font-bold tracking-wider uppercase text-neutral-400 mt-1 select-none">
            No sales call. No form. Just dial and talk.
          </span>
        </div>

        {/* Action Button */}
        <a
          href="tel:+16895882988"
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-neutral-900 text-white font-medium hover:bg-neutral-800 active:bg-neutral-950 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.05)] text-base"
        >
          <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
          </svg>
          <span>Call the demo line now</span>
        </a>

        {/* Trust Line */}
        <p className="text-xs text-neutral-400 max-w-[280px] leading-normal select-none">
          Every call is recorded and disclosed — same as what your customers will hear.
        </p>

      </div>

    </section>
  );
}
