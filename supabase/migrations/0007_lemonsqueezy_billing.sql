-- Swap billing provider Stripe -> Lemon Squeezy (no US entity/Stripe invite
-- yet; LS is merchant-of-record, no entity required to go live).
alter table accounts rename column stripe_customer_id to ls_customer_id;
alter table accounts add column ls_subscription_id text;
