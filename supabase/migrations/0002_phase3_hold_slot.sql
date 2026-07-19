-- Phase 3 FR-4.5: real hold/confirm needs a booking row to exist before the
-- caller's name/address are collected. Loosen the FKs; app code fills them in
-- when the hold is confirmed into a real booking.
alter table bookings alter column customer_id drop not null;
alter table bookings alter column address_id drop not null;

-- Out-of-area leads (FR-4.3): logged, never booked. No new table — reuses
-- events_analytics with a dedicated event name.
