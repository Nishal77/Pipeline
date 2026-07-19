-- Web Push subscriptions, one row per device the owner has installed the PWA
-- on. RLS mirrors the other owner-scoped tables.
create table push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references accounts(id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  created_at timestamptz not null default now()
);

alter table push_subscriptions enable row level security;
create policy push_subscriptions_owner on push_subscriptions
  for all using (account_id in (select id from accounts where owner_auth_id = auth.uid()));
