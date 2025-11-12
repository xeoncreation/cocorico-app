-- 00009_create_user_roles.sql
-- Tabla de roles de usuario para gestión de permisos (admin, moderator, user)

-- 1) Crear tabla user_roles
create table if not exists public.user_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'user' check (role in ('admin', 'moderator', 'user')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2) Habilitar RLS
alter table public.user_roles enable row level security;

-- 3) Políticas idempotentes
drop policy if exists user_roles_select_own on public.user_roles;
drop policy if exists user_roles_update_admin on public.user_roles;
drop policy if exists user_roles_insert_admin on public.user_roles;

-- Los usuarios pueden ver su propio rol
create policy user_roles_select_own on public.user_roles
  for select using (auth.uid() = user_id);

-- Solo admins pueden modificar roles (requiere función auxiliar o JWT claim)
-- Nota: estas políticas asumen que ya tienes un admin inicial o usas JWT claims
-- Si necesitas crear el primer admin manualmente, usa SQL directo o desactiva RLS temporalmente

-- Índice para búsquedas por rol
create index if not exists idx_user_roles_role on public.user_roles using btree (role);

-- Comentarios para documentación
comment on table public.user_roles is 'Roles de usuario: admin, moderator, user. Controla permisos en el sistema.';
comment on column public.user_roles.role is 'Rol del usuario: admin (gestión total), moderator (moderación de contenido), user (acceso estándar)';
