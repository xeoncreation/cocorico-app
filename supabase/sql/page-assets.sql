-- Page assets mapping for free/premium visuals
-- Run in Supabase SQL Editor

create table if not exists public.page_assets (
  id uuid primary key default gen_random_uuid(),
  page text not null,
  asset_free text,
  asset_premium text,
  updated_at timestamptz default now()
);

alter table public.page_assets enable row level security;
create policy if not exists "public read page assets" on public.page_assets for select using (true);
