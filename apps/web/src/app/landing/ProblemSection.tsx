// One job per section, hairline-divided — no card-grid decoration.
export default function ProblemSection() {
  return (
    <section className="relative mx-auto flex w-full max-w-3xl flex-col divide-y divide-border border-t border-border px-6">
      <div className="flex flex-col gap-3 py-14">
        <h2 className="text-2xl font-semibold">TODO: problem statement 1</h2>
        <p className="text-muted">TODO: problem statement 1 body</p>
      </div>
      <div className="flex flex-col gap-3 py-14">
        <h2 className="text-2xl font-semibold">TODO: problem statement 2</h2>
        <p className="text-muted">TODO: problem statement 2 body</p>
      </div>
    </section>
  );
}
