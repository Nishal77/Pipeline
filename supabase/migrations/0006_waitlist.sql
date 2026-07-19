-- Landing page waitlist (GTM asset, §21). No owner_auth_id — these are
-- pre-signup leads, not accounts yet. Public insert only (anon key), no read.
create table waitlist_signups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone_e164 text not null,
  created_at timestamptz not null default now()
);

alter table waitlist_signups enable row level security;
create policy waitlist_signups_insert_only on waitlist_signups
  for insert with check (true);
