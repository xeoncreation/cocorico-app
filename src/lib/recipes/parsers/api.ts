/**
 * Parser para APIs externas de recetas
 * Incluye adaptadores para TheMealDB, Spoonacular y formato genérico
 */

import { NormalizedIngredient, normalizeIngredients } from '../units';

// ========== INTERFACES COMUNES ==========

export interface ParsedRecipe {
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
  sourceId: string;
  sourceName: string;
}

// ========== THEMEALDB ==========

export interface TheMealDBRecipe {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strTags: string | null;
  strYoutube: string;
  // Ingredientes: strIngredient1-20, strMeasure1-20
  [key: string]: string | null;
}

export function parseTheMealDBRecipe(meal: TheMealDBRecipe): ParsedRecipe {
  // Extraer ingredientes (están en campos separados strIngredient1...20, strMeasure1...20)
  const rawIngredients: { name: string; amount?: number; unit?: string }[] = [];
  
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    
    if (!ingredient || ingredient.trim() === '') continue;
    
    // Parsear medida (ej: "2 cups" → amount: 2, unit: "cups")
    if (measure && measure.trim() !== '') {
      const match = measure.trim().match(/^(\d+\.?\d*)\s*([a-zA-Z]+)?/);
      
      if (match) {
        const [, amountStr, unit] = match;
        rawIngredients.push({
          name: ingredient.trim(),
          amount: parseFloat(amountStr),
          unit: unit?.trim() || 'unit'
        });
      } else {
        // Medida sin cantidad numérica (ej: "to taste")
        rawIngredients.push({
          name: ingredient.trim()
        });
      }
    } else {
      // Sin medida
      rawIngredients.push({
        name: ingredient.trim()
      });
    }
  }
  
  // Parsear instrucciones (suelen venir en un solo string con saltos de línea)
  const steps = meal.strInstructions
    .split(/\r?\n/)
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.match(/^STEP \d+$/i)); // Eliminar marcadores "STEP 1"
  
  // Parsear tags
  const tags = meal.strTags
    ? meal.strTags.split(',').map(t => t.trim().toLowerCase())
    : [];
  
  return {
    title: meal.strMeal,
    description: `${meal.strCategory} from ${meal.strArea}`,
    ingredients: normalizeIngredients(rawIngredients),
    steps,
    tags: [...tags, meal.strCategory.toLowerCase(), meal.strArea.toLowerCase()],
    cuisine: meal.strArea,
    category: meal.strCategory,
    imageUrl: meal.strMealThumb,
    sourceUrl: meal.strYoutube || `https://www.themealdb.com/meal/${meal.idMeal}`,
    sourceId: meal.idMeal,
    sourceName: 'TheMealDB'
  };
}

// ========== SPOONACULAR ==========

export interface SpoonacularRecipe {
  id: number;
  title: string;
  summary: string;
  image: string;
  servings: number;
  readyInMinutes: number;
  preparationMinutes?: number;
  cookingMinutes?: number;
  cuisines: string[];
  dishTypes: string[];
  diets: string[];
  analyzedInstructions: Array<{
    steps: Array<{
      number: number;
      step: string;
    }>;
  }>;
  extendedIngredients: Array<{
    id: number;
    name: string;
    amount: number;
    unit: string;
    original: string;
  }>;
  sourceUrl?: string;
}

export function parseSpoonacularRecipe(recipe: SpoonacularRecipe): ParsedRecipe {
  // Ingredientes ya vienen estructurados
  const rawIngredients = recipe.extendedIngredients.map(ing => ({
    name: ing.name,
    amount: ing.amount,
    unit: ing.unit
  }));
  
  // Pasos ya vienen estructurados
  const steps = recipe.analyzedInstructions[0]?.steps.map(s => s.step) || [];
  
  // Tags combinando cuisines, dishTypes y diets
  const tags = [
    ...recipe.cuisines.map(c => c.toLowerCase()),
    ...recipe.dishTypes.map(d => d.toLowerCase()),
    ...recipe.diets.map(d => d.toLowerCase())
  ];
  
  // Dificultad estimada por tiempo
  let difficulty: 'easy' | 'medium' | 'hard' = 'medium';
  if (recipe.readyInMinutes <= 20) difficulty = 'easy';
  else if (recipe.readyInMinutes > 60) difficulty = 'hard';
  
  return {
    title: recipe.title,
    description: recipe.summary.replace(/<[^>]*>/g, ''), // Eliminar HTML
    ingredients: normalizeIngredients(rawIngredients),
    steps,
    servings: recipe.servings,
    prepTime: recipe.preparationMinutes,
    cookTime: recipe.cookingMinutes,
    totalTime: recipe.readyInMinutes,
    tags,
    cuisine: recipe.cuisines[0],
    category: recipe.dishTypes[0],
    difficulty,
    imageUrl: recipe.image,
    sourceUrl: recipe.sourceUrl || `https://spoonacular.com/recipes/${recipe.id}`,
    sourceId: String(recipe.id),
    sourceName: 'Spoonacular'
  };
}

// ========== FORMATO GENÉRICO JSON ==========

export interface GenericJSONRecipe {
  id?: string;
  name?: string;
  title?: string;
  description?: string;
  summary?: string;
  ingredients: Array<
    | string
    | { name: string; amount?: number; unit?: string; quantity?: string }
  >;
  instructions?: string | string[];
  steps?: string[];
  directions?: string[];
  servings?: number;
  yield?: number;
  prep_time?: number;
  prepTime?: number;
  cook_time?: number;
  cookTime?: number;
  total_time?: number;
  totalTime?: number;
  tags?: string[];
  cuisine?: string;
  category?: string;
  difficulty?: string;
  image?: string;
  imageUrl?: string;
  url?: string;
  source?: string;
}

export function parseGenericJSONRecipe(
  recipe: GenericJSONRecipe,
  sourceName: string = 'Generic'
): ParsedRecipe {
  // Normalizar título
  const title = recipe.title || recipe.name || 'Sin título';
  
  // Normalizar descripción
  const description = recipe.description || recipe.summary;
  
  // Normalizar ingredientes
  const rawIngredients = recipe.ingredients.map(ing => {
    if (typeof ing === 'string') {
      // Formato string: intentar parsear "cantidad unidad nombre"
      const match = ing.match(/^(\d+\.?\d*)\s*([a-zA-Z]+)\s+(.+)$/);
      if (match) {
        const [, amountStr, unit, name] = match;
        return { name, amount: parseFloat(amountStr), unit };
      }
      return { name: ing };
    }
    
    // Formato objeto
    return {
      name: ing.name,
      amount: ing.amount,
      unit: ing.unit || ing.quantity
    };
  });
  
  // Normalizar pasos
  let steps: string[] = [];
  if (recipe.steps) {
    steps = Array.isArray(recipe.steps) ? recipe.steps : [recipe.steps];
  } else if (recipe.instructions) {
    steps = Array.isArray(recipe.instructions)
      ? recipe.instructions
      : recipe.instructions.split(/\r?\n/).filter(s => s.trim().length > 0);
  } else if (recipe.directions) {
    steps = Array.isArray(recipe.directions) ? recipe.directions : [recipe.directions];
  }
  
  // Normalizar tiempos
  const servings = recipe.servings || recipe.yield;
  const prepTime = recipe.prep_time || recipe.prepTime;
  const cookTime = recipe.cook_time || recipe.cookTime;
  const totalTime = recipe.total_time || recipe.totalTime;
  
  // Normalizar dificultad
  let difficulty: 'easy' | 'medium' | 'hard' | undefined;
  if (recipe.difficulty) {
    const diff = recipe.difficulty.toLowerCase();
    if (['easy', 'medium', 'hard'].includes(diff)) {
      difficulty = diff as 'easy' | 'medium' | 'hard';
    }
  }
  
  return {
    title,
    description,
    ingredients: normalizeIngredients(rawIngredients),
    steps,
    servings,
    prepTime,
    cookTime,
    totalTime,
    tags: recipe.tags,
    cuisine: recipe.cuisine,
    category: recipe.category,
    difficulty,
    imageUrl: recipe.imageUrl || recipe.image,
    sourceUrl: recipe.url || recipe.source,
    sourceId: recipe.id || String(Date.now()),
    sourceName
  };
}
