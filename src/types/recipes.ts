export enum Visibility {
  PRIVATE = 'private',
  PUBLIC = 'public'
}

export type Recipe = {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  content: string; // JSON string of cleaned recipe data
  slug: string;
  difficulty?: 'fácil' | 'media' | 'difícil';
  time?: number;
  visibility: Visibility;
  created_at: string;
  updated_at: string;
};

export type RecipeContent = {
  title: string;
  description: string;
  prepTime: string;
  cookTime: string;
  servings: number;
  ingredients: {
    item: string;
    amount: string;
    unit: string;
  }[];
  instructions: string[];
  notes?: string;
};

export type CreateRecipePayload = {
  title: string;
  content: string;
  visibility: Visibility;
};

export type UpdateRecipePayload = Partial<CreateRecipePayload>;