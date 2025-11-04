-- ============================================
-- BLOQUE 36: Sistema de insignias y gamificación
-- ============================================

-- Tabla de badges
CREATE TABLE IF NOT EXISTS public.user_badges (
  id bigserial PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_code text NOT NULL,
  badge_name text,
  description text,
  icon_url text,
  earned_at timestamptz DEFAULT now()
);

-- Índice para evitar duplicados
CREATE UNIQUE INDEX IF NOT EXISTS user_badges_unique ON user_badges(user_id, badge_code);

-- Habilitar RLS
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

-- Política: usuarios ven solo sus badges
CREATE POLICY "badges_self"
ON public.user_badges FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- ============================================
-- Función: Asignar badge (evita duplicados)
-- ============================================

CREATE OR REPLACE FUNCTION public.assign_badge(p_user uuid, p_code text)
RETURNS void
LANGUAGE plpgsql AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM user_badges WHERE user_id = p_user AND badge_code = p_code
  ) THEN
    INSERT INTO user_badges (user_id, badge_code, badge_name, description, icon_url)
    VALUES (
      p_user,
      p_code,
      CASE p_code
        WHEN 'first_recipe' THEN 'Primera receta'
        WHEN 'chef_10' THEN 'Cocinero Nivel 10'
        WHEN 'ai_explorer' THEN 'Explorador IA'
        WHEN 'social_star' THEN 'Estrella Social'
        WHEN 'premium' THEN 'Usuario Premium'
        ELSE 'Logro especial'
      END,
      CASE p_code
        WHEN 'first_recipe' THEN 'Has publicado tu primera receta.'
        WHEN 'chef_10' THEN 'Has alcanzado el nivel 10.'
        WHEN 'ai_explorer' THEN 'Has usado el chat IA 50 veces.'
        WHEN 'social_star' THEN 'Tus recetas han sido vistas 100 veces.'
        WHEN 'premium' THEN 'Usuario Premium activo.'
        ELSE 'Has desbloqueado un logro oculto.'
      END,
      CASE p_code
        WHEN 'first_recipe' THEN 'https://cdn-icons-png.flaticon.com/512/1046/1046857.png'
        WHEN 'chef_10' THEN 'https://cdn-icons-png.flaticon.com/512/3075/3075977.png'
        WHEN 'ai_explorer' THEN 'https://cdn-icons-png.flaticon.com/512/4712/4712039.png'
        WHEN 'social_star' THEN 'https://cdn-icons-png.flaticon.com/512/1998/1998087.png'
        WHEN 'premium' THEN 'https://cdn-icons-png.flaticon.com/512/744/744986.png'
        ELSE 'https://cdn-icons-png.flaticon.com/512/4712/4712103.png'
      END
    );
  END IF;
END;
$$;

-- ============================================
-- Verificación rápida
-- ============================================
-- SELECT assign_badge(auth.uid(), 'first_recipe');
-- SELECT * FROM user_badges WHERE user_id = auth.uid();
