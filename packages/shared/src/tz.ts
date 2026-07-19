// Native Intl-only local-time <-> UTC conversion (no luxon/date-fns-tz dep —
// Intl.DateTimeFormat already carries the full IANA tz database, including DST
// transitions). Standard algorithm: format a naive UTC guess in the target
// zone, diff against the original guess, and correct by that offset.
export function zonedTimeToUtc(dateISO: string, timeHHMM: string, timeZone: string): Date {
  const naiveUtc = new Date(`${dateISO}T${timeHHMM}:00Z`);
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const parts = Object.fromEntries(fmt.formatToParts(naiveUtc).map((p) => [p.type, p.value]));
  const hour = parts.hour === "24" ? "00" : parts.hour; // some locales format midnight as 24
  const asIfUtc = new Date(`${parts.year}-${parts.month}-${parts.day}T${hour}:${parts.minute}:${parts.second}Z`);
  const offsetMs = naiveUtc.getTime() - asIfUtc.getTime();
  return new Date(naiveUtc.getTime() + offsetMs);
}

export function dateKeyInZone(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
}

const DAY_NAMES = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;

export function dayKeyInZone(date: Date, timeZone: string): (typeof DAY_NAMES)[number] {
  const short = new Intl.DateTimeFormat("en-US", { timeZone, weekday: "short" }).format(date).toLowerCase();
  return (DAY_NAMES.find((d) => short.startsWith(d)) ?? "mon") as (typeof DAY_NAMES)[number];
}
