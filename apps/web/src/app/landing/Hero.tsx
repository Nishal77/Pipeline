import { DEMO_NUMBER, DEMO_NUMBER_DISPLAY } from "./data";

export default function Hero() {
  return (
    <>
      {/* Glow motif behind hero — CSS-only, no external asset */}
      <div className="pointer-events-none absolute top-0 left-1/2 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-accent/20 blur-[140px]" />

      <section className="relative flex flex-col items-center gap-8 px-6 pt-24 pb-16 text-center">
        {/* TODO: eyebrow/badge text */}
        <span className="rounded-full border border-border px-3 py-1 text-xs font-medium tracking-wide text-muted">
          TODO: badge text
        </span>
        {/* TODO: headline */}
        <h1 className="max-w-3xl text-5xl leading-[1.05] font-semibold tracking-tight sm:text-6xl">
          TODO: headline
        </h1>
        {/* TODO: subheadline */}
        <p className="max-w-xl text-lg text-muted">TODO: subheadline</p>
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <a
            href={`tel:${DEMO_NUMBER}`}
            className="rounded-xl bg-accent px-8 py-4 text-lg font-medium text-accent-foreground transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {/* TODO: primary CTA label */}
            Call {DEMO_NUMBER_DISPLAY} — TODO: CTA label
          </a>
          <a href="#calculator" className="px-4 py-4 text-sm font-medium text-muted underline underline-offset-4">
            {/* TODO: secondary CTA label */}
            TODO: secondary CTA
          </a>
        </div>
        {/* TODO: trust/disclosure line */}
        <p className="text-sm text-muted">TODO: trust line</p>
      </section>
    </>
  );
}
