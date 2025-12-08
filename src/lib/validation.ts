/**
 * Zod Validation Schemas for API Endpoints
 * 
 * Provides type-safe validation for all API requests
 * Prevents injection attacks, invalid data, and improves error messages
 */

import { z } from "zod";

/**
 * AI Recipe Generation
 * POST /api/ai/recipes
 */
export const AIRecipeRequestSchema = z.object({
  ingredients: z
    .array(z.string().min(1).max(100))
    .min(1, "Se requiere al menos un ingrediente")
    .max(20, "Máximo 20 ingredientes permitidos"),
  maxTime: z
    .number()
    .int()
    .min(5, "Tiempo mínimo: 5 minutos")
    .max(240, "Tiempo máximo: 4 horas"),
  difficulty: z.enum(["easy", "medium", "hard"]),
  diet: z
    .enum(["vegetarian", "vegan", "gluten-free", "dairy-free", "pescatarian", "keto"])
    .optional(),
});

export type AIRecipeRequest = z.infer<typeof AIRecipeRequestSchema>;

/**
 * Barcode Scanner
 * GET /api/scan/[barcode]
 */
export const BarcodeSchema = z.string()
  .regex(/^[0-9]{8,14}$/, "Código de barras inválido (debe tener 8-14 dígitos)")
  .or(z.string().regex(/^[0-9A-Z]{12,13}$/, "Código UPC/EAN inválido"));

/**
 * Recipe Creation/Update
 * POST /api/recipes
 * PUT /api/recipes/[id]
 */
export const RecipeSchema = z.object({
  title: z
    .string()
    .min(3, "El título debe tener al menos 3 caracteres")
    .max(100, "El título no puede exceder 100 caracteres")
    .regex(/^[a-zA-Z0-9áéíóúñÑ\s\-,().]+$/, "Título contiene caracteres inválidos"),
  description: z
    .string()
    .min(10, "La descripción debe tener al menos 10 caracteres")
    .max(500, "La descripción no puede exceder 500 caracteres"),
  ingredients: z
    .array(
      z.object({
        name: z.string().min(1).max(100),
        quantity: z.string().optional(),
        unit: z.string().optional(),
      })
    )
    .min(1, "Se requiere al menos un ingrediente")
    .max(50, "Máximo 50 ingredientes"),
  instructions: z
    .array(
      z.object({
        step: z.number().int().positive(),
        description: z.string().min(5).max(500),
      })
    )
    .min(1, "Se requiere al menos una instrucción")
    .max(30, "Máximo 30 pasos"),
  prepTime: z.number().int().min(0).max(480), // 8 horas max
  cookTime: z.number().int().min(0).max(480),
  servings: z.number().int().min(1).max(100),
  difficulty: z.enum(["easy", "medium", "hard"]).optional(),
  category: z
    .enum(["breakfast", "lunch", "dinner", "dessert", "snack", "appetizer", "salad"])
    .optional(),
  diet: z
    .array(
      z.enum(["vegetarian", "vegan", "gluten-free", "dairy-free", "pescatarian", "keto"])
    )
    .optional(),
  visibility: z.enum(["private", "public"]).default("private"),
  image: z.string().url().optional().or(z.literal("")),
});

export type RecipeInput = z.infer<typeof RecipeSchema>;

/**
 * Community Message
 * POST /api/chat/messages
 */
export const ChatMessageSchema = z.object({
  content: z
    .string()
    .min(1, "El mensaje no puede estar vacío")
    .max(2000, "El mensaje no puede exceder 2000 caracteres")
    .regex(/^[^<>]*$/, "El mensaje contiene HTML no permitido"), // Prevenir XSS
  room_id: z.string().uuid().optional(),
});

export type ChatMessageInput = z.infer<typeof ChatMessageSchema>;

/**
 * User Profile Update
 * PATCH /api/profile
 */
export const ProfileUpdateSchema = z.object({
  username: z
    .string()
    .min(3, "El nombre de usuario debe tener al menos 3 caracteres")
    .max(30, "El nombre de usuario no puede exceder 30 caracteres")
    .regex(/^[a-zA-Z0-9_-]+$/, "Solo letras, números, guiones y guiones bajos")
    .optional(),
  bio: z
    .string()
    .max(500, "La biografía no puede exceder 500 caracteres")
    .optional(),
  avatar_url: z.string().url("URL de avatar inválida").optional(),
});

export type ProfileUpdate = z.infer<typeof ProfileUpdateSchema>;

/**
 * Recipe Search
 * GET /api/recipes/search
 */
export const RecipeSearchSchema = z.object({
  query: z.string().min(1).max(100).optional(),
  category: z
    .enum(["breakfast", "lunch", "dinner", "dessert", "snack", "appetizer", "salad"])
    .optional(),
  difficulty: z.enum(["easy", "medium", "hard"]).optional(),
  maxTime: z.coerce.number().int().min(0).max(480).optional(),
  diet: z
    .array(z.enum(["vegetarian", "vegan", "gluten-free", "dairy-free", "pescatarian", "keto"]))
    .optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.enum(["recent", "popular", "rating", "time"]).default("recent"),
});

export type RecipeSearch = z.infer<typeof RecipeSearchSchema>;

/**
 * Recipe Rating
 * POST /api/recipes/[id]/rate
 */
export const RecipeRatingSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(500).optional(),
});

export type RecipeRating = z.infer<typeof RecipeRatingSchema>;

/**
 * Recipe Like/Unlike
 * POST /api/recipes/[id]/like
 */
export const RecipeLikeSchema = z.object({
  action: z.enum(["like", "unlike"]),
});

export type RecipeLike = z.infer<typeof RecipeLikeSchema>;

/**
 * Newsletter Subscription
 * POST /api/newsletter/subscribe
 */
export const NewsletterSchema = z.object({
  email: z.string().email("Email inválido").max(255),
  preferences: z
    .object({
      weekly_recipes: z.boolean().default(true),
      new_features: z.boolean().default(true),
      promotions: z.boolean().default(false),
    })
    .optional(),
});

export type NewsletterSubscription = z.infer<typeof NewsletterSchema>;

/**
 * Stripe Payment Intent
 * POST /api/stripe/create-payment-intent
 */
export const StripePaymentSchema = z.object({
  userId: z.string().uuid("User ID inválido"),
  email: z.string().email("Email inválido"),
  plan: z.enum(["premium_annual", "premium_monthly", "lifetime"]).default("premium_annual"),
});

export type StripePayment = z.infer<typeof StripePaymentSchema>;

/**
 * Report Content
 * POST /api/report
 */
export const ReportSchema = z.object({
  content_type: z.enum(["recipe", "message", "user"]),
  content_id: z.string().uuid(),
  reason: z.enum(["spam", "inappropriate", "copyright", "other"]),
  details: z.string().max(500).optional(),
});

export type ReportInput = z.infer<typeof ReportSchema>;

/**
 * Helper Functions
 */

/**
 * Validate request body against schema
 */
export async function validateRequest<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): Promise<{ success: true; data: T } | { success: false; error: string }> {
  try {
    const validated = await schema.parseAsync(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      return {
        success: false,
        error: firstError.message,
      };
    }
    return {
      success: false,
      error: "Datos inválidos",
    };
  }
}

/**
 * Sanitize HTML to prevent XSS
 */
export function sanitizeHtml(input: string): string {
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

/**
 * Validate UUID
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Rate limit key generator
 */
export function getRateLimitKey(
  endpoint: string,
  identifier: string // IP, user ID, etc.
): string {
  return `ratelimit:${endpoint}:${identifier}`;
}
