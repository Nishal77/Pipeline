import { GridTick } from "./icons";
import { DEMO_NUMBER, DEMO_NUMBER_DISPLAY } from "../landing/data";

export default function ConsultationBanner() {
  return (
    <section className="relative border-t border-neutral-200/80 px-8 py-14">
      <GridTick position="top-left" />
      <GridTick position="top-right" />

      <div
        className="mx-auto max-w-7xl relative overflow-hidden rounded-2xl px-8 py-14 sm:px-14 sm:py-20"
        style={{ backgroundImage: "url(https://i.pinimg.com/736x/f3/71/0c/f3710c43f5511f6955f0164ccf1e7f6a.jpg)", backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0 opacity-100" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
          maskImage: 'radial-gradient(ellipse at center, black 60%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 60%, transparent 100%)'
        }} />
        <div className="relative max-w-lg">
          <h2 className="text-3xl font-medium tracking-tight text-black sm:text-4xl">
            The next call you miss is the one you&apos;ll wish you hadn&apos;t.
          </h2>
          <p className="mt-4 text-sm text-gray-600 sm:text-base">
            Forward your number and it&apos;s live. No install, no rollout — the AI answers, sorts the
            emergencies from the routine, and gets the job on your calendar while you&apos;re still on the job.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="/onboarding"
              className="rounded-full bg-[#FFEA5D] px-6 py-3.5 text-sm font-medium text-black transition-all duration-200 hover:bg-[#FFEE33] active:scale-[0.99]"
            >
              Try free for 7 days
            </a>
            <a
              href={`tel:${DEMO_NUMBER}`}
              className="rounded-full border border-neutral-900/20 bg-white/70 px-6 py-3.5 text-sm font-medium text-neutral-900 backdrop-blur-sm transition-all duration-200 hover:bg-white active:scale-[0.99]"
            >
              Call {DEMO_NUMBER_DISPLAY}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
