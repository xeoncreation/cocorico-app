-- Tabla de invitaciones privadas para beta cerrada
create table if not exists public.beta_invites (
  id bigserial primary key,
  email text not null,
  token uuid not null default gen_random_uuid(),
  used boolean default false,
  created_at timestamptz default now(),
  used_at timestamptz,
  invited_by uuid references auth.users(id),
  notes text
);

-- Índice en token para búsquedas rápidas
create index if not exists idx_beta_invites_token on public.beta_invites(token);

-- RLS: solo admins pueden ver, crear o borrar invitaciones
alter table public.beta_invites enable row level security;

create policy "admins manage invites"
on public.beta_invites
for all
using (
  exists (
    select 1 from user_roles
    where user_id = auth.uid() and role = 'admin'
  )
);

-- Comentarios para documentación
comment on table public.beta_invites is 'Invitaciones privadas para beta cerrada. Solo admins pueden gestionar.';
comment on column public.beta_invites.token is 'Token único para enlace de invitación /invite/{token}';
comment on column public.beta_invites.used is 'Marca si el token ya fue canjeado por un usuario';
