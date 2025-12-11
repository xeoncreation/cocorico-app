# 📥 Sistema de Importación de Recetas

Sistema completo ETL (Extract, Transform, Load) para importar recetas verificadas desde fuentes externas a Cocorico.

## 📋 Índice

- [Características](#-características)
- [Arquitectura](#-arquitectura)
- [Instalación](#-instalación)
- [Uso](#-uso)
- [Fuentes Soportadas](#-fuentes-soportadas)
- [Formatos de Datos](#-formatos-de-datos)
- [API Reference](#-api-reference)

---

## ✨ Características

### 🔄 Pipeline ETL Completo
- **Extract**: Obtiene datos de múltiples fuentes (API, CSV, JSON)
- **Transform**: Normaliza unidades, limpia y valida datos
- **Load**: Inserta en Supabase con control de duplicados

### 📏 Normalización de Unidades
- Convierte automáticamente a sistema métrico (g, ml)
- Soporta 40+ unidades (imperial, métrico, volumen, peso)
- Manejo de casos especiales (pizca, al gusto, puñado)
- Conversión peso↔volumen para ingredientes comunes

### ✅ Validación Robusta
- Validación de campos obligatorios
- Verificación de rangos numéricos
- Detección de datos inconsistentes
- Limpieza automática de HTML y caracteres especiales

### 🔍 Control de Calidad
- Prevención de duplicados por `source_id`
- Sistema de warnings para datos sospechosos
- Logging detallado de operaciones
- Modo dry-run para testing

---

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                      FUENTES EXTERNAS                       │
├───────────────┬──────────────────┬─────────────────────────┤
│  TheMealDB    │   Spoonacular    │   CSV / JSON Files      │
│     API       │       API        │                         │
└───────┬───────┴────────┬─────────┴───────────┬─────────────┘
        │                │                     │
        │ ┌──────────────▼─────────────────────▼──────────┐
        │ │         PARSERS (Extract Layer)               │
        │ │  • api.ts    - APIs (TheMealDB, Spoonacular)  │
        │ │  • csv.ts    - Archivos CSV                   │
        └─┤  • Salida: ParsedRecipe[]                     │
          └──────────────┬────────────────────────────────┘
                         │
          ┌──────────────▼────────────────────────────────┐
          │      TRANSFORM LAYER                          │
          │  ┌─────────────────────────────────────────┐  │
          │  │ units.ts - Normalización de unidades   │  │
          │  │  • Conversión a métrico (g, ml)        │  │
          │  │  • 40+ unidades soportadas             │  │
          │  └─────────────────────────────────────────┘  │
          │  ┌─────────────────────────────────────────┐  │
          │  │ validator.ts - Validación y limpieza   │  │
          │  │  • RecipeValidator (reglas de negocio) │  │
          │  │  • RecipeCleaner (sanitización)        │  │
          │  └─────────────────────────────────────────┘  │
          └──────────────┬────────────────────────────────┘
                         │
          ┌──────────────▼────────────────────────────────┐
          │          LOAD LAYER                           │
          │  etl.ts - Pipeline de carga                   │
          │  • Inserción por lotes                        │
          │  • Control de duplicados                      │
          │  • Manejo de errores                          │
          │  • Logging y reportes                         │
          └──────────────┬────────────────────────────────┘
                         │
          ┌──────────────▼────────────────────────────────┐
          │          SUPABASE DATABASE                    │
          │  recipes table (schema mejorado)              │
          │  • Campos estructurados (ingredients, steps)  │
          │  • Metadata de origen                         │
          │  • Full-text search                           │
          │  • RLS policies                               │
          └───────────────────────────────────────────────┘
```

---

## 🚀 Instalación

### 1. Ejecutar Migración de Base de Datos

Abre **Supabase Dashboard → SQL Editor** y ejecuta:

```sql
-- Archivo: supabase/migrations/20251211_recipes_enhanced_for_import.sql
```

Esto creará:
- Tabla `recipes` con estructura mejorada
- Enums: `recipe_visibility`, `recipe_source_type`
- Índices optimizados
- Políticas RLS
- Triggers para búsqueda full-text

### 2. Instalar Dependencias

```bash
npm install csv-parse
```

### 3. Configurar Variables de Entorno

Crea un archivo `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key

# UUID del usuario administrador que recibirá las recetas importadas
IMPORT_USER_ID=00000000-0000-0000-0000-000000000000
```

---

## 💡 Uso

### Importar desde TheMealDB

```bash
# Importar recetas de Seafood (máximo 10)
npx ts-node scripts/import-themealdb.ts --category=Seafood --limit=10

# Modo dry-run (sin insertar)
npx ts-node scripts/import-themealdb.ts --category=Dessert --dry-run

# Sin límite
npx ts-node scripts/import-themealdb.ts --category=Pasta
```

**Categorías disponibles**: Seafood, Dessert, Pasta, Chicken, Beef, Vegetarian, Breakfast, etc.

### Importar desde CSV

```bash
# Formato simple
npx ts-node scripts/import-csv.ts ./recetas.csv --format=simple --visibility=public

# Formato GitHub
npx ts-node scripts/import-csv.ts ./github-recipes.csv --format=github

# Dry-run
npx ts-node scripts/import-csv.ts ./recetas.csv --dry-run
```

### Uso Programático

```typescript
import { parseRecipeCSV } from '@/lib/recipes/parsers/csv';
import { importRecipes } from '@/lib/recipes/etl';

// Parsear CSV
const csvContent = fs.readFileSync('recetas.csv', 'utf-8');
const recipes = parseRecipeCSV(csvContent, SIMPLE_CSV_CONFIG);

// Importar
const result = await importRecipes(recipes, {
  sourceName: 'Mi Fuente',
  userId: 'uuid-del-usuario',
  visibility: 'public',
  isVerified: true,
  skipDuplicates: true
}, supabaseUrl, supabaseKey);

console.log(`Importadas: ${result.imported}`);
```

---

## 🌐 Fuentes Soportadas

### 1. TheMealDB API
- **URL**: https://www.themealdb.com/api.php
- **Gratuito**: Sí (1 request por segundo)
- **Campos**: Título, ingredientes (20 campos), pasos, categoría, área, imagen, video
- **Parser**: `parseTheMealDBRecipe()`

### 2. Spoonacular API
- **URL**: https://spoonacular.com/food-api
- **Gratuito**: 150 requests/día
- **Campos**: Completo (ingredientes estructurados, nutrición, pasos)
- **Parser**: `parseSpoonacularRecipe()`

### 3. CSV Genérico
- **Formatos**: Simple, GitHub, Custom
- **Flexible**: Configuración de columnas personalizable
- **Parser**: `parseRecipeCSV()`

### 4. JSON Genérico
- **Formato**: Flexible
- **Parser**: `parseGenericJSONRecipe()`

---

## 📊 Formatos de Datos

### CSV Simple

```csv
title,ingredients,steps,servings,category
"Pasta Carbonara","200 g pasta | 100 g bacon | 2 unit huevos | 50 g queso parmesano","Cocinar pasta | Freír bacon | Mezclar huevos y queso | Combinar todo",2,cena
"Ensalada César","1 unit lechuga | 50 g crutones | 30 ml aderezo césar","Lavar lechuga | Mezclar ingredientes | Servir",1,entrada
```

**Configuración**: `SIMPLE_CSV_CONFIG`

### JSON TheMealDB

```json
{
  "idMeal": "52772",
  "strMeal": "Teriyaki Chicken Casserole",
  "strCategory": "Chicken",
  "strArea": "Japanese",
  "strIngredient1": "chicken",
  "strMeasure1": "500g",
  "strInstructions": "Step 1\nStep 2\n..."
}
```

**Parser**: `parseTheMealDBRecipe()`

### JSON Spoonacular

```json
{
  "id": 123,
  "title": "Spaghetti Carbonara",
  "servings": 4,
  "readyInMinutes": 30,
  "extendedIngredients": [
    { "name": "spaghetti", "amount": 400, "unit": "g" }
  ],
  "analyzedInstructions": [
    { "steps": [{ "step": "Boil pasta..." }] }
  ]
}
```

**Parser**: `parseSpoonacularRecipe()`

---

## 🔧 API Reference

### Normalización de Unidades

```typescript
import { convertToMetric, normalizeIngredients } from '@/lib/recipes/units';

// Convertir cantidad individual
const result = convertToMetric(2, 'cups');
// => { amount: 480, unit: 'ml', type: 'volume' }

// Normalizar array de ingredientes
const normalized = normalizeIngredients([
  { name: 'harina', amount: 2, unit: 'cups' },
  { name: 'azúcar', amount: 100, unit: 'g' }
]);
// => [
//   { name: 'harina', amount: 2, unit_original: 'cups', 
//     amount_normalized: 480, unit_normalized: 'ml' },
//   { name: 'azúcar', amount: 100, unit_original: 'g',
//     amount_normalized: 100, unit_normalized: 'g' }
// ]
```

### Validación

```typescript
import { RecipeValidator, cleanAndValidate } from '@/lib/recipes/validator';

// Validar receta
const validation = RecipeValidator.validate(recipe);
console.log(validation.valid); // true/false
console.log(validation.errors); // ['error 1', 'error 2']
console.log(validation.warnings); // ['warning 1']

// Limpiar y validar
const { recipe: cleaned, validation } = cleanAndValidate(recipe);
```

### Pipeline ETL

```typescript
import { RecipeImportPipeline } from '@/lib/recipes/etl';

const pipeline = new RecipeImportPipeline(supabaseUrl, supabaseKey);

const result = await pipeline.import(recipes, {
  sourceName: 'TheMealDB',
  userId: 'uuid',
  visibility: 'public',
  isVerified: true,
  skipDuplicates: true,
  batchSize: 10,
  dryRun: false
});

console.log(result);
// {
//   success: true,
//   imported: 15,
//   skipped: 2,
//   failed: 0,
//   errors: [],
//   warnings: [...]
// }
```

---

## 📝 Estructura de Tabla `recipes`

```sql
recipes (
  id uuid PRIMARY KEY,
  user_id uuid,
  
  -- Básico
  title text NOT NULL,
  description text,
  image_url text,
  
  -- Origen
  source_type recipe_source_type ('user_created', 'imported', 'ai_generated'),
  source_name text,
  source_url text,
  source_id text UNIQUE,
  
  -- Contenido estructurado
  ingredients jsonb NOT NULL, -- Array de { name, amount, unit_normalized, ... }
  steps jsonb NOT NULL,       -- Array de strings
  
  -- Datos numéricos (métricas)
  servings integer,
  prep_time_minutes integer,
  cook_time_minutes integer,
  total_time_minutes integer,
  
  -- Categorización
  tags text[],
  cuisine text,
  category text,
  difficulty text,
  
  -- Metadata
  visibility recipe_visibility,
  is_verified boolean,
  quality_score decimal(3,2),
  
  created_at timestamptz,
  updated_at timestamptz
)
```

---

## 🎯 Roadmap

- [ ] Soporte para más APIs (Edamam, Recipe Puppy)
- [ ] Importación desde Google Sheets
- [ ] OCR para recetas en imágenes
- [ ] Generación automática de thumbnails
- [ ] Sistema de calificación de calidad
- [ ] Detección de recetas duplicadas por contenido
- [ ] Traducción automática de recetas

---

## 🤝 Contribuir

Para agregar soporte a una nueva fuente:

1. Crea un parser en `src/lib/recipes/parsers/`
2. Implementa la interfaz `ParsedRecipe`
3. Crea un script en `scripts/import-<fuente>.ts`
4. Agrega tests
5. Documenta el formato

---

## 📄 Licencia

MIT

---

## 🐛 Troubleshooting

### Error: "Unidad no reconocida"
- Agrega la unidad a `UNIT_CONVERSIONS` en `src/lib/recipes/units.ts`

### Error: "Recipe duplicada"
- Usa `--skip-duplicates=false` o elimina el `source_id` duplicado

### Warning: "Cantidad muy alta"
- Verifica que las unidades sean correctas (ej: 1000g en vez de 1000kg)

### Error: "Faltan variables de entorno"
- Verifica `.env.local` tenga `IMPORT_USER_ID`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`
