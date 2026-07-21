// Stylized illustration of the owner app's Today view (not a photo/screenshot —
// no real production UI has been captured yet, and a fabricated "screenshot"
// would be dishonest). Shows the actual real features: live call log,
// emergency flag, a job the AI just booked.
export default function ProductVisual() {
  return (
    <section className="relative flex justify-center px-6 pb-24">
      <div className="w-full max-w-3xl overflow-hidden rounded-2xl border border-border bg-white/[0.02] shadow-[0_0_80px_-20px_rgba(255,107,61,0.25)]">
        <div className="flex items-center gap-2 border-b border-border px-5 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="ml-3 text-xs text-muted">pipeline.app/today</span>
        </div>
        <div className="flex flex-col gap-3 p-5 text-left">
          <div className="flex items-center justify-between rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-red-400">Emergency — gas smell reported</p>
              <p className="text-xs text-muted">Escalated to your cell · 2 min ago</p>
            </div>
            <span className="rounded-full bg-red-500/20 px-2 py-1 text-xs font-medium text-red-400">Live</span>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
            <div>
              <p className="text-sm font-medium">Drain cleaning — Maria T.</p>
              <p className="text-xs text-muted">Today, 2:00 PM · 118 Birchwood Ave</p>
            </div>
            <span className="rounded-full border border-accent/40 px-2 py-1 text-xs font-medium text-accent">Booked</span>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3">
            <div>
              <p className="text-sm font-medium">Leak repair — James O.</p>
              <p className="text-xs text-muted">Tomorrow, 9:30 AM · confirmed by SMS</p>
            </div>
            <span className="rounded-full border border-border px-2 py-1 text-xs text-muted">Confirmed</span>
          </div>
          <div className="mt-1 flex items-center justify-between rounded-lg bg-white/[0.03] px-4 py-3">
            <p className="text-sm text-muted">Calls answered today</p>
            <p className="text-sm font-medium">7 / 7 — zero missed</p>
          </div>
        </div>
      </div>
      <p className="sr-only">
        Illustration of the PipeLine owner dashboard, showing a live emergency escalation and two booked jobs.
      </p>
    </section>
  );
}
