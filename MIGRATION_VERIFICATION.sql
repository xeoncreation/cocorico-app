-- MIGRATION_VERIFICATION.sql
-- Script para verificar estado final de profiles, recipes, y otras tablas tras migraciones

-- 1) Verificar tabla profiles existe y tiene columnas correctas
SELECT table_name, column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'profiles'
ORDER BY ordinal_position;

-- 2) Verificar RLS habilitado en profiles
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public' AND tablename = 'profiles';

-- 3) Verificar policies en profiles
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'profiles';

-- 4) Verificar índice en profiles.username
SELECT indexname, indexdef
FROM pg_indexes
WHERE schemaname = 'public' AND tablename = 'profiles' AND indexname LIKE '%username%';

-- 5) Verificar recipes.id es uuid y RLS está habilitado
SELECT table_name, column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'recipes' AND column_name = 'id';

SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public' AND tablename = 'recipes';

-- 6) Verificar favorites.recipe_id es uuid
SELECT table_name, column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'favorites' AND column_name = 'recipe_id';

-- 7) Verificar posts.recipe_id es uuid
SELECT table_name, column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'posts' AND column_name = 'recipe_id';

-- 8) Verificar recipe_versions.base_recipe_id es uuid
SELECT table_name, column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'recipe_versions' AND column_name = 'base_recipe_id';

-- 9) Verificar todas las migraciones aplicadas
SELECT version, name
FROM supabase_migrations.schema_migrations
ORDER BY version;

-- 10) Contar tablas en schema public
SELECT count(*)
FROM information_schema.tables
WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
