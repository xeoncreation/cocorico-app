-- Preferencias/Perfil de IA por usuario
create table if not exists public.ai_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  diet text default 'omnivore',
  allergies text[] default '{}',
  dislikes text[] default '{}',
  goals text[] default '{}',
  calories_target int,
  language text default 'es',
  updated_at timestamptz default now()
);

-- Conversaciones (hilos) por usuario
create table if not exists public.ai_threads (
  id bigserial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text,
  created_at timestamptz default now()
);

-- Mensajes de IA (memoria corta)
create table if not exists public.ai_messages (
  id bigserial primary key,
  thread_id bigint not null references public.ai_threads(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text check (role in ('user','assistant')) not null,
  content text not null,
  created_at timestamptz default now()
);

-- Cuota diaria de uso de IA (free tier)
create table if not exists public.usage_quota (
  user_id uuid primary key references auth.users(id) on delete cascade,
  daily_calls int not null default 0,
  reset_at timestamptz not null default (now()::date + interval '1 day')
);

-- RLS
alter table public.ai_profiles enable row level security;
alter table public.ai_threads  enable row level security;
alter table public.ai_messages enable row level security;
alter table public.usage_quota enable row level security;

-- Policies (cada uno ve/edita lo suyo)
create policy "ai_profiles_self"
on public.ai_profiles for all
using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "ai_threads_self"
on public.ai_threads for all
using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "ai_messages_self"
on public.ai_messages for all
using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "usage_quota_self"
on public.usage_quota for all
using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- RPC para incrementar uso
create or replace function public.increment_ai_usage(p_user_id uuid)
returns void
language plpgsql
as $$
begin
  insert into usage_quota (user_id, daily_calls, reset_at)
  values (p_user_id, 1, now()::date + interval '1 day')
  on conflict (user_id)
  do update set daily_calls = usage_quota.daily_calls + 1;
end;
$$;