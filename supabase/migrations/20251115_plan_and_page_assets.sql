-- Migration: Add plan column to profiles and update page_assets structure
-- Created: 2025-11-15

-- 1. Add plan column to profiles (if not exists)
alter table if exists public.profiles 
add column if not exists plan text default 'free' check (plan in ('free', 'premium'));

-- 2. Add new columns to page_assets for themed content
alter table if exists public.page_assets
add column if not exists page_name text,
add column if not exists asset_free text,
add column if not exists asset_premium text;

-- 3. Create index on plan for faster queries
create index if not exists idx_profiles_plan on public.profiles(plan);

-- 4. Seed initial themed assets
insert into public.page_assets (asset_key, url, page_name, asset_free, asset_premium) values
  ('home_free', 'https://via.placeholder.com/1200x600/FF6B35/FFFFFF?text=Home+Free', 'home', 'https://via.placeholder.com/1200x600/FF6B35/FFFFFF?text=Home+Free', null),
  ('home_premium', 'https://via.placeholder.com/1200x600/2EC4B6/FFFFFF?text=Home+Premium', 'home', null, 'https://via.placeholder.com/1200x600/2EC4B6/FFFFFF?text=Home+Premium')
on conflict (asset_key) do nothing;

-- 5. Comment for documentation
comment on column public.profiles.plan is 'User subscription plan: free or premium';
comment on column public.page_assets.page_name is 'Page identifier for themed content';
comment on column public.page_assets.asset_free is 'Asset URL for free theme';
comment on column public.page_assets.asset_premium is 'Asset URL for premium theme';

