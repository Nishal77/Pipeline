import CostCalculator from "./CostCalculator";
import WaitlistForm from "./WaitlistForm";

// GTM asset (§21 Phase 1): live demo line, missed-call cost calculator,
// waitlist. Demo number is whatever's provisioned for the seeded test
// account — swap for a dedicated public demo line before real launch.
const DEMO_NUMBER = "+16895882988";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center gap-16 bg-white px-6 py-16 text-center dark:bg-black">
      <section className="flex flex-col items-center gap-4">
        <h1 className="text-4xl font-semibold text-black dark:text-white">PipeLine</h1>
        <p className="max-w-md text-lg text-zinc-600 dark:text-zinc-400">
          A 24/7 AI phone assistant that answers every call, triages emergencies, and books the job — while you&apos;re under the sink.
        </p>
        <a
          href={`tel:${DEMO_NUMBER}`}
          className="rounded-xl bg-black px-8 py-4 text-lg font-medium text-white dark:bg-white dark:text-black"
        >
          📞 Call {DEMO_NUMBER} to try it
        </a>
        <p className="text-sm text-zinc-500">It&apos;s a real AI — try booking yourself a fake job.</p>
      </section>

      <CostCalculator />

      <section className="flex flex-col items-center gap-4">
        <h2 className="text-xl font-semibold">Not ready yet?</h2>
        <WaitlistForm />
      </section>
    </main>
  );
}
