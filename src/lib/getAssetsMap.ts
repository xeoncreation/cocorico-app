// @ts-nocheck - page_assets columns just added, Database type not regenerated yet
import { supabaseServer } from "@/app/lib/supabase-server";

export type PageAssetRow = {
  page_name: string | null;
  asset_free: string | null;
  asset_premium: string | null;
};

export async function getAssetsMap(theme: "free" | "premium") {
  const supabase = supabaseServer();
  const { data: rows, error } = await supabase
    .from('page_assets')
    .select('page_name, asset_free, asset_premium')
    .not('page_name', 'is', null); // Solo rows con page_name

  if (error) {
    console.error("Error fetching page_assets:", error);
    return new Map<string, string | null>();
  }

  const entries = (rows as PageAssetRow[] | null)
    ?.filter(r => r.page_name) // Filtrar nulls
    ?.map(r => [
      r.page_name!,
      theme === 'premium' ? (r.asset_premium ?? r.asset_free) : r.asset_free,
    ]) as [string, string | null][];
  
  return new Map(entries || []);
}

