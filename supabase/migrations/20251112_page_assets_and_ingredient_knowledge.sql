-- 20251112_page_assets_and_ingredient_knowledge.sql
-- Minimal supporting tables with idempotent creation and seed

-- page_assets: minimal asset registry (key -> url)
create table if not exists public.page_assets (
  id uuid primary key default gen_random_uuid(),
  asset_key text unique not null,
  url text not null,
  created_at timestamptz default now()
);

-- ingredient_knowledge: minimal knowledge base per ingredient
create table if not exists public.ingredient_knowledge (
  id uuid primary key default gen_random_uuid(),
  ingredient text unique not null,
  info jsonb not null default '{}',
  created_at timestamptz default now()
);

-- Optional: enable RLS (read-only to anon/auth) if needed later
-- alter table public.page_assets enable row level security;
-- alter table public.ingredient_knowledge enable row level security;

-- Seed 1 row if table is empty (safe, idempotent)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.page_assets) THEN
    INSERT INTO public.page_assets (asset_key, url)
    VALUES ('example-banner', '/branding/banner-home.png');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.ingredient_knowledge) THEN
    INSERT INTO public.ingredient_knowledge (ingredient, info)
    VALUES ('tomate', jsonb_build_object('calorias', 18, 'descripcion', 'Fuente de vitaminas A y C'));
  END IF;
END $$;
