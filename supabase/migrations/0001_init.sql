-- PipeLine schema v1 (PRD §13). Every table RLS'd per account; owner_auth_id links
-- an account to its Supabase auth user (phone OTP, FR-6.6).
create extension if not exists "pgcrypto";

create type account_status as enum ('trial', 'active', 'past_due', 'paused', 'canceled');
create type plan_type as enum ('solo', 'pro');
create type triage_class as enum ('EMERGENCY', 'URGENT_TODAY', 'ROUTINE');
create type call_outcome as enum ('booked', 'callback', 'message', 'escalated_connected', 'escalated_unreached', 'spam', 'abandoned');
create type booking_status as enum ('held', 'confirmed', 'rescheduled', 'canceled');
create type booking_source as enum ('ai_call', 'owner_manual', 'sms_reschedule');
create type sms_kind as enum ('confirm', 'reminder24', 'reminder1', 'otw', 'digest', 'freeform');
create type sms_status as enum ('queued', 'sent', 'delivered', 'failed');
create type escalation_method as enum ('transfer', 'sms', 'retry_call');
create type audit_actor as enum ('owner', 'system', 'ai');

create table accounts (
  id uuid primary key default gen_random_uuid(),
  owner_auth_id uuid not null references auth.users(id) on delete cascade,
  business_name text not null,
  owner_name text not null,
  owner_cell text not null,
  email text not null,
  tz text not null default 'America/New_York',
  plan plan_type not null default 'solo',
  stripe_customer_id text,
  status account_status not null default 'trial',
  trial_ends_at timestamptz,
  created_at timestamptz not null default now()
);

create table phone_numbers (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references accounts(id) on delete cascade,
  e164 text not null unique,
  type text not null check (type in ('platform', 'forwarded_origin')),
  carrier text,
  forwarding_verified_at timestamptz,
  last_synthetic_check_at timestamptz
);

create table business_profile (
  account_id uuid primary key references accounts(id) on delete cascade,
  greeting_name text not null default 'the scheduling assistant',
  voice_preset text not null default 'default',
  hours jsonb not null default '{}',
  emergency_policy jsonb not null default '{}',
  service_area jsonb not null default '{"zips": [], "radius_miles": 15}',
  price_sheet jsonb not null default '{}',
  sms_templates jsonb not null default '{}',
  digest_time text not null default '07:00'
);

create table job_types (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references accounts(id) on delete cascade,
  name text not null,
  duration_min int not null,
  buffer_min int not null default 30,
  active boolean not null default true
);

create table customers (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references accounts(id) on delete cascade,
  name text,
  phone_e164 text not null,
  sms_opt_out boolean not null default false,
  created_at timestamptz not null default now(),
  unique (account_id, phone_e164)
);

create table addresses (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references customers(id) on delete cascade,
  line1 text not null,
  line2 text,
  city text not null,
  state text not null,
  zip text not null,
  access_notes text,
  lat double precision,
  lng double precision
);

create table calls (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references accounts(id) on delete cascade,
  customer_id uuid references customers(id) on delete set null,
  direction text not null check (direction in ('inbound', 'outbound')),
  from_e164 text not null,
  started_at timestamptz not null default now(),
  duration_s int not null default 0,
  intent text,
  triage_class triage_class,
  outcome call_outcome,
  summary text,
  transcript_url text,
  audio_url text,
  latency_p95_ms int,
  hang_up_within_10s boolean not null default false
);

create table bookings (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references accounts(id) on delete cascade,
  customer_id uuid not null references customers(id) on delete cascade,
  address_id uuid not null references addresses(id),
  job_type_id uuid not null references job_types(id),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status booking_status not null default 'held',
  source booking_source not null,
  est_value_cents int,
  gcal_event_id text,
  held_at timestamptz not null default now()
);
-- NFR-3: atomic hold/confirm — one active (held|confirmed) booking per slot start.
create unique index bookings_active_slot_idx on bookings (account_id, job_type_id, starts_at)
  where status in ('held', 'confirmed');

create table sms_messages (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references accounts(id) on delete cascade,
  customer_id uuid not null references customers(id) on delete cascade,
  direction text not null check (direction in ('outbound', 'inbound')),
  kind sms_kind not null,
  body text not null,
  status sms_status not null default 'queued',
  sent_at timestamptz
);

create table escalations (
  id uuid primary key default gen_random_uuid(),
  call_id uuid not null references calls(id) on delete cascade,
  chain_step int not null,
  method escalation_method not null,
  result text not null,
  occurred_at timestamptz not null default now()
);

create table events_analytics (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references accounts(id) on delete cascade,
  name text not null,
  properties jsonb not null default '{}',
  occurred_at timestamptz not null default now()
);

create table audit_log (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references accounts(id) on delete cascade,
  actor audit_actor not null,
  action text not null,
  detail jsonb not null default '{}',
  occurred_at timestamptz not null default now()
);

-- RLS: every table scoped to the owner's account via accounts.owner_auth_id.
alter table accounts enable row level security;
alter table phone_numbers enable row level security;
alter table business_profile enable row level security;
alter table job_types enable row level security;
alter table customers enable row level security;
alter table addresses enable row level security;
alter table calls enable row level security;
alter table bookings enable row level security;
alter table sms_messages enable row level security;
alter table escalations enable row level security;
alter table events_analytics enable row level security;
alter table audit_log enable row level security;

create policy accounts_owner on accounts
  for all using (owner_auth_id = auth.uid()) with check (owner_auth_id = auth.uid());

-- ponytail: one policy-per-table macro would save typing, but Postgres has no
-- policy templates — repetition here is the shortest correct path, not sloppiness.
create policy phone_numbers_owner on phone_numbers
  for all using (account_id in (select id from accounts where owner_auth_id = auth.uid()));
create policy business_profile_owner on business_profile
  for all using (account_id in (select id from accounts where owner_auth_id = auth.uid()));
create policy job_types_owner on job_types
  for all using (account_id in (select id from accounts where owner_auth_id = auth.uid()));
create policy customers_owner on customers
  for all using (account_id in (select id from accounts where owner_auth_id = auth.uid()));
create policy addresses_owner on addresses
  for all using (customer_id in (
    select c.id from customers c join accounts a on a.id = c.account_id where a.owner_auth_id = auth.uid()
  ));
create policy calls_owner on calls
  for all using (account_id in (select id from accounts where owner_auth_id = auth.uid()));
create policy bookings_owner on bookings
  for all using (account_id in (select id from accounts where owner_auth_id = auth.uid()));
create policy sms_messages_owner on sms_messages
  for all using (account_id in (select id from accounts where owner_auth_id = auth.uid()));
create policy escalations_owner on escalations
  for all using (call_id in (
    select c.id from calls c join accounts a on a.id = c.account_id where a.owner_auth_id = auth.uid()
  ));
create policy events_analytics_owner on events_analytics
  for all using (account_id in (select id from accounts where owner_auth_id = auth.uid()));
create policy audit_log_owner on audit_log
  for all using (account_id in (select id from accounts where owner_auth_id = auth.uid()));

-- Service-role (voice pipeline, webhooks) bypasses RLS by default via the
-- service_role key — no separate policy needed; keep that key server-side only.
