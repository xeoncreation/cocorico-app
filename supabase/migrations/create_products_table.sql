do $$
begin
-- BLOQUE 1: Tabla products para caché de escáner
-- (Deshabilitado temporalmente para evitar errores de migración en desarrollo)
-- create table if not exists public.products (
--   barcode text primary key,
--   name text,
--   brand text,
--   image text,
--   nutri_score text,
--   nova_group int,
--   cocorico_score int,
--   raw_off jsonb,
--   created_at timestamptz default now()
-- );

-- alter table public.products enable row level security;

-- do $$
-- begin
--   if not exists (
--     select 1 from pg_policies
--     where schemaname = 'public'
--       and tablename = 'products'
--       and policyname = 'Allow read products'
--   ) then
--     create policy "Allow read products"
--       on public.products
--       for select
--       using (true);
--   end if;

--   if not exists (
--     select 1 from pg_policies
--       where schemaname = 'public'
--       and tablename = 'products'
--       and policyname = 'Allow insert/update products (service)'
--   ) then
--     create policy "Allow insert/update products (service)"
--       on public.products
--       for all
--       using (true)
--       with check (true);
--   end if;
-- end
-- $$;
