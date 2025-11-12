alter table public.profiles 
-- Asegura que la tabla 'profiles' exista en cualquier entorno (shadow DB incluida)
create table if not exists public.profiles (
	id uuid primary key references auth.users(id) on delete cascade,
	username text unique,
	avatar_url text,
	banner_url text,
	created_at timestamptz default now(),
	updated_at timestamptz default now()
);

-- Políticas/RLS seguras e idempotentes
alter table public.profiles enable row level security;

-- Permitir que el usuario autenticado lea/edite su propio perfil
drop policy if exists profiles_read_own on public.profiles;
drop policy if exists profiles_update_own on public.profiles;
drop policy if exists profiles_insert_self on public.profiles;

create policy profiles_read_own
on public.profiles for select
to authenticated
using (auth.uid() = id);

create policy profiles_update_own
on public.profiles for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

-- Si permites insert manual (opcional); si los insert los hace un trigger de signup, puedes omitirlo
create policy profiles_insert_self
on public.profiles for insert
to authenticated
with check (auth.uid() = id);

-- Ahora sí, añade/asegura las columnas (idempotente)
alter table public.profiles
	add column if not exists username   text,
	add column if not exists avatar_url text,
	add column if not exists banner_url text;

-- (Opcional) índices útiles
create index if not exists idx_profiles_username on public.profiles using btree (lower(username));

-- Add description field to recipes
-- Fixed syntax for recipes as well
alter table public.recipes
add column if not exists description text;