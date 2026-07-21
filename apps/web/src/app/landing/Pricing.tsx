export default function Pricing() {
  return (
    <section id="pricing" className="relative flex flex-col items-center gap-10 border-t border-border px-6 py-20">
      <div className="flex flex-col items-center gap-3 text-center">
        <h2 className="text-3xl font-semibold tracking-tight">TODO: pricing section heading</h2>
        <p className="max-w-md text-muted">TODO: pricing section subheading</p>
      </div>

      <div className="grid w-full max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Solo */}
        <div className="flex flex-col gap-6 rounded-2xl border border-border p-8">
          <div>
            <h3 className="text-lg font-semibold">Solo</h3>
            <p className="mt-1 text-sm text-muted">TODO: Solo plan tagline</p>
          </div>
          <p className="text-4xl font-semibold tracking-tight">
            $59<span className="text-base font-normal text-muted">/mo</span>
          </p>
          <ul className="flex flex-col gap-3 text-sm text-muted">
            <li className="flex gap-2">
              <span className="text-accent">✓</span> 24/7 AI answers every call
            </li>
            <li className="flex gap-2">
              <span className="text-accent">✓</span> Emergency triage &amp; gas-safety script
            </li>
            <li className="flex gap-2">
              <span className="text-accent">✓</span> Real-time booking into your calendar
            </li>
            <li className="flex gap-2">
              <span className="text-accent">✓</span> SMS confirmations, reminders &amp; reschedule
            </li>
            <li className="flex gap-2">
              <span className="text-accent">✓</span> Emergency escalation by SMS to your cell
            </li>
            <li className="flex gap-2">
              <span className="text-accent">✓</span> 1 calendar, 1 number, unlimited calls
            </li>
          </ul>
          <a
            href="/onboarding"
            className="mt-auto rounded-lg border border-border px-4 py-3 text-center text-sm font-medium hover:border-accent"
          >
            Start 14-day trial
          </a>
        </div>

        {/* Pro */}
        <div className="relative flex flex-col gap-6 rounded-2xl border border-accent p-8">
          <span className="absolute -top-3 left-8 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
            TODO: Pro plan badge
          </span>
          <div>
            <h3 className="text-lg font-semibold">Pro</h3>
            <p className="mt-1 text-sm text-muted">TODO: Pro plan tagline</p>
          </div>
          <p className="text-4xl font-semibold tracking-tight">
            $99<span className="text-base font-normal text-muted">/mo</span>
          </p>
          <ul className="flex flex-col gap-3 text-sm text-muted">
            <li className="flex gap-2">
              <span className="text-accent">✓</span> Everything in Solo
            </li>
            <li className="flex gap-2">
              <span className="text-accent">✓</span> Live-transfer to your cell on emergencies, not just SMS
            </li>
            <li className="flex gap-2">
              <span className="text-accent">✓</span> 2 calendars — split jobs across two techs
            </li>
            <li className="flex gap-2">
              <span className="text-accent">✓</span> Cloned-voice greeting — sounds like you, not a default AI
            </li>
            <li className="flex gap-2">
              <span className="text-accent">✓</span> Priority support
            </li>
          </ul>
          <a
            href="/onboarding"
            className="mt-auto rounded-lg bg-accent px-4 py-3 text-center text-sm font-medium text-accent-foreground"
          >
            Start 14-day trial
          </a>
        </div>
      </div>

      <p className="text-sm text-muted">TODO: pricing footer note</p>
    </section>
  );
}
