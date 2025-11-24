-- create type public.recipe_visibility as enum ('private','public');

-- create table if not exists public.recipes (
--   id uuid primary key default gen_random_uuid(),
--   user_id uuid references auth.users(id) on delete cascade,
--   title text not null,
--   content text not null,   -- JSON string con la receta estandarizada
--   visibility public.recipe_visibility not null default 'private',
--   created_at timestamptz default now(),
--   updated_at timestamptz default now()
-- );

-- create unique index if not exists recipes_user_title_unique on public.recipes(user_id, title);

-- alter table public.recipes enable row level security;


-- create policy "recipes_select_own"
-- on public.recipes for select
-- using (auth.uid() = user_id);

-- create policy "recipes_select_public"
-- on public.recipes for select
-- using (visibility = 'public');

-- create policy "recipes_insert_own"
-- on public.recipes for insert
-- with check (auth.uid() = user_id);

-- create policy "recipes_update_own"
-- on public.recipes for update
-- using (auth.uid() = user_id);

-- create policy "recipes_delete_own"
-- on public.recipes for delete
-- using (auth.uid() = user_id);