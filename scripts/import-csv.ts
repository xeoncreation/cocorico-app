/**
 * Script para importar recetas desde archivo CSV
 * Uso: npx ts-node scripts/import-csv.ts <archivo.csv> [--format=simple|custom]
 */

import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { parseRecipeCSV, SIMPLE_CSV_CONFIG, CSVParserConfig } from '../src/lib/recipes/parsers/csv';
import { importRecipes } from '../src/lib/recipes/etl';
import { ParsedRecipe } from '../src/lib/recipes/parsers/api';

// Cargar variables de entorno
dotenv.config({ path: '.env.local' });

// Configuración
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const USER_ID = process.env.IMPORT_USER_ID!;

// Argumentos CLI
const args = process.argv.slice(2);
const csvPath = args[0];
const formatArg = args.find(arg => arg.startsWith('--format='));
const sourceArg = args.find(arg => arg.startsWith('--source='));
const visibilityArg = args.find(arg => arg.startsWith('--visibility='));
const dryRunArg = args.includes('--dry-run');

const format = formatArg?.split('=')[1] || 'simple';
const sourceName = sourceArg?.split('=')[1] || 'CSV Import';
const visibility = (visibilityArg?.split('=')[1] as 'private' | 'public' | 'unlisted') || 'private';

/**
 * Configuraciones predefinidas para diferentes formatos CSV
 */
const CSV_FORMATS: Record<string, CSVParserConfig> = {
  simple: SIMPLE_CSV_CONFIG,
  
  // Formato para recetas de GitHub awesome-recipes
  github: {
    columns: {
      title: 'name',
      ingredients: 'ingredients',
      steps: 'instructions',
      servings: 'servings',
      prepTime: 'prep_time',
      cookTime: 'cook_time',
      category: 'category',
      tags: 'tags'
    },
    delimiter: ',',
    ingredientSeparator: '\n',
    stepSeparator: '\n',
    tagSeparator: ',',
    ingredientFormat: 'string',
    ingredientPattern: /^(\d+\.?\d*)\s*([a-zA-Z]+)\s+(.+)$/
  },
  
  // Formato personalizado con JSON
  custom: {
    columns: {
      title: 'recipe_name',
      description: 'desc',
      ingredients: 'ingredients_json',
      steps: 'steps_json',
      servings: 'serves',
      totalTime: 'total_minutes',
      cuisine: 'cuisine_type',
      imageUrl: 'photo_url'
    },
    delimiter: ',',
    ingredientFormat: 'json',
    stepSeparator: '|'
  }
};

/**
 * Función principal
 */
async function main() {
  // Validar argumentos
  if (!csvPath) {
    console.error('❌ Error: Falta el archivo CSV');
    console.log('\nUso: npx ts-node scripts/import-csv.ts <archivo.csv> [opciones]');
    console.log('\nOpciones:');
    console.log('  --format=<simple|github|custom>   Formato del CSV (default: simple)');
    console.log('  --source=<nombre>                 Nombre de la fuente (default: "CSV Import")');
    console.log('  --visibility=<private|public>     Visibilidad (default: private)');
    console.log('  --dry-run                         Simular sin insertar');
    console.log('\nEjemplo:');
    console.log('  npx ts-node scripts/import-csv.ts ./recetas.csv --format=simple --visibility=public');
    process.exit(1);
  }
  
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
  
  // Validar archivo
  const fullPath = path.resolve(csvPath);
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ Archivo no encontrado: ${fullPath}`);
    process.exit(1);
  }
  
  // Obtener configuración
  const config = CSV_FORMATS[format];
  if (!config) {
    console.error(`❌ Formato desconocido: ${format}`);
    console.error(`   Formatos disponibles: ${Object.keys(CSV_FORMATS).join(', ')}`);
    process.exit(1);
  }
  
  console.log('\n🐓 IMPORTADOR DE RECETAS - CSV\n');
  console.log('Configuración:');
  console.log(`  📁 Archivo: ${path.basename(fullPath)}`);
  console.log(`  📋 Formato: ${format}`);
  console.log(`  🏷️  Fuente: ${sourceName}`);
  console.log(`  👀 Visibilidad: ${visibility}`);
  console.log(`  👤 Usuario: ${USER_ID}`);
  console.log(`  🔍 Dry run: ${dryRunArg ? 'Sí' : 'No'}\n`);
  
  try {
    // 1. Leer archivo CSV
    console.log(`📖 Leyendo archivo CSV...`);
    const csvContent = fs.readFileSync(fullPath, 'utf-8');
    
    // 2. Parsear CSV
    console.log(`🔄 Parseando CSV...`);
    const parsedRecipes = parseRecipeCSV(csvContent, config);
    console.log(`✅ Parseadas ${parsedRecipes.length} recetas`);
    
    if (parsedRecipes.length === 0) {
      console.log('⚠️  No hay recetas para importar');
      return;
    }
    
    // 3. Convertir a formato ParsedRecipe
    const recipes: ParsedRecipe[] = parsedRecipes.map((recipe, index) => ({
      ...recipe,
      sourceId: `csv-${Date.now()}-${index}`,
      sourceName
    }));
    
    // 4. Ejecutar pipeline ETL
    const result = await importRecipes(
      recipes,
      {
        sourceName,
        userId: USER_ID,
        visibility,
        isVerified: false,
        skipDuplicates: true,
        batchSize: 10,
        dryRun: dryRunArg
      },
      SUPABASE_URL,
      SUPABASE_KEY
    );
    
    // 5. Mostrar resultados
    console.log('\n' + '='.repeat(50));
    console.log('📊 RESULTADO FINAL');
    console.log('='.repeat(50));
    console.log(`✅ Importadas: ${result.imported}`);
    console.log(`⏭️  Omitidas: ${result.skipped}`);
    console.log(`❌ Fallidas: ${result.failed}`);
    console.log(`⚠️  Advertencias: ${result.warnings.length}`);
    
    if (result.warnings.length > 0) {
      console.log('\n⚠️  ADVERTENCIAS:');
      result.warnings.slice(0, 10).forEach(w => {
        console.log(`  - ${w.recipe}:`);
        w.warnings.forEach(msg => console.log(`    • ${msg}`));
      });
      if (result.warnings.length > 10) {
        console.log(`  ... y ${result.warnings.length - 10} más`);
      }
    }
    
    if (result.errors.length > 0) {
      console.log('\n❌ ERRORES:');
      result.errors.slice(0, 10).forEach(e => {
        console.log(`  - ${e.recipe}: ${e.error}`);
      });
      if (result.errors.length > 10) {
        console.log(`  ... y ${result.errors.length - 10} más`);
      }
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
