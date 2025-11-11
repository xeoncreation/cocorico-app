-- Example insertion for page_assets mapping free vs premium assets
insert into public.page_assets (page, asset_free, asset_premium) values
('home',
 'https://<PROJECT>.supabase.co/storage/v1/object/public/assets/free/home.gif',
 'https://<PROJECT>.supabase.co/storage/v1/object/public/assets/premium/home_glass.mp4')
on conflict do nothing;
