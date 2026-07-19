"use client";
import { useState } from "react";
import { cancelSubscription, exportAccountData } from "./actions";

export default function BillingActions() {
  const [cancelState, setCancelState] = useState<"idle" | "confirming" | "done" | "error">("idle");
  const [exporting, setExporting] = useState(false);

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
        <button onClick={() => setCancelState("confirming")} className="text-left text-red-600 underline dark:text-red-400">
          Cancel subscription
        </button>
      )}
      {cancelState === "confirming" && (
        <div className="flex flex-col gap-2">
          <p className="text-zinc-500">You&apos;ll keep access until the end of your current billing period. Sure?</p>
          <div className="flex gap-3">
            <button onClick={handleCancel} className="text-red-600 underline dark:text-red-400">
              Yes, cancel
            </button>
            <button onClick={() => setCancelState("idle")} className="text-zinc-500 underline">
              Never mind
            </button>
          </div>
        </div>
      )}
      {cancelState === "done" && <p className="text-zinc-500">Subscription set to cancel at period end.</p>}
      {cancelState === "error" && <p className="text-red-600">Couldn&apos;t cancel — please try again.</p>}
    </div>
  );
}
