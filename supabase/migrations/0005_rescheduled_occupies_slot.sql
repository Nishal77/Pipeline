-- A booking with status='rescheduled' still occupies its *current* slot —
-- the status only records that it was moved at least once, not that the
-- slot is free. The original index only protected (held, confirmed),
-- letting a rescheduled booking's own slot be re-offered as available
-- (found live: a reschedule-by-reply picked the booking's own current slot).
drop index if exists bookings_active_slot_idx;
create unique index bookings_active_slot_idx on bookings (account_id, job_type_id, starts_at)
  where status in ('held', 'confirmed', 'rescheduled');
