-- Block 53: Gamification + AI Rewards (levels, XP, achievements, daily challenges)
-- Created: November 4, 2025

-- Tabla de progreso del usuario
create table if not exists public.user_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  xp integer default 0,
  level integer default 1,
  streak integer default 0,
  last_active timestamptz default now(),
  created_at timestamptz default now()
);

-- Tabla de logros
create table if not exists public.user_badges (
  id bigserial primary key,
  user_id uuid references auth.users(id) on delete cascade,
  badge_name text not null,
  icon_url text,
  description text,
  earned_at timestamptz default now()
);

-- Tabla de retos diarios
create table if not exists public.daily_challenges (
  id bigserial primary key,
  title text not null,
  description text,
  difficulty text default 'normal',
  reward_xp integer default 50,
  active_date date default current_date,
  created_at timestamptz default now()
);

-- Relación: retos completados
create table if not exists public.user_challenges (
  id bigserial primary key,
  user_id uuid references auth.users(id) on delete cascade,
  challenge_id bigint references public.daily_challenges(id),
  completed boolean default false,
  completed_at timestamptz
);

-- Función automática para subir nivel
create or replace function public.increment_xp(user_uuid uuid, gained_xp integer)
returns void
language plpgsql
as $$
declare
  new_xp integer;
  new_level integer;
begin
  update user_progress
  set xp = xp + gained_xp,
      last_active = now(),
      streak = case when last_active::date = current_date - interval '1 day' then streak + 1 else 1 end
  where user_id = user_uuid
  returning xp into new_xp;

  new_level := floor(new_xp / 500) + 1; -- 500 XP por nivel

  update user_progress set level = new_level where user_id = user_uuid;
end;
$$;

-- Enable RLS
alter table public.user_progress enable row level security;
alter table public.user_badges enable row level security;
alter table public.daily_challenges enable row level security;
alter table public.user_challenges enable row level security;

-- RLS policies for user_progress
create policy "Users can view own progress"
  on public.user_progress for select
  using (auth.uid() = user_id);

create policy "Users can update own progress"
  on public.user_progress for update
  using (auth.uid() = user_id);

create policy "Users can insert own progress"
  on public.user_progress for insert
  with check (auth.uid() = user_id);

-- RLS policies for user_badges
create policy "Users can view own badges"
  on public.user_badges for select
  using (auth.uid() = user_id);

create policy "System can insert badges"
  on public.user_badges for insert
  with check (true);

-- RLS policies for daily_challenges
create policy "Anyone can view challenges"
  on public.daily_challenges for select
  using (true);

create policy "System can insert challenges"
  on public.daily_challenges for insert
  with check (true);

-- RLS policies for user_challenges
create policy "Users can view own challenges"
  on public.user_challenges for select
  using (auth.uid() = user_id);

create policy "Users can insert own challenges"
  on public.user_challenges for insert
  with check (auth.uid() = user_id);

create policy "Users can update own challenges"
  on public.user_challenges for update
  using (auth.uid() = user_id);
