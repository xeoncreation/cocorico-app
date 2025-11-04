-- Add new columns for filtering
alter table if not exists public.recipes
add column if not exists slug text generated always as (
  regexp_replace(
    lower(title),
    '[^a-z0-9]+',
    '-',
    'g'
  )
) stored;

alter table if not exists public.recipes
add column if not exists difficulty text check (difficulty in ('fácil', 'media', 'difícil'));

alter table if not exists public.recipes
add column if not exists time integer;