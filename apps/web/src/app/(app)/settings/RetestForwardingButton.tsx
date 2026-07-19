"use client";
import { useState } from "react";
import { retestForwarding } from "./actions";

export default function RetestForwardingButton() {
  const [result, setResult] = useState<{ ok: boolean; checkedAt: string } | null>(null);
  const [checking, setChecking] = useState(false);

  async function handleClick() {
    setChecking(true);
    const r = await retestForwarding();
    setResult(r);
    setChecking(false);
  }

  return (
    <div className="mt-3 flex items-center gap-3">
      <button onClick={handleClick} disabled={checking} className="rounded-lg bg-zinc-100 px-3 py-2 text-sm disabled:opacity-50 dark:bg-zinc-800">
        {checking ? "Testing…" : "Re-test forwarding"}
      </button>
      {result && <span className={result.ok ? "text-green-600" : "text-red-600"}>{result.ok ? "✓ Working" : "✗ Failed"}</span>}
    </div>
  );
}
