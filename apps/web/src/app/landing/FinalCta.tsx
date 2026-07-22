import WaitlistForm from "./WaitlistForm";

export default function FinalCta() {
  return (
    <section id="waitlist" className="relative flex flex-col items-center gap-4 border-t border-border px-6 py-20 text-center">
      <h2 className="text-2xl font-semibold">The next missed call is the one you don&apos;t hear about.</h2>
      <p className="max-w-md text-muted">Get on the waitlist now — first 25 accounts lock in $39/mo for life, and we&apos;ll text you the day it&apos;s live.</p>
      <WaitlistForm />
    </section>
  );
}
