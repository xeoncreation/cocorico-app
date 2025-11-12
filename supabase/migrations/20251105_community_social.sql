-- Block 54: Community Social (user_follows + admin audit policies)
-- Created: November 5, 2025
-- Note: posts, post_likes, post_comments already created in 20241104_community_chat_subscriptions.sql

-- Seguidores (nuevo, no existe en migración anterior)
create table if not exists public.user_follows (
  id bigserial primary key,
  follower_id uuid references auth.users(id) on delete cascade,
  following_id uuid references auth.users(id) on delete cascade,
  created_at timestamptz default now(),
  unique (follower_id, following_id)
);

-- Enable RLS on user_follows
alter table public.user_follows enable row level security;

-- RLS policies for user_follows
drop policy if exists "Anyone can view follows" on public.user_follows;
drop policy if exists "Users can follow others" on public.user_follows;
drop policy if exists "Users can unfollow others" on public.user_follows;

create policy "Anyone can view follows"
  on public.user_follows for select
  using (true);

create policy "Users can follow others"
  on public.user_follows for insert
  with check (auth.uid() = follower_id);

create policy "Users can unfollow others"
  on public.user_follows for delete
  using (auth.uid() = follower_id);

-- Admin audit policies (idempotent, allow admins to view all content for moderation)
drop policy if exists "admins audit posts" on public.posts;
drop policy if exists "admins audit likes" on public.post_likes;
drop policy if exists "admins audit comments" on public.post_comments;
drop policy if exists "admins audit follows" on public.user_follows;

create policy "admins audit posts"
  on public.posts for select
  using (exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin'));

create policy "admins audit likes"
  on public.post_likes for select
  using (exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin'));

create policy "admins audit comments"
  on public.post_comments for select
  using (exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin'));

create policy "admins audit follows"
  on public.user_follows for select
  using (exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin'));
