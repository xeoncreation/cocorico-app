-- ============================================
-- BLOQUE 35: Perfil de usuario completo
-- ============================================

-- Tabla de perfil de usuario
CREATE TABLE IF NOT EXISTS public.user_profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE,
  avatar_url text,
  bio text,
  language text DEFAULT 'es',
  country text,
  experience int DEFAULT 0,
  level int DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Política: usuarios gestionan su propio perfil
CREATE POLICY "users manage own profile"
ON public.user_profiles FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- ============================================
-- Trigger: Crear perfil automáticamente al registrarse
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, username)
  VALUES (new.id, split_part(new.email, '@', 1))
  ON CONFLICT (user_id) DO NOTHING;
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_profile();

-- ============================================
-- Función: Añadir experiencia y actualizar nivel
-- ============================================

CREATE OR REPLACE FUNCTION public.add_xp(p_user uuid, p_amount int)
RETURNS void
LANGUAGE plpgsql AS $$
BEGIN
  UPDATE user_profiles
  SET experience = experience + p_amount,
      level = 1 + floor((experience + p_amount) / 100),
      updated_at = now()
  WHERE user_id = p_user;
END;
$$;

-- ============================================
-- Verificación rápida
-- ============================================
-- SELECT * FROM user_profiles WHERE user_id = auth.uid();
-- SELECT add_xp(auth.uid(), 10);
