-- Example insertion for page_assets mapping free vs premium assets
-- Replace <PROJECT> with: dxhgpjrgvkxudetbmxuw

insert into public.page_assets (page, asset_free, asset_premium) 
values (
  'home',
  'https://dxhgpjrgvkxudetbmxuw.supabase.co/storage/v1/object/public/assets/free/home.gif',
  'https://dxhgpjrgvkxudetbmxuw.supabase.co/storage/v1/object/public/assets/premium/home_glass.mp4'
)
on conflict (page) 
do update set 
  asset_free = EXCLUDED.asset_free,
  asset_premium = EXCLUDED.asset_premium,
  updated_at = now();
