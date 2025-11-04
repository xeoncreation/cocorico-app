import { z } from "zod";

export const recipeSchema = z.object({
  title: z.string().min(3, "Mínimo 3 caracteres"),
  description: z.string().optional(),
  ingredients: z.array(z.string().min(1)).min(1, "Añade al menos 1 ingrediente"),
  steps: z.array(z.string().min(1)).min(1, "Añade al menos 1 paso"),
  time_minutes: z.number().min(1).max(600),
  difficulty: z.enum(["fácil", "media", "difícil"]),
  visibility: z.enum(["public", "private"]),
  image_url: z.string().url().nullable().optional(),
});
export type RecipeInput = z.infer<typeof recipeSchema>;
