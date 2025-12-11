-- ===========================================
-- MIGRACIÓN: Tabla recipes mejorada para importación externa
-- Fecha: 2025-12-11
-- Descripción: Estructura completa para recetas con soporte de importación desde fuentes externas
-- ===========================================

-- Enum para visibilidad de recetas
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'recipe_visibility') THEN
    CREATE TYPE public.recipe_visibility AS ENUM ('private', 'public', 'unlisted');
  END IF;
END $$;

-- Enum para origen de las recetas
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'recipe_source_type') THEN
    CREATE TYPE public.recipe_source_type AS ENUM ('user_created', 'imported', 'ai_generated');
  END IF;
END $$;

-- Tabla principal de recetas
CREATE TABLE IF NOT EXISTS public.recipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  image_url text,
  source_type public.recipe_source_type NOT NULL DEFAULT 'user_created',
  source_name text,
  source_url text,
  source_id text,
  ingredients jsonb NOT NULL DEFAULT '[]'::jsonb,
  steps jsonb NOT NULL DEFAULT '[]'::jsonb,
  servings integer,
  prep_time_minutes integer,
  cook_time_minutes integer,
  total_time_minutes integer,
  tags text[] DEFAULT '{}',
  cuisine text,
  category text,
  difficulty text CHECK (difficulty IN ('easy', 'medium', 'hard')),
  nutrition jsonb,
  visibility public.recipe_visibility NOT NULL DEFAULT 'private',
  is_verified boolean DEFAULT false,
  quality_score decimal(3,2),
  views_count integer DEFAULT 0,
  favorites_count integer DEFAULT 0,
  search_vector tsvector,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Agregar columnas si la tabla ya existía pero sin estas columnas
DO $$
BEGIN
  -- source_type
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='recipes' AND column_name='source_type') THEN
    ALTER TABLE public.recipes ADD COLUMN source_type public.recipe_source_type NOT NULL DEFAULT 'user_created';
  END IF;
  
  -- source_name
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='recipes' AND column_name='source_name') THEN
    ALTER TABLE public.recipes ADD COLUMN source_name text;
  END IF;
  
  -- source_url
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='recipes' AND column_name='source_url') THEN
    ALTER TABLE public.recipes ADD COLUMN source_url text;
  END IF;
  
  -- source_id
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='recipes' AND column_name='source_id') THEN
    ALTER TABLE public.recipes ADD COLUMN source_id text;
  END IF;
  
  -- ingredients
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='recipes' AND column_name='ingredients') THEN
    ALTER TABLE public.recipes ADD COLUMN ingredients jsonb NOT NULL DEFAULT '[]'::jsonb;
  END IF;
  
  -- steps
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='recipes' AND column_name='steps') THEN
    ALTER TABLE public.recipes ADD COLUMN steps jsonb NOT NULL DEFAULT '[]'::jsonb;
  END IF;
  
  -- tags
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='recipes' AND column_name='tags') THEN
    ALTER TABLE public.recipes ADD COLUMN tags text[] DEFAULT '{}';
  END IF;
  
  -- cuisine
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='recipes' AND column_name='cuisine') THEN
    ALTER TABLE public.recipes ADD COLUMN cuisine text;
  END IF;
  
  -- category
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='recipes' AND column_name='category') THEN
    ALTER TABLE public.recipes ADD COLUMN category text;
  END IF;
  
  -- difficulty
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='recipes' AND column_name='difficulty') THEN
    ALTER TABLE public.recipes ADD COLUMN difficulty text CHECK (difficulty IN ('easy', 'medium', 'hard'));
  END IF;
  
  -- nutrition
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='recipes' AND column_name='nutrition') THEN
    ALTER TABLE public.recipes ADD COLUMN nutrition jsonb;
  END IF;
  
  -- is_verified
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='recipes' AND column_name='is_verified') THEN
    ALTER TABLE public.recipes ADD COLUMN is_verified boolean DEFAULT false;
  END IF;
  
  -- quality_score
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='recipes' AND column_name='quality_score') THEN
    ALTER TABLE public.recipes ADD COLUMN quality_score decimal(3,2);
  END IF;
  
  -- views_count
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='recipes' AND column_name='views_count') THEN
    ALTER TABLE public.recipes ADD COLUMN views_count integer DEFAULT 0;
  END IF;
  
  -- favorites_count
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='recipes' AND column_name='favorites_count') THEN
    ALTER TABLE public.recipes ADD COLUMN favorites_count integer DEFAULT 0;
  END IF;
  
  -- search_vector
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='recipes' AND column_name='search_vector') THEN
    ALTER TABLE public.recipes ADD COLUMN search_vector tsvector;
  END IF;
  
  -- servings
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='recipes' AND column_name='servings') THEN
    ALTER TABLE public.recipes ADD COLUMN servings integer;
  END IF;
  
  -- prep_time_minutes
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='recipes' AND column_name='prep_time_minutes') THEN
    ALTER TABLE public.recipes ADD COLUMN prep_time_minutes integer;
  END IF;
  
  -- cook_time_minutes
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='recipes' AND column_name='cook_time_minutes') THEN
    ALTER TABLE public.recipes ADD COLUMN cook_time_minutes integer;
  END IF;
  
  -- total_time_minutes
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='recipes' AND column_name='total_time_minutes') THEN
    ALTER TABLE public.recipes ADD COLUMN total_time_minutes integer;
  END IF;
END $$;

-- Habilitar Row Level Security
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
DROP POLICY IF EXISTS "recipes_select_own" ON public.recipes;
CREATE POLICY "recipes_select_own"
ON public.recipes FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "recipes_select_public" ON public.recipes;
CREATE POLICY "recipes_select_public"
ON public.recipes FOR SELECT
USING (visibility = 'public' OR visibility = 'unlisted');

DROP POLICY IF EXISTS "recipes_insert_own" ON public.recipes;
CREATE POLICY "recipes_insert_own"
ON public.recipes FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "recipes_update_own" ON public.recipes;
CREATE POLICY "recipes_update_own"
ON public.recipes FOR UPDATE
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "recipes_delete_own" ON public.recipes;
CREATE POLICY "recipes_delete_own"
ON public.recipes FOR DELETE
USING (auth.uid() = user_id);

-- Función para actualizar search_vector automáticamente
CREATE OR REPLACE FUNCTION public.update_recipe_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('spanish', coalesce(NEW.title, '')), 'A') ||
    setweight(to_tsvector('spanish', coalesce(NEW.description, '')), 'B') ||
    setweight(to_tsvector('spanish', coalesce(array_to_string(NEW.tags, ' '), '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para mantener search_vector actualizado
DROP TRIGGER IF EXISTS update_recipe_search_vector_trigger ON public.recipes;
CREATE TRIGGER update_recipe_search_vector_trigger
BEFORE INSERT OR UPDATE OF title, description, tags
ON public.recipes
FOR EACH ROW
EXECUTE FUNCTION public.update_recipe_search_vector();

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION public.update_recipe_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at
DROP TRIGGER IF EXISTS update_recipe_updated_at_trigger ON public.recipes;
CREATE TRIGGER update_recipe_updated_at_trigger
BEFORE UPDATE ON public.recipes
FOR EACH ROW
EXECUTE FUNCTION public.update_recipe_updated_at();

-- Índices para rendimiento (después de triggers para asegurar que la tabla existe)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'recipes') THEN
    CREATE INDEX IF NOT EXISTS idx_recipes_user_id ON public.recipes(user_id);
    CREATE INDEX IF NOT EXISTS idx_recipes_visibility ON public.recipes(visibility);
    CREATE INDEX IF NOT EXISTS idx_recipes_source_type ON public.recipes(source_type);
    CREATE INDEX IF NOT EXISTS idx_recipes_tags ON public.recipes USING gin(tags);
    CREATE INDEX IF NOT EXISTS idx_recipes_cuisine ON public.recipes(cuisine);
    CREATE INDEX IF NOT EXISTS idx_recipes_category ON public.recipes(category);
    CREATE INDEX IF NOT EXISTS idx_recipes_difficulty ON public.recipes(difficulty);
    CREATE INDEX IF NOT EXISTS idx_recipes_is_verified ON public.recipes(is_verified);
    CREATE INDEX IF NOT EXISTS idx_recipes_created_at ON public.recipes(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_recipes_search_vector ON public.recipes USING gin(search_vector);
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_recipes_unique_source') THEN
      EXECUTE 'CREATE UNIQUE INDEX idx_recipes_unique_source ON public.recipes(source_type, source_id) WHERE source_id IS NOT NULL';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_recipes_user_title_unique') THEN
      EXECUTE 'CREATE UNIQUE INDEX idx_recipes_user_title_unique ON public.recipes(user_id, title) WHERE source_type = ''user_created''';
    END IF;
  END IF;
END $$;

-- Comentarios para documentación
COMMENT ON TABLE public.recipes IS 'Tabla principal de recetas con soporte para importación desde fuentes externas';
COMMENT ON COLUMN public.recipes.ingredients IS 'Array JSONB: [{ "name": "harina", "amount": 250, "unit": "g", "unit_normalized": "g" }]';
COMMENT ON COLUMN public.recipes.steps IS 'Array JSONB: ["Paso 1", "Paso 2", ...]';
COMMENT ON COLUMN public.recipes.nutrition IS 'Objeto JSONB: { "calories": 350, "protein": 12, "carbs": 45, "fat": 8 }';
COMMENT ON COLUMN public.recipes.source_id IS 'ID único de la receta en la fuente original (para prevenir duplicados)';
COMMENT ON COLUMN public.recipes.search_vector IS 'Vector de búsqueda full-text (actualizado automáticamente)';
