import { FAQS } from "./data";

export default function Faq() {
  return (
    <section id="faq" className="relative border-t border-border px-6 py-24">
      <div className="mx-auto mb-12 flex max-w-2xl flex-col items-center gap-3 text-center">
        <h2 className="text-3xl font-semibold tracking-tight">Questions you&apos;d actually ask</h2>
      </div>
      <div className="mx-auto flex w-full max-w-2xl flex-col divide-y divide-border">
        {FAQS.map((item) => (
          <details key={item.q} className="group py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left font-medium">
              {item.q}
              <span className="shrink-0 text-muted transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 text-sm text-muted">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
