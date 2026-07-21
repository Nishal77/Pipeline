import { STEPS } from "./data";

export default function HowItWorks() {
  return (
    <section id="how" className="relative border-t border-border px-6 py-24">
      <div className="mx-auto mb-14 flex max-w-2xl flex-col items-center gap-3 text-center">
        <h2 className="text-3xl font-semibold tracking-tight">TODO: how-it-works heading</h2>
      </div>
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-10 sm:flex-row sm:gap-6">
        {STEPS.map((s) => (
          <div key={s.n} className="flex flex-1 flex-col gap-2">
            <span className="text-sm font-medium text-accent">{s.n}</span>
            <h3 className="text-lg font-medium">{s.title}</h3>
            <p className="text-sm text-muted">{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
