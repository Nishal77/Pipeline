import React from "react";

export default function FinalCta() {
  return (
    <section id="waitlist" className="w-full bg-[#FBFBFA]">
      <div
        className="w-full relative overflow-hidden px-6 py-16 sm:px-12 sm:py-24 text-left"
        style={{
          backgroundImage: "url(https://i.pinimg.com/736x/f3/71/0c/f3710c43f5511f6955f0164ccf1e7f6a.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        {/* Paper texture noise overlay */}
        <div
          className="absolute inset-0 opacity-100 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px',
            maskImage: 'radial-gradient(ellipse at center, black 65%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 65%, transparent 100%)'
          }}
        />

        {/* Content Box */}
        <div className="relative z-10 max-w-4xl">
          <span className="text-base font-normal tracking-tight text-lime-600">
            Before you call the demo line
          </span>
          <h2 className="text-3xl font-normal tracking-tight sm:text-5xl text-black mt-4 leading-tight">
            Call the demo line. Try to book a fake job. See what your customers hear.
          </h2>
          <p className="mt-4 text-sm text-neutral-700 sm:text-base leading-relaxed max-w-2xl">
            No signup needed to try it. Ready to go live trial first, card required, cancel anytime, under 15 minutes on your real number, whatever trade you run.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="tel:+16895882988"
              className="rounded-md bg-[#000] px-6 py-3.5 text-sm font-medium text-white transition-all duration-200 hover:bg-[#000]/80"
            >
              Call the demo line
            </a>
            <a
              href="/onboarding"
              className="rounded-md border border-neutral-900/20 bg-white/70 px-6 py-3.5 text-sm font-medium text-neutral-900 backdrop-blur-sm transition-all duration-200 hover:bg-white"
            >
              Try free for 7 days
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
