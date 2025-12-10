-- =====================================================
-- SCRIPT DE INSTALACIÓN COMPLETA DEL SISTEMA FREEMIUM
-- Ejecutar en Supabase Dashboard > SQL Editor
-- =====================================================

-- 1. Crear tipo enum para niveles de plan (con manejo de existencia)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'plan_tier') THEN
    CREATE TYPE public.plan_tier AS ENUM ('free', 'premium');
  END IF;
END $$;

-- 2. Tabla user_plans: almacena el plan actual de cada usuario
CREATE TABLE IF NOT EXISTS public.user_plans (
  user_id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  tier public.plan_tier NOT NULL DEFAULT 'free',
  started_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 3. Tabla feature_usage: contador de usos por usuario/función/período
CREATE TABLE IF NOT EXISTS public.feature_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  feature_key text NOT NULL,
  period_start_date date NOT NULL,
  used_count int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT unique_user_feature_period UNIQUE (user_id, feature_key, period_start_date)
);

-- 4. Habilitar RLS
ALTER TABLE public.user_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_usage ENABLE ROW LEVEL SECURITY;

-- 5. Políticas RLS para user_plans
DROP POLICY IF EXISTS "Users can read own plan" ON public.user_plans;
CREATE POLICY "Users can read own plan"
  ON public.user_plans
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own plan" ON public.user_plans;
CREATE POLICY "Users can update own plan"
  ON public.user_plans
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own plan" ON public.user_plans;
CREATE POLICY "Users can insert own plan"
  ON public.user_plans
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 6. Políticas RLS para feature_usage
DROP POLICY IF EXISTS "Users can read own feature usage" ON public.feature_usage;
CREATE POLICY "Users can read own feature usage"
  ON public.feature_usage
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own feature usage" ON public.feature_usage;
CREATE POLICY "Users can insert own feature usage"
  ON public.feature_usage
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own feature usage" ON public.feature_usage;
CREATE POLICY "Users can update own feature usage"
  ON public.feature_usage
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 7. Índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_user_plans_user_id ON public.user_plans (user_id);
CREATE INDEX IF NOT EXISTS idx_feature_usage_user_feature_period 
  ON public.feature_usage (user_id, feature_key, period_start_date);

-- 8. Función para actualizar automáticamente updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 9. Triggers para auto-actualizar updated_at
DROP TRIGGER IF EXISTS update_user_plans_updated_at ON public.user_plans;
CREATE TRIGGER update_user_plans_updated_at
  BEFORE UPDATE ON public.user_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_feature_usage_updated_at ON public.feature_usage;
CREATE TRIGGER update_feature_usage_updated_at
  BEFORE UPDATE ON public.feature_usage
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 10. Función helper para obtener el plan de un usuario
CREATE OR REPLACE FUNCTION public.get_user_tier(p_user_id uuid)
RETURNS public.plan_tier AS $$
DECLARE
  v_tier public.plan_tier;
BEGIN
  SELECT tier INTO v_tier
  FROM public.user_plans
  WHERE user_id = p_user_id;
  
  RETURN COALESCE(v_tier, 'free'::public.plan_tier);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- SCRIPT COMPLETADO EXITOSAMENTE
-- =====================================================

-- Verificar que todo se creó correctamente:
SELECT 'Tablas creadas:' AS status;
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('user_plans', 'feature_usage');

SELECT 'Políticas RLS activas:' AS status;
SELECT tablename, policyname FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('user_plans', 'feature_usage');
