-- BLOQUE 43: Tablas de Comunidad (posts, likes, comentarios)
-- =============================================================

-- Publicaciones (posts)
create table if not exists public.posts (
  id bigserial primary key,
  user_id uuid references auth.users(id) on delete cascade,
  recipe_id uuid references public.recipes(id),
  image_url text,
  caption text,
  visibility text default 'public' check (visibility in ('public','private')),
  created_at timestamptz default now()
);

-- Likes
create table if not exists public.post_likes (
  id bigserial primary key,
  post_id bigint references posts(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  created_at timestamptz default now(),
  unique (post_id, user_id)
);

-- Comentarios
create table if not exists public.post_comments (
  id bigserial primary key,
  post_id bigint references posts(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  content text not null,
  created_at timestamptz default now()
);

-- Políticas RLS para posts
alter table posts enable row level security;
alter table post_likes enable row level security;
alter table post_comments enable row level security;

create policy "Public posts visible to all"
on posts for select using (visibility = 'public' or auth.uid() = user_id);

create policy "Users can insert own posts"
on posts for insert with check (auth.uid() = user_id);

create policy "Users can update own posts"
on posts for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users can delete own posts"
on posts for delete using (auth.uid() = user_id);

-- Políticas RLS para likes
create policy "Users can like posts"
on post_likes for all using (auth.uid() = user_id);

create policy "Anyone can view likes"
on post_likes for select using (true);

-- Políticas RLS para comentarios
create policy "Users can comment"
on post_comments for all using (auth.uid() = user_id);

create policy "Anyone can view comments on public posts"
on post_comments for select using (
  exists (
    select 1 from posts
    where posts.id = post_comments.post_id
    and (posts.visibility = 'public' or posts.user_id = auth.uid())
  )
);

-- BLOQUE 44: Chat entre usuarios
-- =============================================================

create table if not exists public.user_chats (
  id bigserial primary key,
  user_a uuid references auth.users(id) on delete cascade,
  user_b uuid references auth.users(id) on delete cascade,
  created_at timestamptz default now(),
  constraint unique_chat unique (user_a, user_b),
  constraint different_users check (user_a <> user_b)
);

create table if not exists public.chat_messages (
  id bigserial primary key,
  chat_id bigint references user_chats(id) on delete cascade,
  sender uuid references auth.users(id) on delete cascade,
  content text not null,
  read boolean default false,
  created_at timestamptz default now()
);

-- RLS para chats
alter table user_chats enable row level security;
alter table chat_messages enable row level security;

create policy "Users can see their chats"
on user_chats for select using (auth.uid() = user_a or auth.uid() = user_b);

create policy "Users can create chats"
on user_chats for insert with check (auth.uid() = user_a or auth.uid() = user_b);

create policy "Users can see messages in their chats"
on chat_messages for select using (
  exists (
    select 1 from user_chats
    where user_chats.id = chat_messages.chat_id
    and (user_chats.user_a = auth.uid() or user_chats.user_b = auth.uid())
  )
);

create policy "Users can send messages in their chats"
on chat_messages for insert with check (
  auth.uid() = sender and
  exists (
    select 1 from user_chats
    where user_chats.id = chat_messages.chat_id
    and (user_chats.user_a = auth.uid() or user_chats.user_b = auth.uid())
  )
);

-- BLOQUE 44: Suscripciones y pagos
-- =============================================================

create table if not exists public.user_subscriptions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text,
  status text check (status in ('active','trialing','past_due','canceled','incomplete','incomplete_expired','unpaid')),
  current_period_end timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table user_subscriptions enable row level security;

create policy "owner can read subscription"
on user_subscriptions for select using (auth.uid() = user_id);

create policy "owner can modify subscription"
on user_subscriptions for all using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Añadir columna plan a user_roles si existe
do $$
begin
  if exists (select 1 from information_schema.tables where table_name = 'user_roles') then
    alter table user_roles add column if not exists plan text default 'free' check (plan in ('free','premium'));
  end if;
end $$;

-- Índices para mejor rendimiento
create index if not exists idx_posts_user_id on posts(user_id);
create index if not exists idx_posts_created_at on posts(created_at desc);
create index if not exists idx_post_likes_post_id on post_likes(post_id);
create index if not exists idx_post_comments_post_id on post_comments(post_id);
create index if not exists idx_chat_messages_chat_id on chat_messages(chat_id);
create index if not exists idx_chat_messages_created_at on chat_messages(created_at);
