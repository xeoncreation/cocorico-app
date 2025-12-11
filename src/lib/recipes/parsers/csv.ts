/**
 * Parser genérico para CSV de recetas
 * Soporta diferentes formatos de CSV con columnas configurables
 */

import { parse } from 'csv-parse/sync';
import { NormalizedIngredient, normalizeIngredients } from '../units';

export interface CSVRecipe {
  title: string;
  description?: string;
  ingredients: NormalizedIngredient[];
  steps: string[];
  servings?: number;
  prepTime?: number;
  cookTime?: number;
  totalTime?: number;
  tags?: string[];
  cuisine?: string;
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  imageUrl?: string;
  sourceUrl?: string;
  sourceId?: string;
}

export interface CSVParserConfig {
  // Mapeo de columnas CSV a campos de receta
  columns: {
    title: string;
    description?: string;
    ingredients: string; // Puede ser JSON array o string delimitado
    steps: string;       // Puede ser JSON array o string delimitado
    servings?: string;
    prepTime?: string;
    cookTime?: string;
    totalTime?: string;
    tags?: string;
    cuisine?: string;
    category?: string;
    difficulty?: string;
    imageUrl?: string;
    sourceUrl?: string;
    sourceId?: string;
  };
  
  // Configuración de delimitadores
  delimiter?: string;           // Delimitador del CSV (default: ',')
  ingredientSeparator?: string; // Separador de ingredientes si es string (default: '|')
  stepSeparator?: string;       // Separador de pasos si es string (default: '|')
  tagSeparator?: string;        // Separador de tags (default: ',')
  
  // Configuración de ingredientes
  ingredientFormat?: 'json' | 'string'; // 'json': array JSON, 'string': "cantidad unidad nombre"
  ingredientPattern?: RegExp;           // Patrón para extraer cantidad, unidad y nombre
}

const DEFAULT_CONFIG: Partial<CSVParserConfig> = {
  delimiter: ',',
  ingredientSeparator: '|',
  stepSeparator: '|',
  tagSeparator: ',',
  ingredientFormat: 'string',
  ingredientPattern: /^(\d+\.?\d*)\s*([a-zA-Z]+)\s+(.+)$/ // "250 g harina"
};

/**
 * Parsea ingredientes desde diferentes formatos
 */
function parseIngredients(
  raw: string,
  config: CSVParserConfig
): NormalizedIngredient[] {
  const format = config.ingredientFormat || 'string';
  const separator = config.ingredientSeparator || '|';
  const pattern = config.ingredientPattern || DEFAULT_CONFIG.ingredientPattern!;
  
  // Formato JSON: [{ "name": "harina", "amount": 250, "unit": "g" }]
  if (format === 'json') {
    try {
      const parsed = JSON.parse(raw);
      return normalizeIngredients(parsed);
    } catch {
      console.warn('Error al parsear ingredientes JSON:', raw);
      return [];
    }
  }
  
  // Formato string: "250 g harina | 2 cups leche | 1 unit huevo"
  const ingredientStrings = raw.split(separator).map(s => s.trim());
  const ingredients = ingredientStrings.map(str => {
    const match = str.match(pattern);
    
    if (!match) {
      // Sin cantidad/unidad, solo nombre
      return { name: str };
    }
    
    const [, amountStr, unit, name] = match;
    return {
      name: name.trim(),
      amount: parseFloat(amountStr),
      unit: unit.trim()
    };
  });
  
  return normalizeIngredients(ingredients);
}

/**
 * Parsea pasos desde diferentes formatos
 */
function parseSteps(raw: string, config: CSVParserConfig): string[] {
  const separator = config.stepSeparator || '|';
  
  // Formato JSON: ["Paso 1", "Paso 2"]
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.map(s => String(s).trim());
    }
  } catch {
    // No es JSON, continuar con formato string
  }
  
  // Formato string delimitado: "Paso 1 | Paso 2 | Paso 3"
  return raw.split(separator).map(s => s.trim()).filter(s => s.length > 0);
}

/**
 * Parsea un archivo CSV de recetas
 */
export function parseRecipeCSV(
  csvContent: string,
  config: CSVParserConfig
): CSVRecipe[] {
  const delimiter = config.delimiter || ',';
  const tagSeparator = config.tagSeparator || ',';
  
  // Parsear CSV
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    delimiter,
    trim: true
  });
  
  // Convertir cada fila a receta normalizada
  return records.map((row: any) => {
    const recipe: CSVRecipe = {
      title: row[config.columns.title],
      ingredients: parseIngredients(row[config.columns.ingredients], config),
      steps: parseSteps(row[config.columns.steps], config)
    };
    
    // Campos opcionales
    if (config.columns.description && row[config.columns.description]) {
      recipe.description = row[config.columns.description];
    }
    
    if (config.columns.servings && row[config.columns.servings]) {
      recipe.servings = parseInt(row[config.columns.servings]);
    }
    
    if (config.columns.prepTime && row[config.columns.prepTime]) {
      recipe.prepTime = parseInt(row[config.columns.prepTime]);
    }
    
    if (config.columns.cookTime && row[config.columns.cookTime]) {
      recipe.cookTime = parseInt(row[config.columns.cookTime]);
    }
    
    if (config.columns.totalTime && row[config.columns.totalTime]) {
      recipe.totalTime = parseInt(row[config.columns.totalTime]);
    }
    
    if (config.columns.tags && row[config.columns.tags]) {
      recipe.tags = row[config.columns.tags]
        .split(tagSeparator)
        .map((t: string) => t.trim())
        .filter((t: string) => t.length > 0);
    }
    
    if (config.columns.cuisine && row[config.columns.cuisine]) {
      recipe.cuisine = row[config.columns.cuisine];
    }
    
    if (config.columns.category && row[config.columns.category]) {
      recipe.category = row[config.columns.category];
    }
    
    if (config.columns.difficulty && row[config.columns.difficulty]) {
      const diff = row[config.columns.difficulty].toLowerCase();
      if (['easy', 'medium', 'hard'].includes(diff)) {
        recipe.difficulty = diff as 'easy' | 'medium' | 'hard';
      }
    }
    
    if (config.columns.imageUrl && row[config.columns.imageUrl]) {
      recipe.imageUrl = row[config.columns.imageUrl];
    }
    
    if (config.columns.sourceUrl && row[config.columns.sourceUrl]) {
      recipe.sourceUrl = row[config.columns.sourceUrl];
    }
    
    if (config.columns.sourceId && row[config.columns.sourceId]) {
      recipe.sourceId = row[config.columns.sourceId];
    }
    
    return recipe;
  });
}

/**
 * Configuración predefinida para CSV genérico simple
 */
export const SIMPLE_CSV_CONFIG: CSVParserConfig = {
  columns: {
    title: 'title',
    description: 'description',
    ingredients: 'ingredients',
    steps: 'steps',
    servings: 'servings',
    prepTime: 'prep_time',
    cookTime: 'cook_time',
    category: 'category',
    tags: 'tags'
  },
  delimiter: ',',
  ingredientSeparator: '|',
  stepSeparator: '|',
  tagSeparator: ',',
  ingredientFormat: 'string',
  ingredientPattern: /^(\d+\.?\d*)\s*([a-zA-Z]+)\s+(.+)$/
};

/**
 * Ejemplo de uso:
 * 
 * ```typescript
 * const csvContent = `
 * title,ingredients,steps,servings
 * "Pasta Carbonara","200 g pasta | 100 g bacon | 2 unit huevos","Cocinar pasta | Freír bacon | Mezclar","2"
 * `;
 * 
 * const recipes = parseRecipeCSV(csvContent, SIMPLE_CSV_CONFIG);
 * ```
 */
