-- Block 54: Community Social (posts, likes, comments, follows)
-- Created: November 5, 2025

-- Publicaciones
create table if not exists public.posts (
  id bigserial primary key,
  user_id uuid references auth.users(id) on delete cascade,
  image_url text,
  description text,
  created_at timestamptz default now()
);

-- Likes
create table if not exists public.post_likes (
  id bigserial primary key,
  post_id bigint references public.posts(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  created_at timestamptz default now(),
  unique (post_id, user_id)
);

-- Comentarios
create table if not exists public.post_comments (
  id bigserial primary key,
  post_id bigint references public.posts(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  comment text not null,
  created_at timestamptz default now()
);

-- Seguidores
create table if not exists public.user_follows (
  id bigserial primary key,
  follower_id uuid references auth.users(id) on delete cascade,
  following_id uuid references auth.users(id) on delete cascade,
  created_at timestamptz default now(),
  unique (follower_id, following_id)
);

-- Enable RLS
alter table public.posts enable row level security;
alter table public.post_likes enable row level security;
alter table public.post_comments enable row level security;
alter table public.user_follows enable row level security;

-- RLS policies for posts
create policy "Anyone can view posts"
  on public.posts for select
  using (true);

create policy "Users can create own posts"
  on public.posts for insert
  with check (auth.uid() = user_id);

create policy "Users can update own posts"
  on public.posts for update
  using (auth.uid() = user_id);

create policy "Users can delete own posts"
  on public.posts for delete
  using (auth.uid() = user_id);

-- RLS policies for post_likes
create policy "Anyone can view likes"
  on public.post_likes for select
  using (true);

create policy "Users can like posts"
  on public.post_likes for insert
  with check (auth.uid() = user_id);

create policy "Users can remove own likes"
  on public.post_likes for delete
  using (auth.uid() = user_id);

-- RLS policies for post_comments
create policy "Anyone can view comments"
  on public.post_comments for select
  using (true);

create policy "Users can create comments"
  on public.post_comments for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own comments"
  on public.post_comments for delete
  using (auth.uid() = user_id);

-- RLS policies for user_follows
create policy "Anyone can view follows"
  on public.user_follows for select
  using (true);

create policy "Users can follow others"
  on public.user_follows for insert
  with check (auth.uid() = follower_id);

create policy "Users can unfollow others"
  on public.user_follows for delete
  using (auth.uid() = follower_id);

-- Admin audit policy (applies to all tables)
create policy "admins audit posts"
  on public.posts for select
  using (exists (select 1 from user_roles where user_id = auth.uid() and role = 'admin'));

create policy "admins audit likes"
  on public.post_likes for select
  using (exists (select 1 from user_roles where user_id = auth.uid() and role = 'admin'));

create policy "admins audit comments"
  on public.post_comments for select
  using (exists (select 1 from user_roles where user_id = auth.uid() and role = 'admin'));

create policy "admins audit follows"
  on public.user_follows for select
  using (exists (select 1 from user_roles where user_id = auth.uid() and role = 'admin'));
