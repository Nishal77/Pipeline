// DRAFT — not legal advice. Needs real attorney review before launch
// (CLAUDE.md Phase 1: "Draft privacy policy + ToS... legal review budget
// $500-1,500"). Covers what CLAUDE.md's non-negotiable rules require:
// AI disclosure, recording consent, STOP/opt-out, data retention basics.
export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-4 px-6 py-16 text-sm text-zinc-700 dark:text-zinc-300">
      <p className="rounded-lg bg-amber-50 p-3 text-xs text-amber-700 dark:bg-amber-950 dark:text-amber-300">
        Draft — pending legal review. Not yet in effect.
      </p>
      <h1 className="text-2xl font-semibold text-black dark:text-white">Privacy Policy</h1>
      <p>Last updated: [date]</p>

      <h2 className="mt-2 text-lg font-medium text-black dark:text-white">What we collect</h2>
      <p>
        When you call a business using PipeLine, we record the call, transcribe it, and store your phone number, name,
        and service address if you provide them to book an appointment. We do not sell this data.
      </p>

      <h2 className="mt-2 text-lg font-medium text-black dark:text-white">AI disclosure</h2>
      <p>
        Every call is answered by an AI assistant, not a human. This is disclosed at the start of every call, and the
        AI will never claim to be a person if asked directly.
      </p>

      <h2 className="mt-2 text-lg font-medium text-black dark:text-white">Recording &amp; consent</h2>
      <p>
        Calls are recorded for quality and booking-accuracy purposes. By continuing the call after the disclosure, you
        consent to this recording, consistent with applicable one-party/two-party consent laws in your state.
      </p>

      <h2 className="mt-2 text-lg font-medium text-black dark:text-white">SMS &amp; opt-out</h2>
      <p>
        We send transactional messages only (booking confirmations, reminders). Reply STOP to any message to opt out
        immediately — we honor this globally and without delay.
      </p>

      <h2 className="mt-2 text-lg font-medium text-black dark:text-white">Data retention &amp; deletion</h2>
      <p>
        Account owners can export or delete their business&apos;s data at any time from Settings. Contact us to
        request deletion of your personal call/booking data as an end customer.
      </p>

      <h2 className="mt-2 text-lg font-medium text-black dark:text-white">Contact</h2>
      <p>[business entity name, address, email — to be filled in once the entity is filed]</p>
    </main>
  );
}
