import { test } from "node:test";
import assert from "node:assert/strict";
import { zonedTimeToUtc, dayKeyInZone, dateKeyInZone } from "./tz.js";

// 2026-03-08 is DST spring-forward in the US (EST -5 -> EDT -4).
test("9am America/New_York before spring-forward is UTC-5", () => {
  const utc = zonedTimeToUtc("2026-03-07", "09:00", "America/New_York");
  assert.equal(utc.toISOString(), "2026-03-07T14:00:00.000Z");
});

test("9am America/New_York after spring-forward is UTC-4", () => {
  const utc = zonedTimeToUtc("2026-03-09", "09:00", "America/New_York");
  assert.equal(utc.toISOString(), "2026-03-09T13:00:00.000Z");
});

test("dayKeyInZone matches weekday in target zone, not UTC", () => {
  // 2026-03-09T02:00:00Z is still Sunday 2026-03-08 21:00 in New York (UTC-5 that day)
  assert.equal(dayKeyInZone(new Date("2026-03-09T02:00:00Z"), "America/New_York"), "sun");
});

test("dateKeyInZone renders YYYY-MM-DD", () => {
  assert.equal(dateKeyInZone(new Date("2026-03-09T02:00:00Z"), "America/New_York"), "2026-03-08");
});
