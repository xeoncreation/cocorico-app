-- ============================================
-- STORAGE POLICIES - SUPABASE
-- Configuración manual requerida en Dashboard
-- ============================================

-- IMPORTANTE: Este archivo documenta las políticas de Storage.
-- Las políticas de Storage deben configurarse manualmente desde:
-- Supabase Dashboard > Storage > [Bucket Name] > Policies

-- ============================================
-- BUCKET: avatars
-- ============================================
-- Descripción: Avatares de usuarios
-- Visibilidad: Público (lectura), Privado (escritura)

-- Policy 1: Public read access
-- Permite lectura pública de avatares
CREATE POLICY "avatars_public_read"
ON storage.objects
FOR SELECT
USING (bucket_id = 'avatars');

-- Policy 2: Authenticated users can upload their own avatar
-- Usuarios autenticados pueden subir su propio avatar
CREATE POLICY "avatars_auth_upload"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 3: Users can update their own avatar
-- Usuarios pueden actualizar su propio avatar
CREATE POLICY "avatars_auth_update"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 4: Users can delete their own avatar
-- Usuarios pueden eliminar su propio avatar
CREATE POLICY "avatars_auth_delete"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- ============================================
-- BUCKET: recipes
-- ============================================
-- Descripción: Imágenes de recetas
-- Visibilidad: Público (lectura), Privado (escritura)

-- Policy 1: Public read access for recipe images
-- Lectura pública de imágenes de recetas
CREATE POLICY "recipes_public_read"
ON storage.objects
FOR SELECT
USING (bucket_id = 'recipes');

-- Policy 2: Authenticated users can upload recipe images
-- Usuarios autenticados pueden subir imágenes de recetas
CREATE POLICY "recipes_auth_upload"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'recipes'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 3: Users can update their own recipe images
-- Usuarios pueden actualizar sus propias imágenes
CREATE POLICY "recipes_auth_update"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'recipes'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 4: Users can delete their own recipe images
-- Usuarios pueden eliminar sus propias imágenes
CREATE POLICY "recipes_auth_delete"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'recipes'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- ============================================
-- BUCKET: private-uploads (si existe)
-- ============================================
-- Descripción: Archivos privados de usuarios
-- Visibilidad: Privado (solo dueño)

-- Policy 1: Users can read their own private files
CREATE POLICY "private_uploads_read_own"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'private-uploads'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 2: Users can upload to their own folder
CREATE POLICY "private_uploads_insert_own"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'private-uploads'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 3: Users can update their own files
CREATE POLICY "private_uploads_update_own"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'private-uploads'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 4: Users can delete their own files
CREATE POLICY "private_uploads_delete_own"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'private-uploads'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- ============================================
-- INSTRUCCIONES DE APLICACIÓN
-- ============================================

-- 1. Ve a Supabase Dashboard > Storage
-- 2. Crea los buckets si no existen:
--    - avatars (público)
--    - recipes (público)
--    - private-uploads (privado)
--
-- 3. Para cada bucket, ve a Policies y aplica las políticas correspondientes
--
-- 4. Configuración de buckets:
--    - avatars: Public = true, File size limit = 2MB
--    - recipes: Public = true, File size limit = 5MB
--    - private-uploads: Public = false, File size limit = 10MB
--
-- 5. MIME types permitidos (recomendado):
--    - Imágenes: image/jpeg, image/png, image/webp, image/gif
--    - Documentos: application/pdf (si es necesario)

-- ============================================
-- ESTRUCTURA DE CARPETAS RECOMENDADA
-- ============================================

-- avatars/
--   ├── {user_id}/
--   │   └── avatar.jpg

-- recipes/
--   ├── {user_id}/
--   │   ├── {recipe_id}_1.jpg
--   │   └── {recipe_id}_2.jpg

-- private-uploads/
--   ├── {user_id}/
--   │   └── {filename}

-- Esta estructura garantiza que:
-- 1. Cada usuario solo puede modificar sus propios archivos
-- 2. Los archivos están organizados por usuario
-- 3. Es fácil hacer limpieza de archivos huérfanos
