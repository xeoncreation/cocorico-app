/**
 * Sistema de validación y limpieza de datos para recetas importadas
 */

import { NormalizedIngredient } from './units';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface RecipeToValidate {
  title: string;
  ingredients: NormalizedIngredient[];
  steps: string[];
  servings?: number;
  prepTime?: number;
  cookTime?: number;
  totalTime?: number;
  difficulty?: string;
}

/**
 * Reglas de validación para recetas
 */
export class RecipeValidator {
  /**
   * Valida que el título sea adecuado
   */
  static validateTitle(title: string): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    if (!title || title.trim().length === 0) {
      errors.push('El título es obligatorio');
    } else if (title.trim().length < 3) {
      errors.push('El título debe tener al menos 3 caracteres');
    } else if (title.length > 200) {
      errors.push('El título no puede exceder 200 caracteres');
    }
    
    if (title && /^\d+$/.test(title)) {
      warnings.push('El título parece ser solo un número');
    }
    
    if (title && title === title.toUpperCase() && title.length > 10) {
      warnings.push('El título está completamente en mayúsculas');
    }
    
    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }
  
  /**
   * Valida que los ingredientes sean válidos
   */
  static validateIngredients(ingredients: NormalizedIngredient[]): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    if (!ingredients || ingredients.length === 0) {
      errors.push('La receta debe tener al menos un ingrediente');
      return { valid: false, errors, warnings };
    }
    
    if (ingredients.length > 50) {
      warnings.push(`La receta tiene ${ingredients.length} ingredientes (puede ser excesivo)`);
    }
    
    ingredients.forEach((ing, index) => {
      if (!ing.name || ing.name.trim().length === 0) {
        errors.push(`Ingrediente ${index + 1}: nombre vacío`);
      }
      
      if (ing.amount && ing.amount < 0) {
        errors.push(`Ingrediente "${ing.name}": cantidad negativa`);
      }
      
      if (ing.amount && ing.amount > 10000) {
        warnings.push(`Ingrediente "${ing.name}": cantidad muy alta (${ing.amount})`);
      }
      
      if (ing.amount && !ing.unit_normalized) {
        warnings.push(`Ingrediente "${ing.name}": unidad no reconocida "${ing.unit_original}"`);
      }
    });
    
    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }
  
  /**
   * Valida que los pasos sean adecuados
   */
  static validateSteps(steps: string[]): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    if (!steps || steps.length === 0) {
      errors.push('La receta debe tener al menos un paso');
      return { valid: false, errors, warnings };
    }
    
    if (steps.length > 50) {
      warnings.push(`La receta tiene ${steps.length} pasos (puede ser excesivo)`);
    }
    
    steps.forEach((step, index) => {
      if (!step || step.trim().length === 0) {
        errors.push(`Paso ${index + 1}: está vacío`);
      } else if (step.trim().length < 5) {
        warnings.push(`Paso ${index + 1}: muy corto (${step.length} caracteres)`);
      }
    });
    
    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }
  
  /**
   * Valida datos numéricos (porciones, tiempos)
   */
  static validateNumericFields(recipe: RecipeToValidate): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // Porciones
    if (recipe.servings !== undefined) {
      if (recipe.servings <= 0) {
        errors.push('Las porciones deben ser mayor a 0');
      } else if (recipe.servings > 100) {
        warnings.push(`Porciones muy altas: ${recipe.servings}`);
      }
    }
    
    // Tiempos
    if (recipe.prepTime !== undefined && recipe.prepTime < 0) {
      errors.push('El tiempo de preparación no puede ser negativo');
    }
    
    if (recipe.cookTime !== undefined && recipe.cookTime < 0) {
      errors.push('El tiempo de cocción no puede ser negativo');
    }
    
    if (recipe.totalTime !== undefined && recipe.totalTime < 0) {
      errors.push('El tiempo total no puede ser negativo');
    }
    
    // Coherencia de tiempos
    if (recipe.prepTime && recipe.cookTime && recipe.totalTime) {
      const sum = recipe.prepTime + recipe.cookTime;
      const diff = Math.abs(sum - recipe.totalTime);
      
      if (diff > 10) { // Diferencia mayor a 10 minutos
        warnings.push(
          `Inconsistencia en tiempos: prep(${recipe.prepTime}) + cook(${recipe.cookTime}) ≠ total(${recipe.totalTime})`
        );
      }
    }
    
    // Tiempos extremos
    if (recipe.totalTime && recipe.totalTime > 480) { // Más de 8 horas
      warnings.push(`Tiempo total muy alto: ${recipe.totalTime} minutos`);
    }
    
    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }
  
  /**
   * Validación completa de una receta
   */
  static validate(recipe: RecipeToValidate): ValidationResult {
    const results: ValidationResult[] = [
      this.validateTitle(recipe.title),
      this.validateIngredients(recipe.ingredients),
      this.validateSteps(recipe.steps),
      this.validateNumericFields(recipe)
    ];
    
    const allErrors = results.flatMap(r => r.errors);
    const allWarnings = results.flatMap(r => r.warnings);
    
    return {
      valid: allErrors.length === 0,
      errors: allErrors,
      warnings: allWarnings
    };
  }
}

/**
 * Funciones de limpieza de datos
 */
export class RecipeCleaner {
  /**
   * Limpia y normaliza el título
   */
  static cleanTitle(title: string): string {
    return title
      .trim()
      .replace(/\s+/g, ' ') // Múltiples espacios → uno solo
      .replace(/[^\w\s\-áéíóúñÁÉÍÓÚÑ]/gi, '') // Eliminar caracteres especiales
      .slice(0, 200); // Limitar longitud
  }
  
  /**
   * Limpia la descripción
   */
  static cleanDescription(description: string | undefined): string | undefined {
    if (!description) return undefined;
    
    return description
      .trim()
      .replace(/<[^>]*>/g, '') // Eliminar HTML
      .replace(/\s+/g, ' ')
      .slice(0, 1000); // Limitar longitud
  }
  
  /**
   * Limpia los pasos eliminando duplicados y pasos vacíos
   */
  static cleanSteps(steps: string[]): string[] {
    const seen = new Set<string>();
    
    return steps
      .map(step => step.trim())
      .filter(step => {
        if (step.length === 0) return false;
        if (seen.has(step.toLowerCase())) return false; // Duplicado
        seen.add(step.toLowerCase());
        return true;
      });
  }
  
  /**
   * Limpia tags eliminando duplicados y normalizando
   */
  static cleanTags(tags: string[] | undefined): string[] {
    if (!tags) return [];
    
    const seen = new Set<string>();
    
    return tags
      .map(tag => tag.toLowerCase().trim())
      .filter(tag => {
        if (tag.length === 0) return false;
        if (seen.has(tag)) return false;
        seen.add(tag);
        return true;
      })
      .slice(0, 20); // Máximo 20 tags
  }
  
  /**
   * Limpia campos numéricos asegurando valores razonables
   */
  static cleanNumericField(value: number | undefined, min: number, max: number): number | undefined {
    if (value === undefined) return undefined;
    if (isNaN(value)) return undefined;
    if (value < min) return min;
    if (value > max) return max;
    return Math.round(value);
  }
  
  /**
   * Limpieza completa de una receta
   */
  static clean(recipe: RecipeToValidate & {
    description?: string;
    tags?: string[];
  }): RecipeToValidate & {
    description?: string;
    tags?: string[];
  } {
    return {
      title: this.cleanTitle(recipe.title),
      description: this.cleanDescription(recipe.description),
      ingredients: recipe.ingredients, // Ya normalizados por el parser
      steps: this.cleanSteps(recipe.steps),
      servings: this.cleanNumericField(recipe.servings, 1, 100),
      prepTime: this.cleanNumericField(recipe.prepTime, 0, 1440), // Máx 24h
      cookTime: this.cleanNumericField(recipe.cookTime, 0, 1440),
      totalTime: this.cleanNumericField(recipe.totalTime, 0, 1440),
      tags: this.cleanTags(recipe.tags),
      difficulty: recipe.difficulty
    };
  }
}

/**
 * Función combinada: limpiar y validar
 */
export function cleanAndValidate(recipe: RecipeToValidate & {
  description?: string;
  tags?: string[];
}): {
  recipe: RecipeToValidate & { description?: string; tags?: string[] };
  validation: ValidationResult;
} {
  const cleaned = RecipeCleaner.clean(recipe);
  const validation = RecipeValidator.validate(cleaned);
  
  return { recipe: cleaned, validation };
}
