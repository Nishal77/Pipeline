-- FR-4.1: Google Calendar OAuth tokens, one set per account. jsonb keeps this
-- additive (no new table) — same pattern as business_profile's other config fields.
alter table business_profile add column if not exists gcal_credentials jsonb;
