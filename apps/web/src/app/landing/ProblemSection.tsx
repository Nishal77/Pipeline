const OLD_WAY = [
  "Phone rings while you're under a sink — goes to voicemail",
  "Caller doesn't leave a message, calls the next plumber",
  "You find out about the emergency 3 hours later",
  "You call back, they've already booked someone else",
  "New number, new app, customers have to relearn how to reach you",
  "You guess what you quoted last time",
  "Reminders, confirmations, reschedules — all manual texting",
  "Set up takes a rep call, a contract, a rollout",
];

const PIPELINE_WAY = [
  "AI answers on the second ring, every time",
  "Caller's greeted, understood, and handled — no one calls the next name",
  "Gas leak or flooding gets you a call/SMS the moment it happens",
  "Job's already booked into your calendar before you even see the notification",
  "Same business number — forward it, nothing changes for them",
  "AI only quotes the price sheet you set — every time, no memory needed",
  "Confirmation, 24h + 1h reminders, reschedule-by-reply — automatic",
  "Forward your number, live same afternoon",
];

export default function ProblemSection() {
  return (
    <section className="relative mx-auto flex w-full max-w-6xl flex-col items-center bg-[#FBFBFA] px-6 py-24">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-medium text-accent">
        Same phone number. Completely different outcome.
      </span>
      <h2 className="mt-4 max-w-2xl text-center text-4xl font-semibold tracking-tight text-neutral-900 sm:text-5xl">
        One column costs you jobs. <br className="hidden sm:block" />
        The other <span className="text-accent">books them</span>.
      </h2>

      <div className="mt-14 grid w-full grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Without PipeLine — gray */}
        <div className="rounded-[28px] bg-neutral-100 p-8">
          <h3 className="text-2xl font-semibold text-neutral-900">Without PipeLine</h3>
          <p className="mt-1 text-sm text-neutral-500">Missed calls. Guesswork. Lost jobs.</p>
          <div className="mt-6 flex flex-col gap-3">
            {OLD_WAY.map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-full bg-white px-5 py-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-50 text-sm">🙁</span>
                <span className="text-sm text-neutral-700">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* With PipeLine — black */}
        <div className="relative overflow-hidden rounded-[28px] bg-[#0a0a0a] p-8 shadow-[0_0_120px_-30px_rgba(255,107,61,0.4)]">
          <h3 className="text-2xl font-semibold text-white">
            With <span className="text-accent">PipeLine</span>
          </h3>
          <p className="mt-1 text-sm text-white/50">Answered. Booked. Handled.</p>
          <div className="mt-6 flex flex-col gap-3">
            {PIPELINE_WAY.map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-full bg-white/[0.06] px-5 py-3.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/20 text-sm">🙂</span>
                <span className="text-sm text-white/90">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
