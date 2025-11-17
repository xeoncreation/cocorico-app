-- ================================================================
-- MANUAL: Asignar plan premium a tu usuario para testing
-- ================================================================
-- 
-- INSTRUCCIONES:
-- 1. Abre Supabase Dashboard: https://supabase.com/dashboard
-- 2. Ve a tu proyecto > SQL Editor
-- 3. Copia y pega este script
-- 4. REEMPLAZA 'tu-email@ejemplo.com' con tu email real
-- 5. Ejecuta el script
-- 
-- Nota: Esto es solo para testing. En producción usarás Stripe webhooks.
-- ================================================================

-- Opción 1: Actualizar por email
UPDATE profiles 
SET plan = 'premium'
WHERE id = (
  SELECT id 
  FROM auth.users 
  WHERE email = 'tu-email@ejemplo.com'  -- 👈 CAMBIA ESTO
  LIMIT 1
);

-- Opción 2: Actualizar TODOS los usuarios a premium (útil para testing local)
-- DESCOMENTAR SOLO SI QUIERES QUE TODOS SEAN PREMIUM:
-- UPDATE profiles SET plan = 'premium';

-- Verificar el cambio:
SELECT 
  p.id,
  u.email,
  p.plan,
  p.created_at
FROM profiles p
JOIN auth.users u ON u.id = p.id
ORDER BY p.created_at DESC
LIMIT 5;
