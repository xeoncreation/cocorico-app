-- User preferences for AI contextualization
create table if not exists public.user_preferences (
  user_id uuid references auth.users(id) on delete cascade primary key,
  dietary text, -- vegano, sin gluten, etc.
  allergies text[],
  disliked text[],
  goal text, -- bajar peso, ganar músculo, etc.
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.user_preferences enable row level security;

-- Policies: users can only see/edit their own preferences
create policy if not exists user_preferences_select_self on public.user_preferences
  for select using (auth.uid() = user_id);

create policy if not exists user_preferences_insert_self on public.user_preferences
  for insert with check (auth.uid() = user_id);

create policy if not exists user_preferences_update_self on public.user_preferences
  for update using (auth.uid() = user_id);

create policy if not exists user_preferences_delete_self on public.user_preferences
  for delete using (auth.uid() = user_id);
