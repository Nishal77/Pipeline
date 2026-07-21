"use client";
import { useActionState } from "react";
import { joinWaitlist } from "./waitlist-actions";

export default function WaitlistForm() {
  const [state, action, pending] = useActionState(joinWaitlist, {});

  if (state.joined) {
    return <p className="text-sm text-accent">You&apos;re on the list — we&apos;ll text you when it&apos;s live.</p>;
  }

  return (
    <form action={action} className="flex w-full max-w-sm flex-col gap-3">
      <input
        name="name"
        placeholder="Your name"
        required
        className="rounded-lg border border-border bg-white/[0.02] px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
      />
      <input
        name="phone"
        placeholder="+1 555 555 5555"
        required
        className="rounded-lg border border-border bg-white/[0.02] px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
      />
      {state.error && <p className="text-sm text-red-400">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-accent px-4 py-3 text-sm font-medium text-accent-foreground disabled:opacity-50"
      >
        {pending ? "Joining…" : "Join the waitlist"}
      </button>
    </form>
  );
}
