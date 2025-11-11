import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export type PageAssetRow = {
  page: string;
  asset_free: string | null;
  asset_premium: string | null;
};

export async function getAssetsMap() {
  const { data: rows, error } = await supabase
    .from('page_assets')
    .select('page, asset_free, asset_premium');

  if (error) throw error;

  const plan = (document.documentElement.dataset.theme as 'free' | 'premium') || 'free';
  const entries = (rows as PageAssetRow[] | null)?.map(r => [
    r.page,
    plan === 'premium' ? r.asset_premium ?? r.asset_free : r.asset_free,
  ]) as [string, string | null][];
  return new Map(entries || []);
}
