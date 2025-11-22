import type { NormalizedProduct, OffProductRaw } from "./types";

export default function normalizeOffProduct(prod: OffProductRaw): NormalizedProduct {
  return {
    barcode: prod.code ?? "",
    name: prod.product_name || prod.generic_name || "Producto desconocido",
    brand: prod.brands || "",
    image: prod.image_front_url || prod.image_url || null,
    nutri_score: prod.nutriscore_grade ?? prod.nutrition_grade_fr ?? null,
    nova_group: prod.nova_group ? Number(prod.nova_group) : null,
  };
}
