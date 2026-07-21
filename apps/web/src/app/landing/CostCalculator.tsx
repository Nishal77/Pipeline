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
    <div className="w-full max-w-md rounded-2xl border border-border bg-white/[0.02] p-6">
      <h2 className="mb-4 text-lg font-semibold">What are missed calls costing you?</h2>
      <div className="flex flex-col gap-5 text-sm text-muted">
        <label className="flex flex-col gap-2">
          Calls per day: <span className="text-foreground">{callsPerDay}</span>
          <input type="range" min={1} max={50} value={callsPerDay} onChange={(e) => setCallsPerDay(Number(e.target.value))} className="accent-accent" />
        </label>
        <label className="flex flex-col gap-2">
          % you miss: <span className="text-foreground">{missedPct}%</span>
          <input type="range" min={0} max={100} value={missedPct} onChange={(e) => setMissedPct(Number(e.target.value))} className="accent-accent" />
        </label>
        <label className="flex flex-col gap-2">
          Average job value: <span className="text-foreground">${avgJobValue}</span>
          <input type="range" min={50} max={2000} step={50} value={avgJobValue} onChange={(e) => setAvgJobValue(Number(e.target.value))} className="accent-accent" />
        </label>
      </div>
      <p className="mt-6 rounded-lg border border-accent/30 bg-accent/10 p-4 text-center text-xl font-semibold text-accent">
        ~${monthlyLoss.toLocaleString()}/mo in missed jobs
      </p>
    </div>
  );
}
