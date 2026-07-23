import { GridTick } from "./icons";
import { PRICING_FAQS } from "./data";

export default function PricingFaq() {
  return (
    <section className="relative border-t border-neutral-200/80 px-4 sm:px-8 py-16">
      <GridTick position="top-left" />
      <GridTick position="top-right" />

      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col items-center gap-3 text-center">
          <h2 className="text-3xl font-medium tracking-tight text-neutral-900 sm:text-5xl">
            The questions everyone asks before <br /> they hand over a card number
          </h2>
         
        </div>

        <div className="flex flex-col divide-y divide-neutral-100">
          {PRICING_FAQS.map((item) => (
            <details key={item.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-sm font-medium text-neutral-900 sm:text-base">
                {item.q}
                <span className="shrink-0 text-neutral-400 transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-neutral-600">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
