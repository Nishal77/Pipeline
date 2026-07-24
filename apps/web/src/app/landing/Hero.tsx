import { DEMO_NUMBER, DEMO_NUMBER_DISPLAY } from "./data";

export default function Hero() {
  return (
    <>
      <section className="relative flex flex-col items-center gap-8 px-6 pt-24 pb-16 text-center bg-transparent overflow-hidden">
        <span className="rounded-full px-3 py-1 text-xs font-semibold tracking-wide text-black bg-gray-100 p-2">
          The AI receptionist built specifically for plumbers
        </span>
        <h1 className="max-w-3xl text-5xl leading-[1.05] font-medium tracking-tight sm:text-7xl text-white">
          Your Phone Just Got a Lot Better at Its Job.
        </h1>
        <p className="max-w-xl text-lg text-white">
          A 24/7 AI receptionist for home service businesses — it picks up, sorts urgent from routine, and books the job while you're still on the tools.
        </p>
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <a
            href={`tel:${DEMO_NUMBER}`}
            className="rounded-2xl bg-black px-3 py-4 text-base font-medium text-white transition-transform"
          >
            Call {DEMO_NUMBER_DISPLAY} — try it now
          </a>
          <a href="#comparison" className="px-4 py-4 text-sm font-medium text-gray-500 underline underline-offset-4 hover:text-black">
            See how it compares
          </a>
        </div>
        <p className="text-sm text-gray-400">
          It&apos;s a real AI, not a script — try booking yourself a fake job. Calls are recorded, and it&apos;ll tell you that too.
        </p>
      </section>
    </>
  );
}
