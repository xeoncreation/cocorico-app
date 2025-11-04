-- Create messages table
create table if not exists public.messages (
  id bigserial primary key,
  user_id uuid references auth.users(id) on delete set null,
  role text check (role in ('user','assistant')) not null,
  content text not null,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.messages enable row level security;

-- Select policy: users can only see their own messages
create policy "messages_select_own"
on public.messages for select
using (auth.uid() = user_id);

-- Insert policy: users can only insert their own messages
create policy "messages_insert_own"
on public.messages for insert
with check (auth.uid() = user_id);