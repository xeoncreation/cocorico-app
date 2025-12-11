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
  -- Identificación básica
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Información de la receta
  title text NOT NULL,
  description text,
  image_url text,
  
  -- Metadata de origen
  source_type public.recipe_source_type NOT NULL DEFAULT 'user_created',
  source_name text, -- ej: "TheMealDB", "Spoonacular", "Manual"
  source_url text,  -- URL original de la receta
  source_id text,   -- ID en la fuente original
  
  -- Contenido estructurado
  ingredients jsonb NOT NULL DEFAULT '[]'::jsonb,  -- Array de objetos { name, amount, unit, unit_normalized }
  steps jsonb NOT NULL DEFAULT '[]'::jsonb,        -- Array de strings con instrucciones
  
  -- Información cuantitativa (todas en unidades métricas normalizadas)
  servings integer,
  prep_time_minutes integer,
  cook_time_minutes integer,
  total_time_minutes integer,
  
  -- Categorización
  tags text[] DEFAULT '{}',                         -- ej: ['vegetariano', 'rápido', 'postre']
  cuisine text,                                     -- ej: 'mexicana', 'italiana'
  category text,                                    -- ej: 'desayuno', 'cena', 'postre'
  difficulty text CHECK (difficulty IN ('easy', 'medium', 'hard')),
  
  -- Información nutricional (opcional, por porción)
  nutrition jsonb,  -- { calories, protein, carbs, fat, fiber, sugar }
  
  -- Control de visibilidad
  visibility public.recipe_visibility NOT NULL DEFAULT 'private',
  
  -- Verificación y calidad
  is_verified boolean DEFAULT false,  -- Recetas verificadas por admin o fuentes confiables
  quality_score decimal(3,2),         -- 0.00 a 5.00 (rating promedio)
  
  -- Contadores de interacción
  views_count integer DEFAULT 0,
  favorites_count integer DEFAULT 0,
  
  -- Búsqueda full-text
  search_vector tsvector,
  
  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Índices para rendimiento
DO $$
BEGIN
  -- Crear índices solo si las columnas existen
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'recipes' 
    AND column_name = 'user_id'
  ) THEN
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
    
    -- Índice único para prevenir duplicados de fuentes externas
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_recipes_unique_source') THEN
      EXECUTE 'CREATE UNIQUE INDEX idx_recipes_unique_source ON public.recipes(source_type, source_id) WHERE source_id IS NOT NULL';
    END IF;
    
    -- Índice único para título por usuario (recetas propias)
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_recipes_user_title_unique') THEN
      EXECUTE 'CREATE UNIQUE INDEX idx_recipes_user_title_unique ON public.recipes(user_id, title) WHERE source_type = ''user_created''';
    END IF;
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

-- Comentarios para documentación
COMMENT ON TABLE public.recipes IS 'Tabla principal de recetas con soporte para importación desde fuentes externas';
COMMENT ON COLUMN public.recipes.ingredients IS 'Array JSONB: [{ "name": "harina", "amount": 250, "unit": "g", "unit_normalized": "g" }]';
COMMENT ON COLUMN public.recipes.steps IS 'Array JSONB: ["Paso 1", "Paso 2", ...]';
COMMENT ON COLUMN public.recipes.nutrition IS 'Objeto JSONB: { "calories": 350, "protein": 12, "carbs": 45, "fat": 8 }';
COMMENT ON COLUMN public.recipes.source_id IS 'ID único de la receta en la fuente original (para prevenir duplicados)';
COMMENT ON COLUMN public.recipes.search_vector IS 'Vector de búsqueda full-text (actualizado automáticamente)';
