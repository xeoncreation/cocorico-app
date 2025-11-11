-- User profiles for plans/roles and developer control
-- Run in Supabase SQL Editor

create table if not exists public.user_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text,
  plan text not null default 'free' check (plan in ('free','premium','pro')),
  role text not null default 'user' check (role in ('user','admin')),
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists user_profiles_plan_idx on public.user_profiles (plan);
create index if not exists user_profiles_role_idx on public.user_profiles (role);

alter table public.user_profiles enable row level security;

-- Allow users to read/update only their profile
create policy if not exists "user can select own profile"
  on public.user_profiles for select using (auth.uid() = user_id);
create policy if not exists "user can update own profile"
  on public.user_profiles for update using (auth.uid() = user_id);
create policy if not exists "user can insert own profile"
  on public.user_profiles for insert with check (auth.uid() = user_id);

-- Auto-create profile on new auth user
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.user_profiles (user_id, email)
  values (new.id, new.email)
  on conflict (user_id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
