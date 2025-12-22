/**
 * Pipeline ETL completo para importar recetas desde fuentes externas
 * Extract → Transform → Load con manejo de errores y logging
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ParsedRecipe } from './parsers/api';
import { cleanAndValidate, ValidationResult } from './validator';
import { NormalizedIngredient } from './units';

// ========== INTERFACES ==========

export interface ImportResult {
  success: boolean;
  imported: number;
  skipped: number;
  failed: number;
  errors: ImportError[];
  warnings: ImportWarning[];
}

export interface ImportError {
  recipe: string;
  error: string;
  details?: any;
}

export interface ImportWarning {
  recipe: string;
  warnings: string[];
}

export interface ETLConfig {
  sourceName: string;
  userId: string;
  visibility?: 'private' | 'public' | 'unlisted';
  isVerified?: boolean;
  skipDuplicates?: boolean;
  batchSize?: number;
  dryRun?: boolean; // Si es true, no inserta en DB (solo valida)
}

// ========== PIPELINE ETL ==========

export class RecipeImportPipeline {
  private supabase: SupabaseClient;
  
  constructor(supabaseUrl: string, supabaseKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }
  
  /**
   * EXTRACT: Obtiene recetas de la fuente (ya parseadas)
   */
  private async extract(recipes: ParsedRecipe[]): Promise<ParsedRecipe[]> {
    console.log(`📥 [EXTRACT] Recibidas ${recipes.length} recetas`);
    return recipes;
  }
  
  /**
   * TRANSFORM: Limpia, valida y transforma recetas
   */
  private async transform(
    recipes: ParsedRecipe[],
    config: ETLConfig
  ): Promise<{
    valid: Array<ParsedRecipe & { validation: ValidationResult }>;
    invalid: ImportError[];
    warnings: ImportWarning[];
  }> {
    console.log(`🔄 [TRANSFORM] Procesando ${recipes.length} recetas...`);
    
    const valid: Array<ParsedRecipe & { validation: ValidationResult }> = [];
    const invalid: ImportError[] = [];
    const warnings: ImportWarning[] = [];
    
    for (const recipe of recipes) {
      try {
        // Limpiar y validar
        const { recipe: cleaned, validation } = cleanAndValidate({
          title: recipe.title,
          description: recipe.description,
          ingredients: recipe.ingredients,
          steps: recipe.steps,
          servings: recipe.servings,
          prepTime: recipe.prepTime,
          cookTime: recipe.cookTime,
          totalTime: recipe.totalTime,
          tags: recipe.tags,
          difficulty: recipe.difficulty
        });
        
        // Si tiene errores críticos, rechazar
        if (!validation.valid) {
          invalid.push({
            recipe: recipe.title,
            error: 'Validación fallida',
            details: validation.errors
          });
          continue;
        }
        
        // Si tiene advertencias, registrar
        if (validation.warnings.length > 0) {
          warnings.push({
            recipe: recipe.title,
            warnings: validation.warnings
          });
        }
        
        // Agregar a válidos
        valid.push({
          ...recipe,
          ...cleaned,
          difficulty: cleaned.difficulty as 'easy' | 'medium' | 'hard' | undefined,
          validation
        });
      } catch (error) {
        invalid.push({
          recipe: recipe.title,
          error: 'Error en transformación',
          details: error
        });
      }
    }
    
    console.log(
      `✅ [TRANSFORM] ${valid.length} válidas, ${invalid.length} inválidas, ${warnings.length} con advertencias`
    );
    
    return { valid, invalid, warnings };
  }
  
  /**
   * LOAD: Inserta recetas en Supabase
   */
  private async load(
    recipes: Array<ParsedRecipe & { validation: ValidationResult }>,
    config: ETLConfig
  ): Promise<{
    imported: number;
    skipped: number;
    errors: ImportError[];
  }> {
    console.log(`📤 [LOAD] Cargando ${recipes.length} recetas a Supabase...`);
    
    if (config.dryRun) {
      console.log('🔍 [DRY RUN] Modo simulación - no se insertará nada');
      return { imported: 0, skipped: recipes.length, errors: [] };
    }
    
    let imported = 0;
    let skipped = 0;
    const errors: ImportError[] = [];
    
    const batchSize = config.batchSize || 10;
    
    for (let i = 0; i < recipes.length; i += batchSize) {
      const batch = recipes.slice(i, i + batchSize);
      
      for (const recipe of batch) {
        try {
          // Verificar duplicados por source_id
          if (config.skipDuplicates && recipe.sourceId) {
            const { data: existing } = await this.supabase
              .from('recipes')
              .select('id')
              .eq('source_id', recipe.sourceId)
              .eq('source_type', 'imported')
              .maybeSingle();
            
            if (existing) {
              console.log(`⏭️  [SKIP] Receta duplicada: ${recipe.title} (source_id: ${recipe.sourceId})`);
              skipped++;
              continue;
            }
          }
          
          // Preparar datos para inserción
          const recipeData = {
            user_id: config.userId,
            title: recipe.title,
            description: recipe.description,
            image_url: recipe.imageUrl,
            source_type: 'imported' as const,
            source_name: recipe.sourceName || config.sourceName,
            source_url: recipe.sourceUrl,
            source_id: recipe.sourceId,
            ingredients: recipe.ingredients,
            steps: recipe.steps,
            servings: recipe.servings,
            prep_time_minutes: recipe.prepTime,
            cook_time_minutes: recipe.cookTime,
            total_time_minutes: recipe.totalTime,
            tags: recipe.tags || [],
            cuisine: recipe.cuisine,
            category: recipe.category,
            difficulty: recipe.difficulty,
            visibility: config.visibility || 'private',
            is_verified: config.isVerified || false
          };
          
          // Insertar
          const { error } = await this.supabase
            .from('recipes')
            .insert(recipeData);
          
          if (error) {
            throw error;
          }
          
          console.log(`✅ [INSERT] ${recipe.title}`);
          imported++;
        } catch (error: any) {
          console.error(`❌ [ERROR] ${recipe.title}:`, error.message);
          errors.push({
            recipe: recipe.title,
            error: error.message,
            details: error
          });
        }
      }
      
      // Pequeña pausa entre batches para no saturar
      if (i + batchSize < recipes.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    console.log(`✅ [LOAD] Completado: ${imported} importadas, ${skipped} omitidas, ${errors.length} errores`);
    
    return { imported, skipped, errors };
  }
  
  /**
   * Ejecuta el pipeline completo ETL
   */
  async import(
    recipes: ParsedRecipe[],
    config: ETLConfig
  ): Promise<ImportResult> {
    console.log(`\n🚀 Iniciando importación desde "${config.sourceName}"`);
    console.log(`📊 Total de recetas a procesar: ${recipes.length}\n`);
    
    try {
      // EXTRACT
      const extracted = await this.extract(recipes);
      
      // TRANSFORM
      const { valid, invalid, warnings } = await this.transform(extracted, config);
      
      // LOAD
      const { imported, skipped, errors } = await this.load(valid, config);
      
      // Combinar errores
      const allErrors = [...invalid, ...errors];
      
      console.log('\n📈 RESUMEN DE IMPORTACIÓN:');
      console.log(`  ✅ Importadas: ${imported}`);
      console.log(`  ⏭️  Omitidas: ${skipped}`);
      console.log(`  ❌ Fallidas: ${allErrors.length}`);
      console.log(`  ⚠️  Advertencias: ${warnings.length}\n`);
      
      return {
        success: allErrors.length === 0,
        imported,
        skipped,
        failed: allErrors.length,
        errors: allErrors,
        warnings
      };
    } catch (error: any) {
      console.error('❌ Error crítico en pipeline:', error);
      throw error;
    }
  }
}

/**
 * Función de conveniencia para importar recetas
 */
export async function importRecipes(
  recipes: ParsedRecipe[],
  config: ETLConfig,
  supabaseUrl: string,
  supabaseKey: string
): Promise<ImportResult> {
  const pipeline = new RecipeImportPipeline(supabaseUrl, supabaseKey);
  return await pipeline.import(recipes, config);
}
