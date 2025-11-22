import { NextResponse, NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import normalizeOffProduct from "@/lib/scan/normalizeOffProduct";
import computeCocoricoScore from "@/lib/scan/computeCocoricoScore";
import type { NormalizedProduct } from "@/lib/scan/types";

const OFF_BASE_URL = "https://world.openfoodfacts.org/api/v0/product";

type ProductRow = NormalizedProduct & {
  cocorico_score: number;
  raw_off: any;
  created_at?: string;
};

export async function GET(
  _req: NextRequest,
  { params }: { params: { barcode: string } }
) {
  const barcode = params.barcode?.trim();

  if (!barcode) {
    return NextResponse.json(
      { error: "MISSING_BARCODE" },
      { status: 400 }
    );
  }

  // 1) Buscar en caché Supabase (solo si está configurado)
  if (supabaseAdmin) {
    const { data: cached, error: cacheError } = await supabaseAdmin
      .from("products")
      .select("*")
      .eq("barcode", barcode)
      .maybeSingle<ProductRow>();

    if (cacheError) {
      console.error("Supabase cache error:", cacheError);
    }

    if (cached) {
      return NextResponse.json(cached);
    }
  }

  // 2) Llamar a Open Food Facts
  const res = await fetch(`${OFF_BASE_URL}/${barcode}.json`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: "OFF_REQUEST_FAILED" },
      { status: 502 }
    );
  }

  const json = await res.json();

  if (!json || json.status !== 1 || !json.product) {
    return NextResponse.json(
      { error: "PRODUCT_NOT_FOUND" },
      { status: 404 }
    );
  }

  const prod = json.product;

  // 3) Normalizar datos
  const normalized: NormalizedProduct = normalizeOffProduct(prod);

  // 4) Calcular Cocorico Score
  const cocorico_score = computeCocoricoScore(normalized);

  const finalData: ProductRow = {
    ...normalized,
    cocorico_score,
    raw_off: prod,
  };

  // 5) Guardar en Supabase (solo si está configurado)
  if (supabaseAdmin) {
    const { error: upsertError } = await supabaseAdmin
      .from("products")
      .upsert(finalData, { onConflict: "barcode" });

    if (upsertError) {
      console.error("Supabase upsert error:", upsertError);
    }
  }

  return NextResponse.json(finalData);
}
