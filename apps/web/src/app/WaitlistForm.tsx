"use client";
import { useActionState } from "react";
import { joinWaitlist } from "./waitlist-actions";

export default function WaitlistForm() {
  const [state, action, pending] = useActionState(joinWaitlist, {});

  if (state.joined) {
    return <p className="text-sm text-green-600 dark:text-green-400">You&apos;re on the list — we&apos;ll text you when it&apos;s live.</p>;
  }

  return (
    <form action={action} className="flex w-full max-w-sm flex-col gap-3">
      <input name="name" placeholder="Your name" required className="rounded-lg border border-zinc-300 px-4 py-3 text-sm dark:border-zinc-700 dark:bg-zinc-900" />
      <input name="phone" placeholder="+1 555 555 5555" required className="rounded-lg border border-zinc-300 px-4 py-3 text-sm dark:border-zinc-700 dark:bg-zinc-900" />
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button type="submit" disabled={pending} className="rounded-lg bg-black px-4 py-3 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-black">
        {pending ? "Joining…" : "Join the waitlist"}
      </button>
    </form>
  );
}
