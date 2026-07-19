// PRD FR-5.2/§18.2: 24h + 1h reminders, quiet hours 9pm-8am (never send during
// quiet hours — checked against the account's own tz, not server time), plus
// FR-5.6 owner morning digest. No cron infra yet (Fly.io not deployed) — meant
// to be called from a periodic in-process interval (see server.ts). "Already
// sent" tracking reuses events_analytics (jsonb-flexible) instead of adding
// more migrations mid-build — bookings/sms_messages have no direct link column.
import type { SupabaseClient } from "@supabase/supabase-js";
import { sendSms, type TwilioCreds } from "./sms.js";
import { logEvent } from "./analytics.js";
import { dateKeyInZone, zonedTimeToUtc } from "./tz.js";

function isQuietHours(date: Date, timeZone: string): boolean {
  const hour = Number(new Intl.DateTimeFormat("en-US", { timeZone, hour: "2-digit", hour12: false }).format(date));
  return hour >= 21 || hour < 8;
}

async function alreadyLogged(supabase: SupabaseClient, name: string, properties: Record<string, unknown>): Promise<boolean> {
  const { data } = await supabase.from("events_analytics").select("id").eq("name", name).contains("properties", properties).limit(1);
  return (data?.length ?? 0) > 0;
}

interface BookingRow {
  id: string;
  account_id: string;
  customer_id: string;
  starts_at: string;
  accounts: { tz: string };
  customers: { name: string | null; phone_e164: string };
  job_types: { name: string };
}

export async function sweepReminders(supabase: SupabaseClient, twilio: TwilioCreds): Promise<void> {
  const now = new Date();
  const { data: bookings } = await supabase
    .from("bookings")
    .select("id, account_id, customer_id, starts_at, accounts(tz), customers(name, phone_e164), job_types(name)")
    .eq("status", "confirmed")
    .gt("starts_at", now.toISOString());

  for (const raw of bookings ?? []) {
    const b = raw as unknown as BookingRow;
    if (isQuietHours(now, b.accounts.tz)) continue;

    const hoursUntil = (new Date(b.starts_at).getTime() - now.getTime()) / 3_600_000;
    const when = new Date(b.starts_at).toLocaleString("en-US", { timeZone: b.accounts.tz });
    const vars = { name: b.customers.name ?? "there", job: b.job_types.name, when, body: "" };

    if (hoursUntil <= 24 && !(await alreadyLogged(supabase, "reminder_sent", { booking_id: b.id, kind: "reminder24" }))) {
      const result = await sendSms(supabase, twilio, {
        accountId: b.account_id,
        customerId: b.customer_id,
        toE164: b.customers.phone_e164,
        kind: "reminder24",
        vars,
      });
      if ("ok" in result) await logEvent(supabase, b.account_id, "reminder_sent", { booking_id: b.id, kind: "reminder24" });
    }
    if (hoursUntil <= 1 && !(await alreadyLogged(supabase, "reminder_sent", { booking_id: b.id, kind: "reminder1" }))) {
      const result = await sendSms(supabase, twilio, {
        accountId: b.account_id,
        customerId: b.customer_id,
        toE164: b.customers.phone_e164,
        kind: "reminder1",
        vars,
      });
      if ("ok" in result) await logEvent(supabase, b.account_id, "reminder_sent", { booking_id: b.id, kind: "reminder1" });
    }
  }
}

interface ProfileRow {
  account_id: string;
  digest_time: string;
  accounts: { tz: string; owner_cell: string };
}

export async function sweepOwnerDigests(supabase: SupabaseClient, twilio: TwilioCreds): Promise<void> {
  const now = new Date();
  const { data: profiles } = await supabase.from("business_profile").select("account_id, digest_time, accounts(tz, owner_cell)");

  for (const raw of profiles ?? []) {
    const p = raw as unknown as ProfileRow;
    const nowLocal = new Intl.DateTimeFormat("en-US", {
      timeZone: p.accounts.tz,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(now);
    if (nowLocal < p.digest_time) continue;

    const today = dateKeyInZone(now, p.accounts.tz);
    if (await alreadyLogged(supabase, "digest_sent", { account_id: p.account_id, date: today })) continue;

    const dayStart = zonedTimeToUtc(today, "00:00", p.accounts.tz);
    const dayEnd = zonedTimeToUtc(today, "23:59", p.accounts.tz);
    const { data: todaysBookings } = await supabase
      .from("bookings")
      .select("id")
      .eq("account_id", p.account_id)
      .eq("status", "confirmed")
      .gte("starts_at", dayStart.toISOString())
      .lte("starts_at", dayEnd.toISOString());
    const count = todaysBookings?.length ?? 0;

    const auth = Buffer.from(`${twilio.accountSid}:${twilio.authToken}`).toString("base64");
    await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilio.accountSid}/Messages.json`, {
      method: "POST",
      headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        To: p.accounts.owner_cell,
        From: twilio.fromE164,
        Body: `Good morning! You have ${count} job${count === 1 ? "" : "s"} booked today.`,
      }),
    });
    await logEvent(supabase, p.account_id, "digest_sent", { account_id: p.account_id, date: today, jobs: count });
  }
}
