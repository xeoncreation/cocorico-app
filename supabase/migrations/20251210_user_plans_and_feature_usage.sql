-- =====================================================
-- MIGRATION: Sistema de planes de usuario y límites de uso
-- DATE: 2025-12-10
-- DESCRIPTION: Implementa sistema freemium con control de usos
-- =====================================================

-- 1. Crear tipo enum para niveles de plan
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'plan_tier') THEN
    CREATE TYPE public.plan_tier AS ENUM ('free', 'premium');
  END IF;
END $$;

-- 2. Tabla user_plans: almacena el plan actual de cada usuario
create table if not exists public.user_plans (
  user_id uuid primary key references auth.users (id) on delete cascade,
  tier public.plan_tier not null default 'free',
  started_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Habilitar RLS en user_plans
alter table public.user_plans enable row level security;

-- Políticas RLS para user_plans
create policy "Users can read own plan"
  on public.user_plans
  for select
  using (auth.uid() = user_id);

create policy "Users can update own plan"
  on public.user_plans
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can insert own plan"
  on public.user_plans
  for insert
  with check (auth.uid() = user_id);

-- 3. Tabla feature_usage: contador de usos por usuario/función/período
create table if not exists public.feature_usage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  feature_key text not null, -- ej: 'ai_chat', 'barcode_scanner', 'food_detector'
  period_start_date date not null, -- inicio de la semana (formato YYYY-MM-DD)
  used_count int not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint unique_user_feature_period unique (user_id, feature_key, period_start_date)
);

-- Habilitar RLS en feature_usage
alter table public.feature_usage enable row level security;

-- Políticas RLS para feature_usage
create policy "Users can read own feature usage"
  on public.feature_usage
  for select
  using (auth.uid() = user_id);

create policy "Users can insert own feature usage"
  on public.feature_usage
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update own feature usage"
  on public.feature_usage
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 4. Índices para optimizar consultas
create index if not exists idx_user_plans_user_id on public.user_plans (user_id);
create index if not exists idx_feature_usage_user_feature_period 
  on public.feature_usage (user_id, feature_key, period_start_date);

-- 5. Función para actualizar automáticamente updated_at
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- 6. Triggers para auto-actualizar updated_at
drop trigger if exists update_user_plans_updated_at on public.user_plans;
create trigger update_user_plans_updated_at
  before update on public.user_plans
  for each row
  execute function public.update_updated_at_column();

drop trigger if exists update_feature_usage_updated_at on public.feature_usage;
create trigger update_feature_usage_updated_at
  before update on public.feature_usage
  for each row
  execute function public.update_updated_at_column();

-- 7. Función helper para obtener el plan de un usuario (con fallback a free)
create or replace function public.get_user_tier(p_user_id uuid)
returns public.plan_tier as $$
declare
  v_tier public.plan_tier;
begin
  select tier into v_tier
  from public.user_plans
  where user_id = p_user_id;
  
  return coalesce(v_tier, 'free'::public.plan_tier);
end;
$$ language plpgsql security definer;

-- NOTA: Para convertir un usuario a premium, ejecutar:
-- INSERT INTO public.user_plans (user_id, tier) 
-- VALUES ('user-uuid-here', 'premium')
-- ON CONFLICT (user_id) DO UPDATE SET tier = 'premium';

-- NOTA: Los límites de uso se gestionan desde el código (src/config/featureLimits.ts)
-- Esta migración solo crea la estructura de datos para almacenar contadores.
