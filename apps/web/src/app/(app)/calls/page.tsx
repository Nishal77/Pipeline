import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

// FR-6.2 Calls log: filter chips, call cards. Detail (transcript + audio) is
// its own page (/calls/[id]) rather than a sliding drawer — same information,
// simpler than building drawer open/close state for no functional gain.
const FILTERS = [
  { label: "All", value: "all" },
  { label: "Booked", value: "booked" },
  { label: "Callback", value: "callback" },
  { label: "Emergency", value: "emergency" },
  { label: "Spam", value: "spam" },
] as const;

export default async function CallsPage({ searchParams }: { searchParams: Promise<{ filter?: string }> }) {
  const { filter = "all" } = await searchParams;
  const supabase = await createClient();

  let query = supabase.from("calls").select("id, from_e164, started_at, duration_s, triage_class, outcome, summary").order("started_at", { ascending: false }).limit(50);
  if (filter === "booked") query = query.eq("outcome", "booked");
  if (filter === "callback") query = query.in("outcome", ["callback", "message"]);
  if (filter === "emergency") query = query.eq("triage_class", "EMERGENCY");
  if (filter === "spam") query = query.eq("outcome", "spam");

  const { data: calls, error } = await query;

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-4 px-4 py-8">
      <h1 className="text-2xl font-semibold">Calls</h1>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((f) => (
          <Link
            key={f.value}
            href={f.value === "all" ? "/calls" : `/calls?filter=${f.value}`}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm ${
              filter === f.value ? "bg-black text-white dark:bg-white dark:text-black" : "bg-zinc-100 dark:bg-zinc-800"
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      {error && <p className="text-sm text-red-600">Couldn&apos;t load calls right now.</p>}
      {!error && (!calls || calls.length === 0) && <p className="text-sm text-zinc-500">No calls yet.</p>}

      <ul className="flex flex-col gap-3">
        {calls?.map((c) => (
          <li key={c.id}>
            <Link href={`/calls/${c.id}`} className="block rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
              <div className="flex items-center justify-between">
                <span className="font-medium">{c.from_e164}</span>
                <span className="text-xs text-zinc-500">{new Date(c.started_at).toLocaleString()}</span>
              </div>
              <p className="mt-1 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">{c.summary}</p>
              <div className="mt-2 flex gap-2">
                {c.triage_class === "EMERGENCY" && (
                  <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-700 dark:bg-red-950 dark:text-red-300">Emergency</span>
                )}
                <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs dark:bg-zinc-800">{c.outcome}</span>
                <span className="text-xs text-zinc-500">{c.duration_s}s</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
