import type { NormalizedProduct, OffProductRaw } from "./types";

export default function normalizeOffProduct(prod: OffProductRaw): NormalizedProduct {
  const nutrients = prod.nutriments || {};
  
  return {
    barcode: prod.code ?? "",
    name: prod.product_name || prod.generic_name || "Producto desconocido",
    brand: prod.brands || "",
    image: prod.image_front_url || prod.image_url || null,
    nutri_score: prod.nutriscore_grade ?? prod.nutrition_grade_fr ?? null,
    nova_group: prod.nova_group ? Number(prod.nova_group) : null,
    nutrients: {
      energy_kcal: nutrients.energy_kcal_100g ?? nutrients["energy-kcal_100g"] ?? nutrients.energy_100g ? Math.round(nutrients.energy_100g * 0.239) : undefined,
      fat: nutrients.fat_100g ?? nutrients["fat_100g"],
      saturated_fat: nutrients["saturated-fat_100g"] ?? nutrients.saturated_fat_100g,
      carbohydrates: nutrients.carbohydrates_100g ?? nutrients["carbohydrates_100g"],
      sugars: nutrients.sugars_100g ?? nutrients["sugars_100g"],
      fiber: nutrients.fiber_100g ?? nutrients["fiber_100g"],
      proteins: nutrients.proteins_100g ?? nutrients["proteins_100g"],
      salt: nutrients.salt_100g ?? nutrients["salt_100g"],
      sodium: nutrients.sodium_100g ?? nutrients["sodium_100g"],
    },
    ingredients_text: prod.ingredients_text || undefined,
    additives_tags: prod.additives_tags || [],
    allergens_tags: prod.allergens_tags || [],
    labels_tags: prod.labels_tags || [],
    categories_tags: prod.categories_tags || [],
  };
}
