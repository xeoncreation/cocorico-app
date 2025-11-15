// @ts-nocheck - page_assets table not yet in Database type
import { supabaseServer } from "@/app/lib/supabase-server";

export type PageAssetRow = {
  page: string;
  asset_free: string | null;
  asset_premium: string | null;
};

export async function getAssetsMap(theme: "free" | "premium") {
  const supabase = supabaseServer();
  const { data: rows, error } = await supabase
    .from('page_assets')
    .select('page, asset_free, asset_premium');

  if (error) {
    console.error("Error fetching page_assets:", error);
    return new Map<string, string | null>();
  }

  const entries = (rows as PageAssetRow[] | null)?.map(r => [
    r.page,
    theme === 'premium' ? r.asset_premium ?? r.asset_free : r.asset_free,
  ]) as [string, string | null][];
  
  return new Map(entries || []);
}

