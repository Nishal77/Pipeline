import React from "react";
import { FAQS } from "./data";

export default function Faq() {
  return (
    <section id="faq" className="relative w-full bg-[#FBFBFA] pt-8 pb-20 sm:pt-12 sm:pb-24">
      <div className="mx-auto max-w-7xl px-6 sm:px-12 lg:px-8 w-full">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Eyebrow & Heading */}
          <div className="w-full lg:w-[35%] lg:sticky lg:top-36 flex flex-col gap-2">
            <span className="text-base font-normal tracking-tight text-lime-600">
              Before you call the demo line
            </span>
            <h2 className="text-3xl font-normal tracking-tight sm:text-5xl text-neutral-900 mt-3 leading-tight">
              Questions every <span className="bg-[#FAFB86] text-neutral-900 px-2 rounded-sm inline-block"> business </span> owner asks us first
            </h2>
          </div>

          {/* Right Column: Accordion List */}
          <div className="w-full lg:w-[65%] flex flex-col divide-y divide-neutral-200/60 border-t border-b border-neutral-200/60 lg:border-t-0 lg:border-b-0">
            {FAQS.map((item) => (
              <details key={item.q} className="group py-5 first:pt-0 last:pb-0">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-base font-medium text-neutral-900 pr-2 select-none">
                  <span>{item.q}</span>
                  <span className="shrink-0 text-neutral-400 text-lg transition-transform duration-300 group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-base leading-relaxed text-neutral-500 whitespace-pre-line">
                  {item.a}
                </p>
              </details>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
