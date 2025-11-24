
CREATE TABLE user_roles (
  user_id UNIQUEIDENTIFIER PRIMARY KEY,
  role NVARCHAR(20) DEFAULT 'user',
  created_at DATETIME2 DEFAULT GETDATE()
);

-- (No equivalente en SQL Server)

-- (No equivalente en SQL Server)

-- (No equivalente en SQL Server)


-- (No equivalente en SQL Server)
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
