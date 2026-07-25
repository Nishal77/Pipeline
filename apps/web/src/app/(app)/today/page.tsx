import { createClient } from "@/lib/supabase/server";
import OnMyWayButton from "./OnMyWayButton";

// FR-6.1 Today view: today's appointments, emergency banner, callback queue.
// Empty/loading/error states per FR-6.5. RLS (owner_auth_id = auth.uid())
// scopes every query below to the signed-in owner's own account — no manual
// account_id filtering needed or possible from here.
export default async function TodayPage() {
  const supabase = await createClient();

  const { data: account, error: accountErr } = await supabase.from("accounts").select("id, business_name, tz").single();

  if (accountErr || !account) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#FBFBFA] px-6 text-center">
        <div className="relative border border-dashed border-neutral-300 bg-white p-8 max-w-sm w-full shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="absolute -top-1 -left-1 w-2 h-2 border border-neutral-400 bg-white z-20"></div>
          <div className="absolute -top-1 -right-1 w-2 h-2 border border-neutral-400 bg-white z-20"></div>
          <div className="absolute -bottom-1 -left-1 w-2 h-2 border border-neutral-400 bg-white z-20"></div>
          <div className="absolute -bottom-1 -right-1 w-2 h-2 border border-neutral-400 bg-white z-20"></div>
          
          <h1 className="text-lg font-medium text-neutral-900">Welcome to PipeLine</h1>
          <p className="text-xs text-neutral-500 mt-2">Let&apos;s get your business profile and answering routing configured.</p>
          <a
            href="/onboarding"
            className="mt-6 inline-block w-full bg-neutral-900 hover:bg-neutral-800 text-white font-medium py-3 px-4 rounded-none transition-colors text-sm"
          >
            Start onboarding setup
          </a>
        </div>
      </main>
    );
  }

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  // Parallel fetch: phone number, profile configurations, bookings, and logs
  const [
    { data: phoneData },
    { data: profileData },
    { data: bookings },
    { data: emergencyCalls },
    { data: callbackQueue }
  ] = await Promise.all([
    supabase.from("phone_numbers").select("e164").eq("account_id", account.id).maybeSingle(),
    supabase.from("business_profile").select("gcal_credentials, hours, emergency_policy").eq("account_id", account.id).maybeSingle(),
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

  const activeNumber = phoneData?.e164 || "No active line";
  const hasGcal = !!profileData?.gcal_credentials;
  const tradeType = profileData?.emergency_policy?.trade_type || "Services";

  return (
    <>
      {/* Dashboard Header */}
        <div className="relative border border-dashed border-neutral-300 bg-white p-6 sm:p-8 w-full rounded-none shadow-[0_1px_3px_rgba(0,0,0,0.02)] mb-8 z-10">
          <div className="absolute -top-1 -left-1 w-2 h-2 border border-neutral-400 bg-white z-20"></div>
          <div className="absolute -top-1 -right-1 w-2 h-2 border border-neutral-400 bg-white z-20"></div>
          <div className="absolute -bottom-1 -left-1 w-2 h-2 border border-neutral-400 bg-white z-20"></div>
          <div className="absolute -bottom-1 -right-1 w-2 h-2 border border-neutral-400 bg-white z-20"></div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">{tradeType} Dashboard</span>
              <h1 className="text-3xl font-medium text-neutral-900 mt-0.5">{account.business_name}</h1>
            </div>

            <div className="flex flex-wrap items-center gap-3.5">
              <div className="flex items-center gap-2 border border-neutral-200 bg-neutral-50 px-3 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-lime-500"></span>
                <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-wider">AI receptionist active</span>
              </div>
              <div className="flex items-center gap-2 border border-neutral-200 bg-neutral-50 px-3 py-1.5">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Answering Line:</span>
                <span className="text-[11px] font-mono font-semibold text-neutral-700">{activeNumber}</span>
              </div>
              <div className="flex items-center gap-2 border border-neutral-200 bg-neutral-50 px-3 py-1.5">
                <span className={`h-1.5 w-1.5 rounded-full ${hasGcal ? "bg-lime-500" : "bg-neutral-300"}`}></span>
                <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-wider">GCal Synced</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 z-10">
          
          {/* Main Area: Appointments & Emergency Alert Column (takes 2 cols) */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* UNRESOLVED EMERGENCY ALERTS */}
            {emergencyCalls && emergencyCalls.length > 0 && (
              <div className="border border-red-200 bg-red-50/50 p-6 flex flex-col gap-4">
                <div className="flex items-center gap-2 border-b border-red-100 pb-2">
                  <span className="h-2 w-2 rounded-full bg-red-600 animate-pulse"></span>
                  <span className="text-[10px] font-bold tracking-wider text-red-700 uppercase">Unresolved Emergency Calls</span>
                </div>
                <ul className="flex flex-col gap-3">
                  {emergencyCalls.map((c) => {
                    const callTime = new Date(c.started_at).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                      timeZone: account.tz,
                    });
                    return (
                      <li key={c.id} className="bg-white border border-red-200 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-[0_1px_3px_rgba(239,68,68,0.02)]">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-neutral-800">{c.from_e164}</span>
                            <span className="text-[9px] text-neutral-400">{callTime}</span>
                          </div>
                          <p className="text-xs text-neutral-600 leading-normal">{c.summary}</p>
                        </div>
                        <a
                          href={`tel:${c.from_e164}`}
                          className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold py-2 px-4 rounded-none transition-colors inline-block text-center shrink-0 border border-red-600"
                        >
                          Call Back Now
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {/* APPOINTMENTS */}
            <section className="border border-neutral-200 bg-white p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
              <div className="border-b border-neutral-100 pb-3 mb-5 flex items-center justify-between">
                <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">Today&apos;s Appointments</h2>
                {bookings && bookings.length > 0 && (
                  <span className="text-[10px] font-bold bg-neutral-100 px-2 py-0.5 rounded-sm">{bookings.length} jobs</span>
                )}
              </div>

              {!bookings || bookings.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-sm text-neutral-500 font-medium">No appointments booked for today.</p>
                  <p className="text-xs text-neutral-400 mt-1">Your AI receptionist is monitoring the line for incoming calls.</p>
                </div>
              ) : (
                <ul className="flex flex-col gap-4">
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
                      <li key={b.id} className="border border-neutral-200 p-5 flex flex-col gap-4 bg-neutral-50/20">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-xl font-semibold text-neutral-900 font-mono tracking-tight">{time}</span>
                            <h3 className="text-sm font-semibold text-neutral-800 mt-1">{customer?.name}</h3>
                          </div>
                          <span className="text-[10px] font-bold text-neutral-600 bg-neutral-100 border border-neutral-200 px-2.5 py-0.5 uppercase tracking-wider">
                            {jobType?.name}
                          </span>
                        </div>

                        {address && (
                          <div className="text-xs text-neutral-500 leading-normal flex items-start gap-1">
                            <svg className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>
                              {address.line1}, {address.city}, {address.state} {address.zip}
                            </span>
                          </div>
                        )}

                        <div className="grid grid-cols-3 gap-2.5 pt-3 border-t border-dashed border-neutral-200">
                          <a
                            href={`tel:${customer?.phone_e164}`}
                            className="border border-neutral-300 hover:bg-neutral-50 text-neutral-700 text-xs font-semibold py-2.5 px-3 rounded-none text-center transition-colors flex items-center justify-center gap-1.5"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            Call
                          </a>
                          {address ? (
                            <a
                              href={`https://maps.google.com/?q=${encodeURIComponent(`${address.line1}, ${address.city}, ${address.state} ${address.zip}`)}`}
                              className="border border-neutral-300 hover:bg-neutral-50 text-neutral-700 text-xs font-semibold py-2.5 px-3 rounded-none text-center transition-colors flex items-center justify-center gap-1.5"
                              target="_blank"
                              rel="noreferrer"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                              </svg>
                              Navigate
                            </a>
                          ) : (
                            <div className="bg-neutral-100 text-neutral-400 text-xs font-semibold py-2.5 px-3 rounded-none text-center select-none flex items-center justify-center">
                              No Address
                            </div>
                          )}
                          <OnMyWayButton bookingId={b.id} />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          </div>

          {/* Sidebar: Callback Queue & Calendar Connection (takes 1 col) */}
          <div className="flex flex-col gap-6">

            {/* GOOGLE CALENDAR PROMPT */}
            {!hasGcal && (
              <div className="border border-amber-200 bg-amber-50/50 p-6 flex flex-col gap-3">
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">Sync Calendar</span>
                <p className="text-xs text-amber-700 leading-normal">
                  Your Google Calendar is not connected. Connect it now to let the AI assistant auto-block slots and sync jobs in real-time.
                </p>
                <a
                  href="/oauth/google/start"
                  className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold py-2.5 px-4 rounded-none transition-colors text-center border border-amber-600 mt-1"
                >
                  Connect Google Calendar
                </a>
              </div>
            )}

            {/* CALLBACK QUEUE */}
            <section className="border border-neutral-200 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.01)] flex flex-col gap-4">
              <div className="border-b border-neutral-100 pb-3">
                <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">Callback Queue</h2>
              </div>

              {!callbackQueue || callbackQueue.length === 0 ? (
                <p className="text-xs text-neutral-400 italic py-4 text-center">Nothing waiting on a callback.</p>
              ) : (
                <ul className="flex flex-col gap-3">
                  {callbackQueue.map((c) => {
                    const callTime = new Date(c.started_at).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                      timeZone: account.tz,
                    });
                    return (
                      <li key={c.id} className="border border-dashed border-neutral-200 p-3.5 bg-neutral-50/30 flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <a href={`tel:${c.from_e164}`} className="text-xs font-mono font-bold text-neutral-700 hover:underline">
                            {c.from_e164}
                          </a>
                          <span className="text-[9px] text-neutral-400">{callTime}</span>
                        </div>
                        <p className="text-xs text-neutral-500 leading-normal">{c.summary}</p>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          </div>
        </div>
      </>
    );
  }
