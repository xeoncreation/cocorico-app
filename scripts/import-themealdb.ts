/**
 * Script para importar recetas desde TheMealDB API
 * Uso: npx ts-node scripts/import-themealdb.ts [--category=Seafood] [--limit=10]
 */

import { parseTheMealDBRecipe } from '../src/lib/recipes/parsers/api';
import { importRecipes } from '../src/lib/recipes/etl';

// Configuración
const THEMEALDB_API_URL = 'https://www.themealdb.com/api/json/v1/1';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const USER_ID = process.env.IMPORT_USER_ID!; // ID del usuario que recibirá las recetas

// Argumentos CLI
const args = process.argv.slice(2);
const categoryArg = args.find(arg => arg.startsWith('--category='));
const limitArg = args.find(arg => arg.startsWith('--limit='));
const dryRunArg = args.includes('--dry-run');

const category = categoryArg?.split('=')[1] || 'Seafood';
const limit = limitArg ? parseInt(limitArg.split('=')[1]) : undefined;

/**
 * Obtiene recetas de TheMealDB por categoría
 */
async function fetchRecipesByCategory(category: string) {
  console.log(`🔍 Buscando recetas de categoría: ${category}`);
  
  const response = await fetch(`${THEMEALDB_API_URL}/filter.php?c=${category}`);
  const data = await response.json();
  
  if (!data.meals) {
    console.error(`❌ No se encontraron recetas en categoría: ${category}`);
    return [];
  }
  
  console.log(`📦 Encontradas ${data.meals.length} recetas`);
  
  // Obtener detalles completos de cada receta
  const recipes = [];
  const mealsToFetch = limit ? data.meals.slice(0, limit) : data.meals;
  
  for (const meal of mealsToFetch) {
    const detailsResponse = await fetch(`${THEMEALDB_API_URL}/lookup.php?i=${meal.idMeal}`);
    const detailsData = await detailsResponse.json();
    
    if (detailsData.meals && detailsData.meals[0]) {
      recipes.push(detailsData.meals[0]);
    }
    
    // Pequeña pausa para no saturar la API
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  return recipes;
}

/**
 * Función principal
 */
async function main() {
  // Validar variables de entorno
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('❌ Faltan variables de entorno: NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY');
    process.exit(1);
  }
  
  if (!USER_ID) {
    console.error('❌ Falta variable de entorno: IMPORT_USER_ID');
    console.error('   Establece el UUID del usuario que recibirá las recetas');
    process.exit(1);
  }
  
  console.log('\n🐓 IMPORTADOR DE RECETAS - TheMealDB\n');
  console.log('Configuración:');
  console.log(`  📁 Categoría: ${category}`);
  console.log(`  🔢 Límite: ${limit || 'Sin límite'}`);
  console.log(`  👤 Usuario: ${USER_ID}`);
  console.log(`  🔍 Dry run: ${dryRunArg ? 'Sí' : 'No'}\n`);
  
  try {
    // 1. Obtener recetas de la API
    const rawRecipes = await fetchRecipesByCategory(category);
    
    if (rawRecipes.length === 0) {
      console.log('⚠️  No hay recetas para importar');
      return;
    }
    
    // 2. Parsear recetas
    console.log(`\n🔄 Parseando ${rawRecipes.length} recetas...`);
    const parsedRecipes = rawRecipes.map(parseTheMealDBRecipe);
    
    // 3. Ejecutar pipeline ETL
    const result = await importRecipes(
      parsedRecipes,
      {
        sourceName: 'TheMealDB',
        userId: USER_ID,
        visibility: 'public',
        isVerified: true,
        skipDuplicates: true,
        batchSize: 5,
        dryRun: dryRunArg
      },
      SUPABASE_URL,
      SUPABASE_KEY
    );
    
    // 4. Mostrar resultados
    console.log('\n' + '='.repeat(50));
    console.log('📊 RESULTADO FINAL');
    console.log('='.repeat(50));
    console.log(`✅ Importadas: ${result.imported}`);
    console.log(`⏭️  Omitidas: ${result.skipped}`);
    console.log(`❌ Fallidas: ${result.failed}`);
    console.log(`⚠️  Advertencias: ${result.warnings.length}`);
    
    if (result.warnings.length > 0) {
      console.log('\n⚠️  ADVERTENCIAS:');
      result.warnings.forEach(w => {
        console.log(`  - ${w.recipe}:`);
        w.warnings.forEach(msg => console.log(`    • ${msg}`));
      });
    }
    
    if (result.errors.length > 0) {
      console.log('\n❌ ERRORES:');
      result.errors.forEach(e => {
        console.log(`  - ${e.recipe}: ${e.error}`);
      });
    }
    
    console.log('\n✨ Importación completada\n');
    process.exit(result.success ? 0 : 1);
  } catch (error: any) {
    console.error('\n❌ Error fatal:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();
