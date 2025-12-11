# 🚀 Guía de Instalación - Sistema de Importación de Recetas

Pasos para instalar y configurar el sistema completo de importación de recetas en Cocorico.

---

## ✅ Checklist de Instalación

- [ ] 1. Ejecutar migración SQL en Supabase
- [ ] 2. Instalar dependencias NPM
- [ ] 3. Configurar variables de entorno
- [ ] 4. Probar importación (dry-run)
- [ ] 5. Importar recetas reales

---

## 📝 Paso 1: Migración de Base de Datos

### Opción A: Supabase Dashboard (Recomendado)

1. Abre tu proyecto en [Supabase Dashboard](https://supabase.com/dashboard)
2. Ve a **SQL Editor** (menú lateral)
3. Crea una nueva query (+)
4. Copia y pega el contenido completo de:
   ```
   supabase/migrations/20251211_recipes_enhanced_for_import.sql
   ```
5. Haz clic en **Run** ▶️

### Opción B: Supabase CLI

```bash
# Si tienes Supabase CLI instalado
npx supabase db push
```

### Verificación

Ejecuta en SQL Editor:

```sql
-- Verificar que la tabla existe
SELECT COUNT(*) FROM public.recipes;

-- Verificar enums
SELECT typname FROM pg_type WHERE typname IN ('recipe_visibility', 'recipe_source_type');

-- Verificar índices
SELECT indexname FROM pg_indexes WHERE tablename = 'recipes';
```

**Resultado esperado**:
- Tabla `recipes` existe (puede estar vacía)
- 2 enums creados
- 10+ índices creados

---

## 📦 Paso 2: Instalar Dependencias

```bash
npm install csv-parse
```

**Verificación**:

```bash
npm list csv-parse
# Debería mostrar: csv-parse@5.x.x
```

---

## 🔐 Paso 3: Configurar Variables de Entorno

Edita `.env.local`:

```env
# Ya existentes (no modificar)
NEXT_PUBLIC_SUPABASE_URL=https://dxhgpjrgvkxudetbmxuw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...

# NUEVO: Usuario administrador para recetas importadas
IMPORT_USER_ID=<tu-user-id-uuid>
```

### ¿Cómo obtener el `IMPORT_USER_ID`?

#### Método 1: Dashboard de Supabase
1. Ve a **Authentication → Users**
2. Copia el UUID de tu usuario admin

#### Método 2: SQL
```sql
-- En Supabase SQL Editor
SELECT id, email FROM auth.users LIMIT 5;
```

Copia el UUID del usuario que debe "poseer" las recetas importadas.

**Verificación**:

```bash
# En PowerShell
$env:IMPORT_USER_ID
# Debería mostrar: 00000000-0000-0000-0000-000000000000
```

---

## 🧪 Paso 4: Probar Importación (Dry-Run)

### Test con TheMealDB

```bash
npx ts-node scripts/import-themealdb.ts --category=Dessert --limit=3 --dry-run
```

**Salida esperada**:

```
🐓 IMPORTADOR DE RECETAS - TheMealDB

Configuración:
  📁 Categoría: Dessert
  🔢 Límite: 3
  👤 Usuario: <tu-uuid>
  🔍 Dry run: Sí

🔍 Buscando recetas de categoría: Dessert
📦 Encontradas 65 recetas
🔄 Parseando 3 recetas...
📥 [EXTRACT] Recibidas 3 recetas
🔄 [TRANSFORM] Procesando 3 recetas...
✅ [TRANSFORM] 3 válidas, 0 inválidas, 0 con advertencias
🔍 [DRY RUN] Modo simulación - no se insertará nada

📊 RESULTADO FINAL
==================================================
✅ Importadas: 0
⏭️  Omitidas: 3
❌ Fallidas: 0
⚠️  Advertencias: 0

✨ Importación completada
```

### Test con CSV

Crea un archivo `test-recipes.csv`:

```csv
title,ingredients,steps,servings,category
"Tostadas Francesas","2 unit huevos | 100 ml leche | 4 unit rebanadas de pan","Batir huevos y leche | Remojar pan | Freír hasta dorar",2,desayuno
```

Ejecuta:

```bash
npx ts-node scripts/import-csv.ts ./test-recipes.csv --dry-run
```

---

## 🎯 Paso 5: Importación Real

⚠️ **IMPORTANTE**: Quita el flag `--dry-run` para insertar datos reales.

### Importar desde TheMealDB

```bash
# Importar 10 recetas de Seafood
npx ts-node scripts/import-themealdb.ts --category=Seafood --limit=10

# Importar 5 postres
npx ts-node scripts/import-themealdb.ts --category=Dessert --limit=5
```

### Importar desde CSV

```bash
npx ts-node scripts/import-csv.ts ./recetas.csv --format=simple --visibility=public
```

### Verificar en Supabase

```sql
-- Ver recetas importadas
SELECT 
  title, 
  source_name, 
  source_type,
  array_length(ingredients::jsonb, 1) as num_ingredients,
  array_length(steps::jsonb, 1) as num_steps,
  visibility,
  is_verified
FROM public.recipes
WHERE source_type = 'imported'
ORDER BY created_at DESC
LIMIT 10;
```

---

## 🔍 Verificación Final

### 1. Verificar Datos en la App

Inicia el servidor de desarrollo:

```bash
npm run dev:127
```

Ve a: `http://localhost:3000/dashboard` y busca las recetas importadas.

### 2. Verificar Búsqueda Full-Text

```sql
-- Buscar recetas por texto
SELECT title, description
FROM public.recipes
WHERE search_vector @@ to_tsquery('spanish', 'chocolate | pasta');
```

### 3. Verificar RLS

Intenta acceder a recetas como usuario no autenticado:

```sql
-- Desde SQL Editor (sin auth)
SELECT COUNT(*) FROM public.recipes WHERE visibility = 'public';
-- Debería funcionar

SELECT COUNT(*) FROM public.recipes WHERE visibility = 'private';
-- Debería devolver solo tus propias recetas
```

---

## ⚙️ Configuración Avanzada

### Personalizar Formato CSV

Edita `scripts/import-csv.ts`, sección `CSV_FORMATS`:

```typescript
const CSV_FORMATS: Record<string, CSVParserConfig> = {
  // ... formatos existentes
  
  // Tu formato personalizado
  miFormato: {
    columns: {
      title: 'nombre_receta',
      ingredients: 'ingredientes',
      steps: 'pasos',
      servings: 'porciones'
    },
    delimiter: ';',
    ingredientSeparator: '\n',
    stepSeparator: '\n'
  }
};
```

Uso:

```bash
npx ts-node scripts/import-csv.ts ./recetas.csv --format=miFormato
```

---

## 🐛 Solución de Problemas

### Error: "Cannot find module 'csv-parse'"

```bash
npm install csv-parse
```

### Error: "Falta variable de entorno: IMPORT_USER_ID"

```bash
# Windows PowerShell
$env:IMPORT_USER_ID = "tu-uuid-aquí"

# Linux/Mac
export IMPORT_USER_ID="tu-uuid-aquí"
```

O agrégalo a `.env.local`.

### Error: "relation public.recipes does not exist"

La migración SQL no se ejecutó correctamente. Repite el Paso 1.

### Warning: "Unidad no reconocida"

Agrega la unidad a `src/lib/recipes/units.ts` en `UNIT_CONVERSIONS`.

### Error: "Recipe duplicada"

Ya existe una receta con el mismo `source_id`. Opciones:
- Elimina el duplicado en Supabase
- Usa un `source_id` diferente
- Omite el flag `--skip-duplicates`

---

## 📚 Siguientes Pasos

Una vez instalado:

1. **Importa recetas base**: Usa TheMealDB para crear catálogo inicial
2. **Personaliza fuentes**: Agrega tus propios CSV con recetas locales
3. **Configura visibilidad**: Decide qué recetas son públicas
4. **Habilita búsqueda**: Prueba la búsqueda full-text en la app

---

## 🎉 ¡Listo!

El sistema de importación está configurado. Ahora puedes:

✅ Importar miles de recetas desde APIs gratuitas  
✅ Cargar tus propios CSV de recetas  
✅ Normalizar unidades automáticamente  
✅ Validar y limpiar datos  
✅ Buscar recetas por ingredientes y texto  

**Documentación completa**: `docs/SISTEMA_IMPORTACION_RECETAS.md`
