-- =====================================================
-- SCRIPTS DE PRUEBA Y UTILIDADES - SISTEMA FREEMIUM
-- =====================================================

-- ═══════════════════════════════════════════════════
-- 1. CONVERTIR USUARIO A PREMIUM
-- ═══════════════════════════════════════════════════

-- Reemplaza 'TU-UUID-AQUI' con el UUID real del usuario
-- Obtener tu UUID: SELECT auth.uid();

INSERT INTO public.user_plans (user_id, tier)
VALUES ('TU-UUID-AQUI', 'premium')
ON CONFLICT (user_id) 
DO UPDATE SET 
  tier = 'premium',
  updated_at = now();

-- ═══════════════════════════════════════════════════
-- 2. VOLVER USUARIO A FREE
-- ═══════════════════════════════════════════════════

UPDATE public.user_plans
SET tier = 'free', updated_at = now()
WHERE user_id = 'TU-UUID-AQUI';

-- ═══════════════════════════════════════════════════
-- 3. VER MI PLAN ACTUAL
-- ═══════════════════════════════════════════════════

SELECT 
  up.user_id,
  u.email,
  up.tier,
  up.started_at,
  up.updated_at
FROM public.user_plans up
JOIN auth.users u ON u.id = up.user_id
WHERE up.user_id = auth.uid();

-- Si no aparece nada, significa que eres FREE por defecto

-- ═══════════════════════════════════════════════════
-- 4. VER MIS USOS DE ESTA SEMANA
-- ═══════════════════════════════════════════════════

SELECT 
  feature_key,
  used_count,
  period_start_date,
  created_at,
  updated_at
FROM public.feature_usage
WHERE user_id = auth.uid()
  AND period_start_date >= date_trunc('week', CURRENT_DATE)
ORDER BY feature_key;

-- ═══════════════════════════════════════════════════
-- 5. RESETEAR TODOS MIS CONTADORES (NUEVA SEMANA)
-- ═══════════════════════════════════════════════════

DELETE FROM public.feature_usage
WHERE user_id = auth.uid();

-- ═══════════════════════════════════════════════════
-- 6. SIMULAR QUE ALCANCÉ EL LÍMITE DE CHAT
-- ═══════════════════════════════════════════════════

-- Establece el contador de ai_chat a 20 (límite)
INSERT INTO public.feature_usage (user_id, feature_key, period_start_date, used_count)
VALUES (
  auth.uid(), 
  'ai_chat', 
  date_trunc('week', CURRENT_DATE)::date,
  20
)
ON CONFLICT (user_id, feature_key, period_start_date) 
DO UPDATE SET used_count = 20;

-- ═══════════════════════════════════════════════════
-- 7. VER TODOS LOS USUARIOS Y SUS PLANES
-- (Solo para admins)
-- ═══════════════════════════════════════════════════

SELECT 
  u.id,
  u.email,
  COALESCE(up.tier, 'free') as plan,
  up.started_at as plan_start,
  COUNT(fu.id) as total_features_used
FROM auth.users u
LEFT JOIN public.user_plans up ON up.user_id = u.id
LEFT JOIN public.feature_usage fu ON fu.user_id = u.id 
  AND fu.period_start_date >= date_trunc('week', CURRENT_DATE)
GROUP BY u.id, u.email, up.tier, up.started_at
ORDER BY u.created_at DESC
LIMIT 50;

-- ═══════════════════════════════════════════════════
-- 8. VER ESTADÍSTICAS DE USO POR FUNCIÓN
-- (Solo para admins)
-- ═══════════════════════════════════════════════════

SELECT 
  feature_key,
  COUNT(DISTINCT user_id) as users_using,
  SUM(used_count) as total_uses,
  AVG(used_count) as avg_uses_per_user,
  MAX(used_count) as max_uses
FROM public.feature_usage
WHERE period_start_date >= date_trunc('week', CURRENT_DATE)
GROUP BY feature_key
ORDER BY total_uses DESC;

-- ═══════════════════════════════════════════════════
-- 9. LIMPIAR DATOS ANTIGUOS (>30 días)
-- ═══════════════════════════════════════════════════

-- Ver cuántos registros se eliminarían
SELECT COUNT(*) 
FROM public.feature_usage
WHERE period_start_date < CURRENT_DATE - INTERVAL '30 days';

-- Eliminar registros antiguos
DELETE FROM public.feature_usage
WHERE period_start_date < CURRENT_DATE - INTERVAL '30 days';

-- ═══════════════════════════════════════════════════
-- 10. OBTENER MI UUID ACTUAL
-- ═══════════════════════════════════════════════════

SELECT 
  auth.uid() as my_user_id,
  auth.email() as my_email;

-- ═══════════════════════════════════════════════════
-- 11. VER CUÁNDO SE RENUEVAN MIS LÍMITES
-- ═══════════════════════════════════════════════════

SELECT 
  feature_key,
  used_count,
  period_start_date as week_start,
  (period_start_date + INTERVAL '7 days')::date as week_end,
  (period_start_date + INTERVAL '7 days')::date - CURRENT_DATE as days_until_renewal
FROM public.feature_usage
WHERE user_id = auth.uid()
  AND period_start_date >= date_trunc('week', CURRENT_DATE)
ORDER BY feature_key;

-- ═══════════════════════════════════════════════════
-- 12. DEBUGGING: Ver toda la configuración de RLS
-- ═══════════════════════════════════════════════════

SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('user_plans', 'feature_usage')
ORDER BY tablename, policyname;
