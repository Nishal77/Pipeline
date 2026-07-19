// DRAFT — not legal advice. Needs real attorney review before launch.
export default function TermsOfServicePage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-4 px-6 py-16 text-sm text-zinc-700 dark:text-zinc-300">
      <p className="rounded-lg bg-amber-50 p-3 text-xs text-amber-700 dark:bg-amber-950 dark:text-amber-300">
        Draft — pending legal review. Not yet in effect.
      </p>
      <h1 className="text-2xl font-semibold text-black dark:text-white">Terms of Service</h1>
      <p>Last updated: [date]</p>

      <h2 className="mt-2 text-lg font-medium text-black dark:text-white">The service</h2>
      <p>
        PipeLine answers your business phone calls with an AI assistant, triages emergencies, books appointments, and
        sends customer SMS updates. It is a tool to assist your business — you remain responsible for the services
        you actually deliver to your customers.
      </p>

      <h2 className="mt-2 text-lg font-medium text-black dark:text-white">Triage &amp; liability</h2>
      <p>
        The AI&apos;s emergency triage is a best-effort classification, not a substitute for professional judgment.
        For safety-critical situations (e.g., gas leaks), the AI gives a fixed, non-editable safety script. PipeLine
        is not liable for outcomes resulting from a customer&apos;s failure to follow that guidance, or for triage
        errors within the bounds of reasonable AI performance.
      </p>

      <h2 className="mt-2 text-lg font-medium text-black dark:text-white">Billing</h2>
      <p>
        Plans are billed monthly or annually with a card required upfront and a 14-day free trial. You can cancel
        anytime from Settings; cancellation takes effect at the end of your current billing period. Failed payments
        may result in account pause after repeated retries, and cancellation after 21 days of non-payment.
      </p>

      <h2 className="mt-2 text-lg font-medium text-black dark:text-white">Acceptable use</h2>
      <p>
        You may not use PipeLine to answer calls for a business type it wasn&apos;t configured for, to misrepresent
        pricing beyond what&apos;s in your configured price sheet, or to attempt to make the AI claim to be human.
      </p>

      <h2 className="mt-2 text-lg font-medium text-black dark:text-white">Termination</h2>
      <p>We may suspend accounts that violate these terms or engage in abusive/fraudulent use.</p>

      <h2 className="mt-2 text-lg font-medium text-black dark:text-white">Contact</h2>
      <p>[business entity name, address, email — to be filled in once the entity is filed]</p>
    </main>
  );
}
