"use client";
import { useState } from "react";
import { cancelSubscription, exportAccountData, getRetentionStats } from "./actions";

export default function BillingActions() {
  const [cancelState, setCancelState] = useState<"idle" | "confirming" | "done" | "error">("idle");
  const [exporting, setExporting] = useState(false);
  const [stats, setStats] = useState<{ totalCalls: number; totalBooked: number; estValue: number } | null>(null);

  async function startCancel() {
    setStats(await getRetentionStats());
    setCancelState("confirming");
  }

  async function handleExport() {
    setExporting(true);
    const result = await exportAccountData();
    setExporting(false);
    if (!result.data) return;
    const blob = new Blob([result.data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pipeline-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleCancel() {
    const result = await cancelSubscription();
    setCancelState(result.error ? "error" : "done");
  }

  return (
    <div className="flex flex-col gap-3 text-sm">
      <button onClick={handleExport} disabled={exporting} className="text-left text-blue-600 underline dark:text-blue-400">
        {exporting ? "Preparing export…" : "Export my data"}
      </button>

      {cancelState === "idle" && (
        <button onClick={startCancel} className="text-left text-red-600 underline dark:text-red-400">
          Cancel subscription
        </button>
      )}
      {cancelState === "confirming" && stats && (
        <div className="flex flex-col gap-2 rounded-lg border border-amber-300 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-950">
          {stats.totalCalls > 0 ? (
            <p>
              So far PipeLine has answered <strong>{stats.totalCalls}</strong> call{stats.totalCalls === 1 ? "" : "s"} and booked{" "}
              <strong>{stats.totalBooked}</strong> job{stats.totalBooked === 1 ? "" : "s"}
              {stats.estValue > 0 && (
                <>
                  {" "}
                  worth about <strong>${Math.round(stats.estValue).toLocaleString()}</strong>
                </>
              )}
              . Cancelling means missed calls go unanswered again.
            </p>
          ) : (
            <p>You&apos;ll keep access until the end of your current billing period.</p>
          )}
          <div className="flex gap-3">
            <button onClick={handleCancel} className="text-red-600 underline dark:text-red-400">
              Cancel anyway
            </button>
            <button onClick={() => setCancelState("idle")} className="text-zinc-500 underline">
              Keep my plan
            </button>
          </div>
        </div>
      )}
      {cancelState === "done" && <p className="text-zinc-500">Subscription set to cancel at period end.</p>}
      {cancelState === "error" && <p className="text-red-600">Couldn&apos;t cancel — please try again.</p>}
    </div>
  );
}
