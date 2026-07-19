"use client";
import { useState } from "react";
import { sendOnMyWay } from "./actions";

export default function OnMyWayButton({ bookingId }: { bookingId: string }) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleClick() {
    setState("sending");
    const result = await sendOnMyWay(bookingId);
    setState(result.error ? "error" : "sent");
  }

  if (state === "sent") return <span className="text-green-600 dark:text-green-400">✓ Sent</span>;

  return (
    <button onClick={handleClick} disabled={state === "sending"} className="text-blue-600 underline disabled:opacity-50 dark:text-blue-400">
      {state === "sending" ? "Sending…" : state === "error" ? "Failed, retry?" : "On my way"}
    </button>
  );
}
