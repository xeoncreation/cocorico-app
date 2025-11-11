-- Consolidate legacy page_assets rows to simplified schema
-- Safe to run in Supabase SQL Editor

begin;

-- 1) Ensure required columns exist (asset_free/asset_premium)
alter table public.page_assets
  add column if not exists asset_free text,
  add column if not exists asset_premium text,
  add column if not exists created_at timestamptz default now(),
  add column if not exists updated_at timestamptz default now();

-- 2) Populate asset_free / asset_premium from legacy rows (url + is_premium)
with agg as (
  select 
    page,
    max(case when not coalesce(is_premium, false) then url end) as asset_free,
    max(case when coalesce(is_premium, false) then url end)      as asset_premium
  from public.page_assets
  group by page
)
update public.page_assets p
set asset_free   = coalesce(a.asset_free, p.asset_free),
    asset_premium= coalesce(a.asset_premium, p.asset_premium),
    updated_at   = now()
from agg a
where p.page = a.page;

-- 3) Deduplicate: keep a single row per page, prefer a FREE row if exists
with ranked as (
  select 
    id,
    page,
    row_number() over (
      partition by page 
      order by 
        case when coalesce(is_premium, false) then 1 else 0 end, -- free first
        created_at nulls first,
        id
    ) as rn
  from public.page_assets
)
delete from public.page_assets p
using ranked r
where p.id = r.id
  and r.rn > 1;

-- 4) Drop legacy columns no longer needed
alter table public.page_assets
  drop column if exists element,
  drop column if exists variant,
  drop column if exists url,
  drop column if exists is_premium;

-- 5) Add UNIQUE constraint on page (via index to avoid duplicates error)
create unique index if not exists page_assets_unique_page_idx
  on public.page_assets(page);

-- Attach the index to a constraint if not already
do $$
begin
  if not exists (
    select 1 from pg_constraint 
    where conrelid = 'public.page_assets'::regclass
      and conname = 'unique_page'
  ) then
    alter table public.page_assets
      add constraint unique_page unique using index page_assets_unique_page_idx;
  end if;
end $$;

-- 6) Enable RLS and ensure read policy exists
alter table public.page_assets enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies 
    where schemaname = 'public' 
      and tablename  = 'page_assets' 
      and policyname = 'public read page assets'
  ) then
    execute 'create policy "public read page assets" on public.page_assets for select using (true)';
  end if;
end $$;

commit;

-- Verify result
-- select * from public.page_assets;
-- select conname, contype from pg_constraint where conrelid = 'public.page_assets'::regclass;
