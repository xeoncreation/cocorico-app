create table if not exists public.user_subscriptions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text,
  plan text default 'free',
  status text,
  current_period_end timestamptz,
  updated_at timestamptz default now()
);

alter table public.user_subscriptions enable row level security;

create policy "subs_self"
on public.user_subscriptions for all
using (auth.uid() = user_id) with check (auth.uid() = user_id);
