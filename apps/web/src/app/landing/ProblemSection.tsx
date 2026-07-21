// One job per section, hairline-divided — no card-grid decoration.
export default function ProblemSection() {
  return (
    <section className="relative mx-auto flex w-full max-w-3xl flex-col divide-y divide-border border-t border-border px-6">
      <div className="flex flex-col gap-3 py-14">
        <h2 className="text-2xl font-semibold">Every miss is a job your competitor just booked.</h2>
        <p className="text-muted">
          Solo plumbers miss 30–60% of their calls — hands full, truck loud, mid-repair. Most of those
          callers don&apos;t leave a voicemail. They call the next name on the list.
        </p>
      </div>
      <div className="flex flex-col gap-3 py-14">
        <h2 className="text-2xl font-semibold">Set up once, forward your number, done.</h2>
        <p className="text-muted">
          No new phone, no app your customers have to install. Forward your existing line when you&apos;re
          on a job, and it picks up on the second ring.
        </p>
      </div>
    </section>
  );
}
