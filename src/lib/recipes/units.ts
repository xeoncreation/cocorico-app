/**
 * Sistema de normalización de unidades de medida
 * Convierte todas las unidades a métricas (gramos y mililitros)
 */

export type UnitType = 'weight' | 'volume' | 'count' | 'other';

export interface UnitConversion {
  type: UnitType;
  toGrams?: number;      // Factor de conversión a gramos
  toMilliliters?: number; // Factor de conversión a mililitros
  aliases: string[];     // Variaciones del nombre de la unidad
}

/**
 * Tabla de conversión de unidades a métrica
 */
export const UNIT_CONVERSIONS: Record<string, UnitConversion> = {
  // ========== PESO (WEIGHT) ==========
  'g': {
    type: 'weight',
    toGrams: 1,
    aliases: ['g', 'gr', 'gram', 'gramo', 'gramos', 'grams']
  },
  'kg': {
    type: 'weight',
    toGrams: 1000,
    aliases: ['kg', 'kilo', 'kilogram', 'kilogramo', 'kilogramos', 'kilograms']
  },
  'mg': {
    type: 'weight',
    toGrams: 0.001,
    aliases: ['mg', 'miligramo', 'miligramos', 'milligram', 'milligrams']
  },
  'oz': {
    type: 'weight',
    toGrams: 28.3495,
    aliases: ['oz', 'onza', 'onzas', 'ounce', 'ounces']
  },
  'lb': {
    type: 'weight',
    toGrams: 453.592,
    aliases: ['lb', 'lbs', 'libra', 'libras', 'pound', 'pounds']
  },

  // ========== VOLUMEN (VOLUME) ==========
  'ml': {
    type: 'volume',
    toMilliliters: 1,
    aliases: ['ml', 'mililitro', 'mililitros', 'milliliter', 'milliliters']
  },
  'l': {
    type: 'volume',
    toMilliliters: 1000,
    aliases: ['l', 'litro', 'litros', 'liter', 'liters', 'lt']
  },
  'cl': {
    type: 'volume',
    toMilliliters: 10,
    aliases: ['cl', 'centilitro', 'centilitros', 'centiliter', 'centiliters']
  },
  'dl': {
    type: 'volume',
    toMilliliters: 100,
    aliases: ['dl', 'decilitro', 'decilitros', 'deciliter', 'deciliters']
  },
  'cup': {
    type: 'volume',
    toMilliliters: 240, // US cup estándar
    aliases: ['cup', 'cups', 'taza', 'tazas', 'c']
  },
  'tbsp': {
    type: 'volume',
    toMilliliters: 15,
    aliases: ['tbsp', 'tablespoon', 'tablespoons', 'cucharada', 'cucharadas', 'cda', 'T']
  },
  'tsp': {
    type: 'volume',
    toMilliliters: 5,
    aliases: ['tsp', 'teaspoon', 'teaspoons', 'cucharadita', 'cucharaditas', 'cdta', 't']
  },
  'fl-oz': {
    type: 'volume',
    toMilliliters: 29.5735,
    aliases: ['fl oz', 'fl-oz', 'floz', 'fluid ounce', 'fluid ounces', 'onza líquida', 'onzas líquidas']
  },
  'pint': {
    type: 'volume',
    toMilliliters: 473.176, // US pint
    aliases: ['pint', 'pints', 'pt']
  },
  'quart': {
    type: 'volume',
    toMilliliters: 946.353, // US quart
    aliases: ['quart', 'quarts', 'qt']
  },
  'gallon': {
    type: 'volume',
    toMilliliters: 3785.41, // US gallon
    aliases: ['gallon', 'gallons', 'gal', 'galón', 'galones']
  },

  // ========== UNIDADES (COUNT) ==========
  'unit': {
    type: 'count',
    aliases: ['unit', 'units', 'unidad', 'unidades', 'pieza', 'piezas', 'piece', 'pieces', 'u', 'pc', 'pcs']
  },
  'dozen': {
    type: 'count',
    aliases: ['dozen', 'docena', 'dz']
  },
  'slice': {
    type: 'count',
    aliases: ['slice', 'slices', 'rebanada', 'rebanadas', 'rodaja', 'rodajas']
  },
  'clove': {
    type: 'count',
    aliases: ['clove', 'cloves', 'diente', 'dientes']
  },

  // ========== OTRAS (OTHER) ==========
  'pinch': {
    type: 'other',
    aliases: ['pinch', 'pinches', 'pizca', 'pizcas']
  },
  'dash': {
    type: 'other',
    aliases: ['dash', 'dashes', 'golpe', 'golpes']
  },
  'to-taste': {
    type: 'other',
    aliases: ['to taste', 'al gusto', 'a gusto', 'c/n']
  },
  'handful': {
    type: 'other',
    aliases: ['handful', 'handfuls', 'puñado', 'puñados']
  }
};

/**
 * Normaliza un nombre de unidad a su forma estándar
 */
export function normalizeUnitName(unit: string): string | null {
  const normalized = unit.toLowerCase().trim();
  
  for (const [standardUnit, conversion] of Object.entries(UNIT_CONVERSIONS)) {
    if (conversion.aliases.includes(normalized)) {
      return standardUnit;
    }
  }
  
  return null; // Unidad no reconocida
}

/**
 * Convierte una cantidad con unidad a unidades métricas (g o ml)
 */
export function convertToMetric(amount: number, unit: string): {
  amount: number;
  unit: string;
  type: UnitType;
} | null {
  const standardUnit = normalizeUnitName(unit);
  
  if (!standardUnit) {
    return null; // Unidad no reconocida
  }
  
  const conversion = UNIT_CONVERSIONS[standardUnit];
  
  // Peso → gramos
  if (conversion.toGrams) {
    return {
      amount: amount * conversion.toGrams,
      unit: 'g',
      type: 'weight'
    };
  }
  
  // Volumen → mililitros
  if (conversion.toMilliliters) {
    return {
      amount: amount * conversion.toMilliliters,
      unit: 'ml',
      type: 'volume'
    };
  }
  
  // Unidades o "otras" → mantener original
  return {
    amount,
    unit: standardUnit,
    type: conversion.type
  };
}

/**
 * Normaliza un ingrediente completo
 */
export interface RawIngredient {
  name: string;
  amount?: number;
  unit?: string;
}

export interface NormalizedIngredient {
  name: string;
  amount: number | null;
  unit_original: string | null;
  unit_normalized: string | null;
  amount_normalized: number | null;
  type: UnitType | null;
}

export function normalizeIngredient(ingredient: RawIngredient): NormalizedIngredient {
  // Sin cantidad ni unidad
  if (!ingredient.amount || !ingredient.unit) {
    return {
      name: ingredient.name.trim(),
      amount: ingredient.amount || null,
      unit_original: ingredient.unit?.trim() || null,
      unit_normalized: null,
      amount_normalized: null,
      type: null
    };
  }
  
  const converted = convertToMetric(ingredient.amount, ingredient.unit);
  
  // Unidad no reconocida
  if (!converted) {
    return {
      name: ingredient.name.trim(),
      amount: ingredient.amount,
      unit_original: ingredient.unit.trim(),
      unit_normalized: null,
      amount_normalized: null,
      type: 'other'
    };
  }
  
  return {
    name: ingredient.name.trim(),
    amount: ingredient.amount,
    unit_original: ingredient.unit.trim(),
    unit_normalized: converted.unit,
    amount_normalized: Math.round(converted.amount * 100) / 100, // 2 decimales
    type: converted.type
  };
}

/**
 * Normaliza un array completo de ingredientes
 */
export function normalizeIngredients(ingredients: RawIngredient[]): NormalizedIngredient[] {
  return ingredients.map(normalizeIngredient);
}

/**
 * Casos especiales: conversión estimada peso↔volumen para ingredientes comunes
 * (útil cuando la fuente mezcla unidades)
 */
export const INGREDIENT_DENSITY: Record<string, number> = {
  // Densidad aproximada en g/ml
  'agua': 1.0,
  'leche': 1.03,
  'aceite': 0.92,
  'miel': 1.42,
  'azúcar': 0.85,
  'harina': 0.59,
  'sal': 1.2,
  'mantequilla': 0.96,
  'yogur': 1.04,
  'crema': 1.01
};

/**
 * Intenta convertir entre peso y volumen usando densidad estimada
 */
export function estimateWeightVolumeConversion(
  amount: number,
  unit: string,
  ingredientName: string,
  targetType: 'weight' | 'volume'
): { amount: number; unit: string } | null {
  const standardUnit = normalizeUnitName(unit);
  if (!standardUnit) return null;
  
  const conversion = UNIT_CONVERSIONS[standardUnit];
  const ingredientKey = ingredientName.toLowerCase().trim();
  const density = INGREDIENT_DENSITY[ingredientKey];
  
  if (!density) return null; // No tenemos densidad para este ingrediente
  
  // De volumen a peso
  if (conversion.type === 'volume' && targetType === 'weight') {
    const ml = conversion.toMilliliters! * amount;
    const grams = ml * density;
    return { amount: Math.round(grams * 100) / 100, unit: 'g' };
  }
  
  // De peso a volumen
  if (conversion.type === 'weight' && targetType === 'volume') {
    const g = conversion.toGrams! * amount;
    const ml = g / density;
    return { amount: Math.round(ml * 100) / 100, unit: 'ml' };
  }
  
  return null;
}
