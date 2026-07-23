"use client";

import { PLANS } from "./data";
import { CheckIcon } from "./icons";

export default function PricingCards({ isAnnual }: { isAnnual: boolean }) {
  const [solo, crew] = PLANS;

  return (
    <section className="relative mx-auto w-full max-w-7xl px-6 pt-20 pb-12">
      <div className="rounded-3xl bg-[#F2F2F2] p-4 sm:p-8 grid grid-cols-1 sm:grid-cols-2 gap-6 items-stretch">
        {/* Solo — integrated into the gray background */}
        <div className="flex flex-col justify-between p-6 sm:p-8">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-800 text-white shadow-sm">
                <div className="h-4 w-4 rounded-full border-2 border-white/80 bg-neutral-800" />
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-medium tracking-tight text-neutral-900">{solo.name} - A few calls a day</h2>
              <p className="mt-1 text-sm text-neutral-500 font-normal">{solo.tagline}</p>
            </div>

            <div className="mt-6 flex items-baseline">
              <span className="text-4xl sm:text-5xl font-medium tracking-tight text-neutral-900">
                ${isAnnual ? Math.floor(solo.price * 0.71) : solo.price}
              </span>
              <span className="ml-1 text-sm font-medium text-neutral-500">/Month</span>
            </div>

            <div className="my-6 h-[1px] w-full bg-neutral-300/60" />

            <p className="mb-3 text-sm font-medium text-neutral-800 tracking-wide">{solo.featuresHeader}</p>
            <ul className="flex flex-col gap-3 text-sm text-neutral-600">
              {solo.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5">
                  <CheckIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-neutral-800" />
                  <span className="leading-snug">{f}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8">
            <a
              href="/onboarding"
              className="block w-full rounded-2xl bg-[#FFEA5D] border border-gray-100 py-3.5 text-center text-sm font-medium text-black transition-all duration-200 hover:bg-[#FFEE33]"
            >
              Try free for 7 days
            </a>
          </div>
        </div>

        {/* Crew — embedded crisp white rounded container */}
        <div className="flex flex-col justify-between rounded-3xl bg-white p-6 sm:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.02)]">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-200 via-pink-300 to-sky-300 shadow-sm">
                <div className="h-5 w-5 rounded-full bg-white/40 backdrop-blur-sm" />
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-medium tracking-tight text-neutral-900">{crew.name} - Calls all day</h2>
              <p className="mt-1 text-sm text-neutral-500 font-normal">{crew.tagline}</p>
            </div>

            <div className="mt-6 flex items-baseline">
              <span className="text-4xl sm:text-5xl font-medium tracking-tight text-neutral-900">
                ${isAnnual ? Math.floor(crew.price * 0.71) : crew.price}
              </span>
              <span className="ml-1 text-sm font-medium text-neutral-500">/Month</span>
            </div>

            <div className="my-6 h-[1px] w-full bg-neutral-200" />

            <p className="mb-3 text-sm font-medium text-neutral-800 tracking-wide">{crew.featuresHeader}</p>
            <ul className="flex flex-col gap-3 text-sm text-neutral-600">
              {crew.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5">
                  <CheckIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-neutral-800" />
                  <span className="leading-snug">{f}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8">
            <a
              href="/onboarding"
              className="block w-full rounded-2xl bg-[#FFEA5D] border border-gray-100 py-3.5 text-center text-sm font-medium text-black transition-all duration-200 hover:bg-[#FFEE33]"
            >
              Try free for 7 days
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
