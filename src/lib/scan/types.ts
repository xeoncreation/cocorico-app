export type NormalizedProduct = {
  barcode: string;
  name: string;
  brand: string;
  image: string | null;
  nutri_score: string | null; // "a" | "b" | "c" | "d" | "e" | null
  nova_group: number | null;
};

export type OffProductRaw = any;
