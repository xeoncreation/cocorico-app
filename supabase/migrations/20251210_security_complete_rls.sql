-- ============================================
-- MIGRACIÓN DE SEGURIDAD COMPLETA - COCORICO
-- Fecha: 2025-12-10
-- Descripción: Asegura RLS en todas las tablas y crea user_profiles
-- ============================================

-- ============================================
-- 1. CREAR/ACTUALIZAR user_profiles (si no existe)
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  emoji TEXT DEFAULT '👤',
  language TEXT DEFAULT 'es',
  country TEXT,
  experience INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para rendimiento
CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON public.user_profiles(username);
CREATE INDEX IF NOT EXISTS idx_user_profiles_level ON public.user_profiles(level);

-- Habilitar RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Policies: Lectura pública (para perfiles públicos), escritura solo del dueño
DROP POLICY IF EXISTS "user_profiles_read_all" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles_update_own" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles_insert_self" ON public.user_profiles;

CREATE POLICY "user_profiles_read_all"
  ON public.user_profiles
  FOR SELECT
  USING (true);

CREATE POLICY "user_profiles_update_own"
  ON public.user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_profiles_insert_self"
  ON public.user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 2. TRIGGER AUTOMÁTICO AL REGISTRAR USUARIO
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, username, full_name, language)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    COALESCE(new.raw_user_meta_data->>'language', 'es')
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_profile ON auth.users;
CREATE TRIGGER on_auth_user_created_profile
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_profile();

-- ============================================
-- 3. ASEGURAR RLS EN TABLAS EXISTENTES
-- ============================================

-- recipes: Ya tiene RLS pero reforzamos policies
ALTER TABLE IF EXISTS public.recipes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "recipes_read_public" ON public.recipes;
DROP POLICY IF EXISTS "recipes_read_own" ON public.recipes;
DROP POLICY IF EXISTS "recipes_crud_own" ON public.recipes;

-- Lectura: públicas visibles para todos, privadas solo dueño
CREATE POLICY "recipes_read_public"
  ON public.recipes
  FOR SELECT
  USING (visibility = 'public' OR auth.uid() = user_id);

-- CRUD completo: solo el dueño
CREATE POLICY "recipes_crud_own"
  ON public.recipes
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- favorites: Solo el usuario ve sus favoritos
ALTER TABLE IF EXISTS public.favorites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "favorites_crud_own" ON public.favorites;
CREATE POLICY "favorites_crud_own"
  ON public.favorites
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- shopping_lists: Solo el usuario ve sus listas
ALTER TABLE IF EXISTS public.shopping_lists ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "shopping_lists_crud_own" ON public.shopping_lists;
CREATE POLICY "shopping_lists_crud_own"
  ON public.shopping_lists
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- messages (chat AI): Solo el usuario ve su historial
ALTER TABLE IF EXISTS public.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "messages_crud_own" ON public.messages;
CREATE POLICY "messages_crud_own"
  ON public.messages
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ai_threads y ai_messages: Solo el usuario ve sus conversaciones
ALTER TABLE IF EXISTS public.ai_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.ai_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ai_threads_crud_own" ON public.ai_threads;
DROP POLICY IF EXISTS "ai_messages_crud_own" ON public.ai_messages;

CREATE POLICY "ai_threads_crud_own"
  ON public.ai_threads
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "ai_messages_crud_own"
  ON public.ai_messages
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ai_profiles: Solo el usuario ve su perfil AI
ALTER TABLE IF EXISTS public.ai_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ai_profiles_crud_own" ON public.ai_profiles;
CREATE POLICY "ai_profiles_crud_own"
  ON public.ai_profiles
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- user_subscriptions: Solo el usuario ve su suscripción
ALTER TABLE IF EXISTS public.user_subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "user_subscriptions_read_own" ON public.user_subscriptions;
CREATE POLICY "user_subscriptions_read_own"
  ON public.user_subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- user_roles: Solo el usuario ve su rol
ALTER TABLE IF EXISTS public.user_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "user_roles_read_own" ON public.user_roles;
CREATE POLICY "user_roles_read_own"
  ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- cooking_sessions: Solo el usuario ve sus sesiones
ALTER TABLE IF EXISTS public.cooking_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "cooking_sessions_crud_own" ON public.cooking_sessions;
CREATE POLICY "cooking_sessions_crud_own"
  ON public.cooking_sessions
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- recipe_versions: Solo el usuario ve versiones de sus recetas
ALTER TABLE IF EXISTS public.recipe_versions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "recipe_versions_crud_own" ON public.recipe_versions;
CREATE POLICY "recipe_versions_crud_own"
  ON public.recipe_versions
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 4. STORAGE BUCKETS POLICIES (Ejecutar en Dashboard)
-- ============================================
-- NOTA: Storage policies deben configurarse desde Supabase Dashboard > Storage
-- Configuración recomendada:
-- 
-- Bucket: avatars (público en lectura)
-- - SELECT: true
-- - INSERT: auth.uid() = owner
-- - UPDATE: auth.uid() = owner
-- - DELETE: auth.uid() = owner
--
-- Bucket: recipes (público en lectura para recetas públicas)
-- - SELECT: true
-- - INSERT: authenticated
-- - UPDATE/DELETE: auth.uid() = owner

-- ============================================
-- 5. COMENTARIOS Y DOCUMENTACIÓN
-- ============================================
COMMENT ON TABLE public.user_profiles IS 'Perfiles de usuarios con datos públicos y privados. RLS habilitado.';
COMMENT ON COLUMN public.user_profiles.emoji IS 'Emoji personalizado del usuario como avatar';
COMMENT ON FUNCTION public.handle_new_user_profile() IS 'Trigger que crea automáticamente user_profile al registrarse';
