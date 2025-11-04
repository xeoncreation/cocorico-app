-- Add profile fields
alter table if not exists public.profiles 
add column if not exists username text,
add column if not exists avatar_url text,
add column if not exists banner_url text;

-- Add description field to recipes
alter table if not exists public.recipes
add column if not exists description text;