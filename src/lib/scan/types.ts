export type NormalizedProduct = {
  barcode: string;
  name: string;
  brand: string;
  image: string | null;
  nutri_score: string | null; // "a" | "b" | "c" | "d" | "e" | null
  nova_group: number | null;
  // Información nutricional por 100g
  nutrients?: {
    energy_kcal?: number;
    fat?: number;
    saturated_fat?: number;
    carbohydrates?: number;
    sugars?: number;
    fiber?: number;
    proteins?: number;
    salt?: number;
    sodium?: number;
  };
  // Ingredientes y aditivos
  ingredients_text?: string;
  additives_tags?: string[];
  allergens_tags?: string[];
  // Labels
  labels_tags?: string[];
  // Categorías
  categories_tags?: string[];
};

export type OffProductRaw = any;
