"use client";
import { useState } from "react";
import { rescheduleBookingManually } from "./actions";

export default function RescheduleForm({ bookingId, currentStartIso }: { bookingId: string; currentStartIso: string }) {
  const [open, setOpen] = useState(false);
  const [newTime, setNewTime] = useState(currentStartIso.slice(0, 16));
  const [error, setError] = useState("");

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="text-sm text-blue-600 underline dark:text-blue-400">
        Reschedule
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <input type="datetime-local" value={newTime} onChange={(e) => setNewTime(e.target.value)} className="rounded border border-zinc-300 px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-900" />
      <button
        onClick={async () => {
          const result = await rescheduleBookingManually(bookingId, new Date(newTime).toISOString());
          if (result.error) setError(result.error);
          else setOpen(false);
        }}
        className="text-sm text-blue-600 underline dark:text-blue-400"
      >
        Confirm
      </button>
      {error && <span className="text-sm text-red-600">{error}</span>}
    </div>
  );
}
