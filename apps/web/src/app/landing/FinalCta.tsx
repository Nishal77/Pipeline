import WaitlistForm from "./WaitlistForm";

export default function FinalCta() {
  return (
    <section className="relative flex flex-col items-center gap-4 border-t border-border px-6 py-20 text-center">
      <h2 className="text-2xl font-semibold">Not ready to switch your line over yet?</h2>
      <p className="max-w-md text-muted">Get on the list — we&apos;ll text you the day it&apos;s live.</p>
      <WaitlistForm />
    </section>
  );
}
