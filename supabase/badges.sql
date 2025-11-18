create table if not exists badges (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null,
  description text,
  icon text,
  created_at timestamptz default now()
);

create table if not exists user_badges (
  user_id uuid references auth.users(id) on delete cascade,
  badge_id uuid references badges(id) on delete cascade,
  status text default 'unlocked' check (status in ('unlocked')),
  earned_at timestamptz default now(),
  primary key (user_id, badge_id)
);

insert into badges (code, name, description, icon) values
 ('first_3_recipes','Primeras 3 recetas','Has creado 3 recetas en Cocorico.','🥄'),
 ('2_hours_cooking','2 horas de cocina','Has cocinado más de 2 horas acumuladas.','⏱️')
on conflict (code) do nothing;
