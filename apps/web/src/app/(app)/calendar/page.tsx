import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import RescheduleForm from "./RescheduleForm";
import { cancelBookingManually, toggleVacationMode } from "./actions";

// FR-6.3 Calendar screen. Drag-reschedule (spec) is a datetime input + submit
// here instead — same functional outcome, no drag-and-drop library needed for
// a v1. Google-sync-broken banner isn't built (would need a re-auth flow in
// Settings first).
export default async function CalendarPage({ searchParams }: { searchParams: Promise<{ view?: string; date?: string }> }) {
  const { view = "week", date } = await searchParams;
  const supabase = await createClient();

  const { data: account } = await supabase.from("accounts").select("id, tz").single();
  if (!account) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6 text-center">
        <p className="text-zinc-500">No account set up yet.</p>
      </main>
    );
  }

  const { data: profile } = await supabase.from("business_profile").select("hours").eq("account_id", account.id).maybeSingle();
  const vacationMode = Boolean((profile?.hours as { vacation_mode?: boolean } | null)?.vacation_mode);

  const anchor = date ? new Date(date) : new Date();
  const rangeStart = new Date(anchor);
  const rangeEnd = new Date(anchor);
  if (view === "day") {
    rangeStart.setHours(0, 0, 0, 0);
    rangeEnd.setHours(23, 59, 59, 999);
  } else {
    const day = rangeStart.getDay();
    rangeStart.setDate(rangeStart.getDate() - day);
    rangeStart.setHours(0, 0, 0, 0);
    rangeEnd.setTime(rangeStart.getTime() + 7 * 86_400_000 - 1);
  }

  const { data: bookings } = await supabase
    .from("bookings")
    .select("id, starts_at, status, customers(name, phone_e164), job_types(name)")
    .in("status", ["confirmed", "rescheduled"])
    .gte("starts_at", rangeStart.toISOString())
    .lte("starts_at", rangeEnd.toISOString())
    .order("starts_at", { ascending: true });

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Calendar</h1>
        <div className="flex gap-2 text-sm">
          <Link href={`/calendar?view=day${date ? `&date=${date}` : ""}`} className={view === "day" ? "font-semibold underline" : "text-zinc-500"}>
            Day
          </Link>
          <Link href={`/calendar?view=week${date ? `&date=${date}` : ""}`} className={view === "week" ? "font-semibold underline" : "text-zinc-500"}>
            Week
          </Link>
        </div>
      </div>

      <form
        action={async (formData) => {
          "use server";
          await toggleVacationMode(formData.get("vacation") === "on");
        }}
        className="flex items-center justify-between rounded-xl border border-zinc-200 p-4 text-sm dark:border-zinc-800"
      >
        <span>Vacation mode {vacationMode && <span className="text-amber-600 dark:text-amber-400">(no new bookings offered)</span>}</span>
        <input type="checkbox" name="vacation" defaultChecked={vacationMode} onChange={(e) => e.target.form?.requestSubmit()} />
      </form>

      {(!bookings || bookings.length === 0) && <p className="text-sm text-zinc-500">No bookings in this range.</p>}

      <ul className="flex flex-col gap-3">
        {bookings?.map((b) => {
          const customer = Array.isArray(b.customers) ? b.customers[0] : b.customers;
          const jobType = Array.isArray(b.job_types) ? b.job_types[0] : b.job_types;
          return (
            <li key={b.id} className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
              <div className="flex items-center justify-between">
                <span className="font-medium">{new Date(b.starts_at).toLocaleString("en-US", { timeZone: account.tz })}</span>
                <span className="text-sm text-zinc-500">{jobType?.name}</span>
              </div>
              <p className="mt-1 text-sm">{customer?.name}</p>
              <div className="mt-3 flex items-center gap-3">
                <RescheduleForm bookingId={b.id} currentStartIso={b.starts_at} />
                <form
                  action={async () => {
                    "use server";
                    await cancelBookingManually(b.id);
                  }}
                >
                  <button type="submit" className="text-sm text-red-600 underline dark:text-red-400">
                    Cancel
                  </button>
                </form>
              </div>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
