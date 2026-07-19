"use client";
import { useActionState, useState } from "react";
import { sendOtp, verifyOtp, sendMagicLink } from "./actions";

export default function LoginPage() {
  const [sendState, sendAction, sending] = useActionState(sendOtp, {});
  const [verifyState, verifyAction, verifying] = useActionState(verifyOtp, {});
  const [magicState, magicAction, magicSending] = useActionState(sendMagicLink, {});
  const [phone, setPhone] = useState("");
  const [useMagicLink, setUseMagicLink] = useState(false);

  const otpSent = sendState.sent;

  if (useMagicLink) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-white px-6 dark:bg-black">
        <h1 className="text-2xl font-semibold text-black dark:text-white">PipeLine</h1>
        {magicState.sent ? (
          <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">Check your email for a sign-in link.</p>
        ) : (
          <form action={magicAction} className="flex w-full max-w-xs flex-col gap-3">
            <label htmlFor="email" className="text-sm text-zinc-600 dark:text-zinc-400">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              className="rounded-lg border border-zinc-300 px-4 py-3 text-base dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
            />
            {magicState.error && <p className="text-sm text-red-600">{magicState.error}</p>}
            <button
              type="submit"
              disabled={magicSending}
              className="rounded-lg bg-black px-4 py-3 text-base font-medium text-white disabled:opacity-50 dark:bg-white dark:text-black"
            >
              {magicSending ? "Sending…" : "Send sign-in link"}
            </button>
          </form>
        )}
        <button onClick={() => setUseMagicLink(false)} className="text-sm text-blue-600 underline dark:text-blue-400">
          Use phone instead
        </button>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-white px-6 dark:bg-black">
      <h1 className="text-2xl font-semibold text-black dark:text-white">PipeLine</h1>

      {!otpSent ? (
        <form action={sendAction} className="flex w-full max-w-xs flex-col gap-3">
          <label htmlFor="phone" className="text-sm text-zinc-600 dark:text-zinc-400">
            Phone number
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+1 555 555 5555"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="rounded-lg border border-zinc-300 px-4 py-3 text-base dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
          />
          {sendState.error && <p className="text-sm text-red-600">{sendState.error}</p>}
          <button
            type="submit"
            disabled={sending}
            className="rounded-lg bg-black px-4 py-3 text-base font-medium text-white disabled:opacity-50 dark:bg-white dark:text-black"
          >
            {sending ? "Sending…" : "Send code"}
          </button>
          <button type="button" onClick={() => setUseMagicLink(true)} className="text-sm text-blue-600 underline dark:text-blue-400">
            Use email instead
          </button>
        </form>
      ) : (
        <form action={verifyAction} className="flex w-full max-w-xs flex-col gap-3">
          <input type="hidden" name="phone" value={sendState.phone} />
          <label htmlFor="token" className="text-sm text-zinc-600 dark:text-zinc-400">
            Enter the code we texted you
          </label>
          <input
            id="token"
            name="token"
            type="text"
            inputMode="numeric"
            placeholder="123456"
            required
            autoFocus
            className="rounded-lg border border-zinc-300 px-4 py-3 text-center text-lg tracking-widest dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
          />
          {verifyState.error && <p className="text-sm text-red-600">{verifyState.error}</p>}
          <button
            type="submit"
            disabled={verifying}
            className="rounded-lg bg-black px-4 py-3 text-base font-medium text-white disabled:opacity-50 dark:bg-white dark:text-black"
          >
            {verifying ? "Verifying…" : "Verify"}
          </button>
        </form>
      )}
    </main>
  );
}
