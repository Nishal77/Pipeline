import { createClient } from "@/lib/supabase/server";

// FR-6.1 Today view: today's appointments, emergency banner, callback queue.
// Empty/loading/error states per FR-6.5. RLS (owner_auth_id = auth.uid())
// scopes every query below to the signed-in owner's own account — no manual
// account_id filtering needed or possible from here.
export default async function TodayPage() {
  const supabase = await createClient();

  const { data: account, error: accountErr } = await supabase.from("accounts").select("id, business_name, tz").single();

  if (accountErr || !account) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-2 px-6 text-center">
        <p className="text-lg font-medium">No account set up yet</p>
        <p className="text-sm text-zinc-500">Onboarding isn&apos;t built yet — check back soon.</p>
      </main>
    );
  }

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const [{ data: bookings }, { data: emergencyCalls }, { data: callbackQueue }] = await Promise.all([
    supabase
      .from("bookings")
      .select("id, starts_at, ends_at, status, customers(name, phone_e164), addresses(line1, city, state, zip), job_types(name)")
      .eq("status", "confirmed")
      .gte("starts_at", todayStart.toISOString())
      .lte("starts_at", todayEnd.toISOString())
      .order("starts_at", { ascending: true }),
    supabase
      .from("calls")
      .select("id, from_e164, summary, started_at")
      .eq("triage_class", "EMERGENCY")
      .in("outcome", ["escalated_unreached", "callback", "abandoned"])
      .order("started_at", { ascending: false })
      .limit(5),
    supabase
      .from("calls")
      .select("id, from_e164, summary, started_at")
      .in("outcome", ["callback", "message"])
      .order("started_at", { ascending: false })
      .limit(10),
  ]);

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-8">
      <h1 className="text-2xl font-semibold">{account.business_name}</h1>

      {emergencyCalls && emergencyCalls.length > 0 && (
        <div className="rounded-xl border-2 border-red-600 bg-red-50 p-4 dark:bg-red-950">
          <p className="font-semibold text-red-700 dark:text-red-300">⚠ Unresolved emergency calls</p>
          <ul className="mt-2 flex flex-col gap-2">
            {emergencyCalls.map((c) => (
              <li key={c.id} className="text-sm">
                <a href={`tel:${c.from_e164}`} className="font-medium underline">
                  {c.from_e164}
                </a>{" "}
                — {c.summary}
              </li>
            ))}
          </ul>
        </div>
      )}

      <section>
        <h2 className="mb-3 text-lg font-medium">Today&apos;s appointments</h2>
        {!bookings || bookings.length === 0 ? (
          <p className="text-sm text-zinc-500">Nothing booked for today.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {bookings.map((b) => {
              const customer = Array.isArray(b.customers) ? b.customers[0] : b.customers;
              const address = Array.isArray(b.addresses) ? b.addresses[0] : b.addresses;
              const jobType = Array.isArray(b.job_types) ? b.job_types[0] : b.job_types;
              const time = new Date(b.starts_at).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                timeZone: account.tz,
              });
              return (
                <li key={b.id} className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{time}</span>
                    <span className="text-sm text-zinc-500">{jobType?.name}</span>
                  </div>
                  <p className="mt-1 text-sm">{customer?.name}</p>
                  {address && (
                    <p className="text-sm text-zinc-500">
                      {address.line1}, {address.city}, {address.state} {address.zip}
                    </p>
                  )}
                  <div className="mt-3 flex gap-3 text-sm">
                    <a href={`tel:${customer?.phone_e164}`} className="text-blue-600 underline dark:text-blue-400">
                      Call
                    </a>
                    {address && (
                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(`${address.line1}, ${address.city}, ${address.state} ${address.zip}`)}`}
                        className="text-blue-600 underline dark:text-blue-400"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Navigate
                      </a>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-lg font-medium">Callback queue</h2>
        {!callbackQueue || callbackQueue.length === 0 ? (
          <p className="text-sm text-zinc-500">Nothing waiting on a callback.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {callbackQueue.map((c) => (
              <li key={c.id} className="rounded-lg border border-zinc-200 p-3 text-sm dark:border-zinc-800">
                <a href={`tel:${c.from_e164}`} className="font-medium underline">
                  {c.from_e164}
                </a>{" "}
                — {c.summary}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
