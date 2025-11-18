create table if not exists learn_modules (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text,
  level text,
  duration_minutes int,
  video_url text,
  created_at timestamptz default now()
);

create table if not exists module_progress (
  user_id uuid references auth.users(id) on delete cascade,
  module_id uuid references learn_modules(id) on delete cascade,
  status text default 'in_progress' check (status in ('in_progress','completed')),
  completed_at timestamptz,
  primary key (user_id, module_id)
);
