import { DEMO_NUMBER, DEMO_NUMBER_DISPLAY } from "./data";

export default function Hero() {
  return (
    <>
      {/* Glow motif behind hero — CSS-only, no external asset */}
      <div className="pointer-events-none absolute top-0 left-1/2 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-accent/20 blur-[140px]" />

      <section className="relative flex flex-col items-center gap-8 px-6 pt-24 pb-16 text-center">
        <span className="rounded-full border border-border px-3 py-1 text-xs font-medium tracking-wide text-muted">
          The AI receptionist built specifically for plumbers
        </span>
        <h1 className="max-w-3xl text-5xl leading-[1.05] font-semibold tracking-tight sm:text-6xl">
          It knows a gas leak from a <span className="text-accent">dripping tap</span>.
        </h1>
        <p className="max-w-xl text-lg text-muted">
          Every AI answering service can pick up a phone. Almost none of them can tell an emergency from a
          routine call. PipeLine can — it triages, books the job, and gets you on the phone the moment it matters.
        </p>
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <a
            href={`tel:${DEMO_NUMBER}`}
            className="rounded-xl bg-accent px-8 py-4 text-lg font-medium text-accent-foreground transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Call {DEMO_NUMBER_DISPLAY} — try it now
          </a>
          <a href="#comparison" className="px-4 py-4 text-sm font-medium text-muted underline underline-offset-4">
            See how it compares
          </a>
        </div>
        <p className="text-sm text-muted">
          It&apos;s a real AI, not a script — try booking yourself a fake job. Calls are recorded, and it&apos;ll tell you that too.
        </p>
      </section>
    </>
  );
}
