-- ============================================
-- SECURITY PATCH: Community Tables RLS
-- Fecha: 2026-03-09
-- Prioridad: CRÍTICA
-- Descripción: Habilitar RLS en tablas comunitarias
-- ============================================

-- ============================================
-- 1. COMMUNITY_POSTS
-- ============================================
ALTER TABLE IF EXISTS public.community_posts ENABLE ROW LEVEL SECURITY;

-- Eliminar policies existentes si las hay
DROP POLICY IF EXISTS "community_posts_read" ON public.community_posts;
DROP POLICY IF EXISTS "community_posts_write" ON public.community_posts;
DROP POLICY IF EXISTS "community_posts_delete" ON public.community_posts;

-- Lectura: Posts públicos visibles para todos, privados solo para el dueño
CREATE POLICY "community_posts_read"
  ON public.community_posts
  FOR SELECT
  USING (
    visibility = 'public' 
    OR auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM user_follows
      WHERE follower_id = auth.uid()
      AND followed_id = community_posts.user_id
    )
  );

-- Inserción: Solo usuarios autenticados pueden crear sus propios posts
CREATE POLICY "community_posts_insert"
  ON public.community_posts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Actualización: Solo el dueño puede actualizar
CREATE POLICY "community_posts_update"
  ON public.community_posts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Eliminación: Solo el dueño puede eliminar
CREATE POLICY "community_posts_delete"
  ON public.community_posts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================
-- 2. POST_LIKES
-- ============================================
ALTER TABLE IF EXISTS public.post_likes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "post_likes_read" ON public.post_likes;
DROP POLICY IF EXISTS "post_likes_write" ON public.post_likes;

-- Lectura: Solo pueden ver likes de posts que pueden ver
CREATE POLICY "post_likes_read"
  ON public.post_likes
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM community_posts
      WHERE id = post_likes.post_id
      AND (
        visibility = 'public' 
        OR user_id = auth.uid()
      )
    )
  );

-- Escritura: Solo pueden dar/quitar like a posts que pueden ver
CREATE POLICY "post_likes_insert"
  ON public.post_likes
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM community_posts
      WHERE id = post_id
      AND (visibility = 'public' OR user_id = auth.uid())
    )
  );

CREATE POLICY "post_likes_delete"
  ON public.post_likes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================
-- 3. POST_COMMENTS
-- ============================================
ALTER TABLE IF EXISTS public.post_comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "post_comments_read" ON public.post_comments;
DROP POLICY IF EXISTS "post_comments_write" ON public.post_comments;

-- Lectura: Ver comentarios de posts que pueden ver
CREATE POLICY "post_comments_read"
  ON public.post_comments
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM community_posts
      WHERE id = post_comments.post_id
      AND (
        visibility = 'public' 
        OR user_id = auth.uid()
      )
    )
  );

-- Inserción: Comentar en posts que pueden ver
CREATE POLICY "post_comments_insert"
  ON public.post_comments
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM community_posts
      WHERE id = post_id
      AND (visibility = 'public' OR user_id = auth.uid())
    )
  );

-- Actualización: Solo sus propios comentarios
CREATE POLICY "post_comments_update"
  ON public.post_comments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Eliminación: Solo sus propios comentarios
CREATE POLICY "post_comments_delete"
  ON public.post_comments
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================
-- 4. USER_FOLLOWS
-- ============================================
ALTER TABLE IF EXISTS public.user_follows ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "user_follows_read" ON public.user_follows;
DROP POLICY IF EXISTS "user_follows_write" ON public.user_follows;

-- Lectura: Ver quien sigues y quien te sigue
CREATE POLICY "user_follows_read"
  ON public.user_follows
  FOR SELECT
  USING (
    auth.uid() = follower_id 
    OR auth.uid() = followed_id
  );

-- Inserción: Solo puedes seguir tú mismo (follower debe ser auth.uid)
CREATE POLICY "user_follows_insert"
  ON public.user_follows
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = follower_id
    AND follower_id != followed_id -- No seguirse a sí mismo
  );

-- Eliminación: Solo puedes dejar de seguir tú mismo
CREATE POLICY "user_follows_delete"
  ON public.user_follows
  FOR DELETE
  TO authenticated
  USING (auth.uid() = follower_id);

-- ============================================
-- 5. VERIFICACIÓN
-- ============================================

-- Query para verificar que RLS está habilitado
DO $$
DECLARE
    table_name text;
    rls_enabled boolean;
BEGIN
    FOR table_name IN 
        SELECT unnest(ARRAY['community_posts', 'post_likes', 'post_comments', 'user_follows'])
    LOOP
        SELECT relrowsecurity INTO rls_enabled
        FROM pg_class
        WHERE relname = table_name;
        
        IF rls_enabled THEN
            RAISE NOTICE '✅ RLS habilitado en %', table_name;
        ELSE
            RAISE WARNING '❌ RLS NO habilitado en %', table_name;
        END IF;
    END LOOP;
END $$;

-- ============================================
-- 6. COMENTARIOS
-- ============================================
COMMENT ON POLICY "community_posts_read" ON public.community_posts IS 
  'Permite leer posts públicos, propios, o de usuarios seguidos';

COMMENT ON POLICY "post_likes_read" ON public.post_likes IS 
  'Permite ver likes solo de posts que el usuario puede ver';

COMMENT ON POLICY "post_comments_read" ON public.post_comments IS 
  'Permite ver comentarios solo de posts que el usuario puede ver';

COMMENT ON POLICY "user_follows_read" ON public.user_follows IS 
  'Permite ver relaciones de seguimiento que involucran al usuario';
