-- Community feature SQL schema (apply via Supabase SQL editor or CLI)
-- Tables: community_posts, community_follows
-- Assumes existing table user_profiles with column user_id referencing auth.users

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

-- Basic Row Level Security (enable and simple policies)
alter table public.community_posts enable row level security;
alter table public.community_follows enable row level security;

-- Policies: read all posts, insert own, update likes (any authenticated) - simplify
create policy if not exists "Community posts read" on public.community_posts for select using ( true );
create policy if not exists "Community posts insert" on public.community_posts for insert with check ( auth.uid() = user_id );
create policy if not exists "Community posts like update" on public.community_posts for update using ( true );

create policy if not exists "Community follows read" on public.community_follows for select using ( true );
create policy if not exists "Community follows insert" on public.community_follows for insert with check ( auth.uid() = follower );
create policy if not exists "Community follows delete" on public.community_follows for delete using ( auth.uid() = follower );

-- Optional RPC increment_post_likes (if desired instead of direct update)
-- create or replace function public.increment_post_likes(p_post uuid) returns integer as $$
-- declare v_likes integer; begin
--   update public.community_posts set likes = likes + 1 where id = p_post returning likes into v_likes; return v_likes; end; $$ language plpgsql security definer;
