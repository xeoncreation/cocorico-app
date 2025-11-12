-- Fixed syntax: remove IF NOT EXISTS at ALTER level; keep it on each column
alter table public.profiles 
add column if not exists username text,
add column if not exists avatar_url text,
add column if not exists banner_url text;

-- Add description field to recipes
-- Fixed syntax for recipes as well
alter table public.recipes
add column if not exists description text;