-- Cocorico Combined Migration
-- Apply this via Supabase SQL Editor
-- Includes: community_posts, community_follows, community_comments, badges, user_badges, learn_modules, module_progress

-- ============================================
-- COMMUNITY POSTS & FOLLOWS
-- ============================================
create table if not exists public.community_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  content text not null,
  image_url text,
  likes integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_community_posts_created_at on public.community_posts (created_at desc);
create index if not exists idx_community_posts_user_id on public.community_posts (user_id);

create table if not exists public.community_follows (
  follower uuid not null references auth.users on delete cascade,
  following uuid not null references auth.users on delete cascade,
  created_at timestamptz not null default now(),
  primary key (follower, following)
);

create index if not exists idx_community_follows_follower on public.community_follows (follower);
create index if not exists idx_community_follows_following on public.community_follows (following);

alter table public.community_posts enable row level security;
alter table public.community_follows enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='community_posts' and policyname='Community posts read') then
    create policy "Community posts read" on public.community_posts for select using ( true );
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='community_posts' and policyname='Community posts insert') then
    create policy "Community posts insert" on public.community_posts for insert with check ( auth.uid() = user_id );
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='community_posts' and policyname='Community posts like update') then
    create policy "Community posts like update" on public.community_posts for update using ( true );
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='community_follows' and policyname='Community follows read') then
    create policy "Community follows read" on public.community_follows for select using ( true );
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='community_follows' and policyname='Community follows insert') then
    create policy "Community follows insert" on public.community_follows for insert with check ( auth.uid() = follower );
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='community_follows' and policyname='Community follows delete') then
    create policy "Community follows delete" on public.community_follows for delete using ( auth.uid() = follower );
  end if;
end $$;

-- ============================================
-- COMMUNITY COMMENTS
-- ============================================
create table if not exists public.community_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.community_posts on delete cascade,
  user_id uuid not null references auth.users on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_community_comments_post_id on public.community_comments (post_id, created_at);

alter table public.community_comments enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='community_comments' and policyname='Community comments read') then
    create policy "Community comments read" on public.community_comments for select using ( true );
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='community_comments' and policyname='Community comments insert') then
    create policy "Community comments insert" on public.community_comments for insert with check ( auth.uid() = user_id );
  end if;
end $$;

-- ============================================
-- BADGES & USER_BADGES
-- ============================================
create table if not exists public.badges (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null,
  description text,
  icon text,
  created_at timestamptz default now()
);

create table if not exists public.user_badges (
  user_id uuid references auth.users(id) on delete cascade,
  badge_id uuid references public.badges(id) on delete cascade,
  status text default 'unlocked' check (status in ('unlocked')),
  earned_at timestamptz default now(),
  primary key (user_id, badge_id)
);

alter table public.badges enable row level security;
alter table public.user_badges enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='badges' and policyname='Badges read all') then
    create policy "Badges read all" on public.badges for select using ( true );
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='user_badges' and policyname='User badges read own') then
    create policy "User badges read own" on public.user_badges for select using ( auth.uid() = user_id );
  end if;
end $$;

insert into public.badges (code, name, description, icon) values
 ('first_3_recipes','Primeras 3 recetas','Has creado 3 recetas en Cocorico.','🥄'),
 ('2_hours_cooking','2 horas de cocina','Has cocinado más de 2 horas acumuladas.','⏱️')
on conflict (code) do nothing;

-- ============================================
-- LEARN MODULES & MODULE PROGRESS
-- ============================================
create table if not exists public.learn_modules (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text,
  level text,
  duration_minutes int,
  video_url text,
  created_at timestamptz default now()
);

create table if not exists public.module_progress (
  user_id uuid references auth.users(id) on delete cascade,
  module_id uuid references public.learn_modules(id) on delete cascade,
  status text default 'in_progress' check (status in ('in_progress','completed')),
  completed_at timestamptz,
  primary key (user_id, module_id)
);

alter table public.learn_modules enable row level security;
alter table public.module_progress enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='learn_modules' and policyname='Learn modules read all') then
    create policy "Learn modules read all" on public.learn_modules for select using ( true );
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='module_progress' and policyname='Module progress read own') then
    create policy "Module progress read own" on public.module_progress for select using ( auth.uid() = user_id );
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='module_progress' and policyname='Module progress insert own') then
    create policy "Module progress insert own" on public.module_progress for insert with check ( auth.uid() = user_id );
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='module_progress' and policyname='Module progress update own') then
    create policy "Module progress update own" on public.module_progress for update using ( auth.uid() = user_id );
  end if;
end $$;

-- ============================================
-- USER_PROFILES EXTENSIONS (goal, diet)
-- ============================================
-- Add goal and diet columns if they don't exist
do $$ begin
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='user_profiles' and column_name='goal') then
    alter table public.user_profiles add column goal text;
  end if;
end $$;

do $$ begin
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='user_profiles' and column_name='diet') then
    alter table public.user_profiles add column diet text;
  end if;
end $$;

-- Add onboarded_at if missing
do $$ begin
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='user_profiles' and column_name='onboarded_at') then
    alter table public.user_profiles add column onboarded_at timestamptz;
  end if;
end $$;

-- Add xp and level for gamification if missing
do $$ begin
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='user_profiles' and column_name='xp') then
    alter table public.user_profiles add column xp int default 0;
  end if;
end $$;

do $$ begin
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='user_profiles' and column_name='level') then
    alter table public.user_profiles add column level int default 1;
  end if;
end $$;

-- Migration complete

-- ============================================
-- RECIPES FULL-TEXT SEARCH SUPPORT (optional but recommended)
-- ============================================
do $$ begin
  if exists (select 1 from information_schema.tables where table_schema='public' and table_name='recipes') then
    -- Add search_vector column if missing
    if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='recipes' and column_name='search_vector') then
      alter table public.recipes add column search_vector tsvector;
    end if;
    -- Initialize search_vector using Spanish config over title + description
    update public.recipes set search_vector = to_tsvector('spanish', coalesce(title,'') || ' ' || coalesce(description,'')) where search_vector is null;
    -- Create GIN index if missing
    create index if not exists recipes_search_vector_idx on public.recipes using gin (search_vector);
    -- Create or replace trigger function
    create or replace function public.recipes_search_vector_update() returns trigger as $$
    begin
      new.search_vector := to_tsvector('spanish', coalesce(new.title,'') || ' ' || coalesce(new.description,''));
      return new;
    end
    $$ language plpgsql;
    -- Attach trigger
    drop trigger if exists recipes_search_vector_trigger on public.recipes;
    create trigger recipes_search_vector_trigger before insert or update of title, description on public.recipes
    for each row execute function public.recipes_search_vector_update();
  end if;
end $$;

-- ============================================
-- EXTENSIONS FOR LEARN MODULES (additional fields)
-- ============================================
do $$ begin
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='learn_modules' and column_name='category') then
    alter table public.learn_modules add column category text;
  end if;
end $$;

do $$ begin
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='learn_modules' and column_name='cover_image_url') then
    alter table public.learn_modules add column cover_image_url text;
  end if;
end $$;

-- Seed demo modules if not present
insert into public.learn_modules (slug, title, category, description, level, duration_minutes)
select * from (values
  ('knife-basics','Cuchillos: fundamentos','basics','Tipos de cuchillos y cómo usarlos', 'beginner', 12),
  ('saute-technique','Salteado perfecto','techniques','Control de temperatura y movimiento', 'intermediate', 15),
  ('food-safety-101','Seguridad alimentaria','safety','Manipulación y conservación segura', 'beginner', 10)
) as v(slug,title,category,description,level,duration_minutes)
where not exists (select 1 from public.learn_modules m where m.slug = v.slug);

-- ============================================
-- COOKING SESSIONS (for stats)
-- ============================================
create table if not exists public.cooking_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  recipe_id uuid references public.recipes(id) on delete set null,
  minutes int,
  cooked_at timestamptz default now()
);

alter table public.cooking_sessions enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='cooking_sessions' and policyname='cooking_sessions_own') then
    create policy cooking_sessions_own on public.cooking_sessions for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
  end if;
end $$;

-- ============================================
-- FEEDBACK TICKETS
-- ============================================
create table if not exists public.feedback_tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  category text not null,
  title text not null,
  message text not null,
  status text not null default 'open' check (status in ('open','in_progress','resolved')),
  votes int default 0,
  screenshot_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.feedback_tickets enable row level security;

do $$ begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='feedback_tickets' and policyname='feedback_read_all') then
    create policy feedback_read_all on public.feedback_tickets for select using (true);
  end if;
end $$;

do $$ begin
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='feedback_tickets' and policyname='feedback_insert_own') then
    create policy feedback_insert_own on public.feedback_tickets for insert to authenticated with check (auth.uid() = user_id);
  end if;
end $$;

-- ============================================
-- COMMUNITY V2 fields (extend existing posts)
-- ============================================
do $$ begin
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='community_posts' and column_name='type') then
    alter table public.community_posts add column type text;
  end if;
end $$;

do $$ begin
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='community_posts' and column_name='title') then
    alter table public.community_posts add column title text;
  end if;
end $$;

do $$ begin
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='community_posts' and column_name='body') then
    alter table public.community_posts add column body text;
  end if;
end $$;

do $$ begin
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='community_posts' and column_name='image_url') then
    alter table public.community_posts add column image_url text;
  end if;
end $$;

do $$ begin
  if not exists (select 1 from information_schema.columns where table_schema='public' and table_name='community_posts' and column_name='likes_count') then
    alter table public.community_posts add column likes_count int default 0;
  end if;
end $$;

create table if not exists public.community_reports (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references public.community_posts(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  reason text,
  created_at timestamptz default now()
);

alter table public.community_reports enable row level security;

-- ============================================
-- STORAGE: avatars bucket policies (if bucket exists)
-- ============================================
-- Reset and create avatar policies (Postgres lacks IF NOT EXISTS for policy; dropping avoids errors)
drop policy if exists "public read avatars" on storage.objects;
create policy "public read avatars" on storage.objects for select to anon, authenticated using (bucket_id = 'avatars');

drop policy if exists "authenticated write avatars" on storage.objects;
create policy "authenticated write avatars" on storage.objects for insert to authenticated with check (bucket_id = 'avatars');

drop policy if exists "authenticated update avatars" on storage.objects;
create policy "authenticated update avatars" on storage.objects for update to authenticated using (bucket_id = 'avatars') with check (bucket_id = 'avatars');
