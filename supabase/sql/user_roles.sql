-- ============================================
-- BLOQUE 37: Panel de administración
-- ============================================

-- Tabla de roles de usuario
CREATE TABLE IF NOT EXISTS public.user_roles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role text DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Política: usuarios pueden ver su propio rol
CREATE POLICY "users can see own role"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

-- Política: solo admins pueden gestionar roles
CREATE POLICY "admins can update roles"
ON public.user_roles FOR ALL
USING (EXISTS (
  SELECT 1 FROM user_roles 
  WHERE user_id = auth.uid() AND role = 'admin'
));

-- ============================================
-- Trigger: Asignar rol 'user' por defecto al registrarse
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'user')
  ON CONFLICT (user_id) DO NOTHING;
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_role ON auth.users;
CREATE TRIGGER on_auth_user_created_role
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();

-- ============================================
-- Función: Obtener crecimiento de usuarios por día
-- ============================================

CREATE OR REPLACE FUNCTION public.get_user_growth()
RETURNS TABLE(day date, count bigint)
LANGUAGE sql
AS $$
  SELECT date_trunc('day', created_at)::date AS day, count(*)::bigint
  FROM auth.users
  GROUP BY 1
  ORDER BY 1;
$$;

-- ============================================
-- Verificación rápida
-- ============================================
-- SELECT * FROM user_roles WHERE user_id = auth.uid();
-- Para hacerte admin: UPDATE user_roles SET role = 'admin' WHERE user_id = 'tu-uuid';
-- SELECT * FROM get_user_growth();
