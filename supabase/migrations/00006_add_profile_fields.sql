-- 00006_add_profile_fields.sql
-- Garantiza existencia de profiles + RLS + policies + columnas

-- 1) Crear tabla 'profiles' si no existe
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username   text unique,
  avatar_url text,
  banner_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2) Habilitar RLS
alter table public.profiles enable row level security;

-- 3) Policies idempotentes
drop policy if exists profiles_read_own   on public.profiles;
drop policy if exists profiles_update_own on public.profiles;
drop policy if exists profiles_insert_self on public.profiles;

create policy profiles_read_own
on public.profiles
for select
to authenticated
using (auth.uid() = id);

create policy profiles_update_own
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

-- (Opcional) permitir INSERT si no usas trigger en signup:
create policy profiles_insert_self
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

-- 4) Asegurar columnas (idempotente)
alter table public.profiles
  add column if not exists username   text,
  add column if not exists avatar_url text,
  add column if not exists banner_url text;

-- 5) Índice útil (idempotente)
create index if not exists idx_profiles_username
on public.profiles using btree (lower(username));

-- 6) (Si este archivo también tocaba recipes, mantenlo aquí abajo)
-- Ejemplo conservado:
alter table public.recipes
  add column if not exists description text;