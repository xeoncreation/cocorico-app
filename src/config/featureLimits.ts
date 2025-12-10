/**
 * Configuración de límites de uso para funciones premium
 * 
 * Define cuántos usos semanales tiene cada función en el plan FREE.
 * Los usuarios PREMIUM no tienen estos límites (o son mucho más altos).
 * 
 * @module featureLimits
 */

export type FeatureKey = 
  | 'ai_chat'
  | 'barcode_scanner'
  | 'food_detector'
  | 'nutrition_analysis'
  | 'recipe_generator'
  | 'voice_conversation'
  | 'image_analysis';

/**
 * Límites semanales de uso para plan FREE
 * 
 * Cada clave representa una función premium de la app.
 * El valor es el número máximo de usos por semana (de lunes a domingo).
 * 
 * Si una función no está en este objeto, se considera bloqueada para usuarios free.
 */
export const FREE_WEEKLY_LIMITS: Record<FeatureKey, number> = {
  // Chat con IA (chat de texto con GPT)
  ai_chat: 20,
  
  // Escáner de código de barras
  barcode_scanner: 30,
  
  // Detector de alimentos por foto
  food_detector: 30,
  
  // Análisis nutricional detallado
  nutrition_analysis: 15,
  
  // Generador de recetas con IA
  recipe_generator: 10,
  
  // Conversación de voz (STT + GPT + TTS)
  voice_conversation: 10,
  
  // Análisis de imágenes de platos
  image_analysis: 20,
};

/**
 * Nombres legibles de las funciones (para mostrar en UI)
 */
export const FEATURE_NAMES: Record<FeatureKey, string> = {
  ai_chat: 'Chat con IA',
  barcode_scanner: 'Escáner de código de barras',
  food_detector: 'Detector de alimentos',
  nutrition_analysis: 'Análisis nutricional',
  recipe_generator: 'Generador de recetas',
  voice_conversation: 'Conversación de voz',
  image_analysis: 'Análisis de imágenes',
};

/**
 * Descripciones de las funciones (para modales/tooltips)
 */
export const FEATURE_DESCRIPTIONS: Record<FeatureKey, string> = {
  ai_chat: 'Conversa con nuestra IA especializada en cocina y nutrición',
  barcode_scanner: 'Escanea productos para ver su información nutricional',
  food_detector: 'Identifica alimentos con tu cámara',
  nutrition_analysis: 'Análisis detallado de valores nutricionales',
  recipe_generator: 'Genera recetas personalizadas con IA',
  voice_conversation: 'Habla con la IA por voz',
  image_analysis: 'Analiza fotos de platos para obtener información nutricional',
};

/**
 * Helper para obtener el límite de una función
 */
export function getFeatureLimit(featureKey: FeatureKey): number {
  return FREE_WEEKLY_LIMITS[featureKey] ?? 0;
}

/**
 * Helper para verificar si una función está disponible en plan free
 */
export function isFeatureAvailableInFree(featureKey: FeatureKey): boolean {
  return getFeatureLimit(featureKey) > 0;
}
