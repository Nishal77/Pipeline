"use client";
import { useState } from "react";

// GTM asset (§21) — missed-call cost calculator. Pure client-side math, no
// backend needed.
export default function CostCalculator() {
  const [callsPerDay, setCallsPerDay] = useState(15);
  const [missedPct, setMissedPct] = useState(40);
  const [avgJobValue, setAvgJobValue] = useState(300);

  const missedCallsPerMonth = callsPerDay * (missedPct / 100) * 30;
  const bookRate = 0.3; // conservative: not every missed call would've booked
  const monthlyLoss = Math.round(missedCallsPerMonth * bookRate * avgJobValue);

  return (
    <div className="w-full max-w-md rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800">
      <h2 className="mb-4 text-lg font-semibold">What are missed calls costing you?</h2>
      <div className="flex flex-col gap-4 text-sm">
        <label className="flex flex-col gap-1">
          Calls per day: {callsPerDay}
          <input type="range" min={1} max={50} value={callsPerDay} onChange={(e) => setCallsPerDay(Number(e.target.value))} />
        </label>
        <label className="flex flex-col gap-1">
          % you miss: {missedPct}%
          <input type="range" min={0} max={100} value={missedPct} onChange={(e) => setMissedPct(Number(e.target.value))} />
        </label>
        <label className="flex flex-col gap-1">
          Average job value: ${avgJobValue}
          <input type="range" min={50} max={2000} step={50} value={avgJobValue} onChange={(e) => setAvgJobValue(Number(e.target.value))} />
        </label>
      </div>
      <p className="mt-4 rounded-lg bg-red-50 p-4 text-center text-xl font-semibold text-red-700 dark:bg-red-950 dark:text-red-300">
        ~${monthlyLoss.toLocaleString()}/mo in missed jobs
      </p>
    </div>
  );
}
