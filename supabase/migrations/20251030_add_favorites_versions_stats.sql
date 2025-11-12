-- Favorites table
create table if not exists public.favorites (
  id bigserial primary key,
  user_id uuid references auth.users(id) on delete cascade,
  recipe_id uuid references public.recipes(id) on delete cascade,
  created_at timestamptz default now()
);

-- Unique favorite per user/recipe
create unique index if not exists favorites_user_recipe_unique
  on public.favorites(user_id, recipe_id);

-- Recipe versions table
create table if not exists public.recipe_versions (
  id bigserial primary key,
  base_recipe_id uuid references public.recipes(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  variant_type text,
  content jsonb,
  created_at timestamptz default now()
);

-- Stats table (simple events)
create table if not exists public.stats (
  id bigserial primary key,
  event text,
  recipe_id uuid,
  metadata jsonb,
  created_at timestamptz default now()
);

-- Row Level Security (RLS) policies
alter table public.favorites enable row level security;
alter table public.recipe_versions enable row level security;
alter table public.stats enable row level security;

-- Favorites policies: users can see their own, insert/delete their own
drop policy if exists favorites_select_self on public.favorites;
drop policy if exists favorites_insert_self on public.favorites;
drop policy if exists favorites_delete_self on public.favorites;

create policy favorites_select_self on public.favorites
  for select using (auth.uid() = user_id);
create policy favorites_insert_self on public.favorites
  for insert with check (auth.uid() = user_id);
create policy favorites_delete_self on public.favorites
  for delete using (auth.uid() = user_id);

-- Recipe versions policies: users can see/insert their own
drop policy if exists recipe_versions_select_self on public.recipe_versions;
drop policy if exists recipe_versions_insert_self on public.recipe_versions;

create policy recipe_versions_select_self on public.recipe_versions
  for select using (auth.uid() = user_id);
create policy recipe_versions_insert_self on public.recipe_versions
  for insert with check (auth.uid() = user_id);

-- Stats policies: allow insert from authenticated users (read optional)
drop policy if exists stats_insert_any on public.stats;

create policy stats_insert_any on public.stats
  for insert with check (auth.role() = 'authenticated');

-- Optional: allow admins to read stats (adjust as needed)
-- create policy stats_select_admin on public.stats for select using (auth.jwt() ->> 'role' = 'admin');
