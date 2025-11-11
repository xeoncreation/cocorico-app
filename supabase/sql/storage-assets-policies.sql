-- Storage bucket policies for public assets bucket
-- Run in Supabase SQL editor (schema: storage)

-- Public read for assets bucket
create policy if not exists "public read assets"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'assets');

-- Authenticated users can upload into assets bucket
create policy if not exists "authenticated write assets"
on storage.objects for insert
to authenticated
with check (bucket_id = 'assets');

-- Authenticated users can update/rename/overwrite within assets bucket
create policy if not exists "authenticated update assets"
on storage.objects for update
to authenticated
using (bucket_id = 'assets')
with check (bucket_id = 'assets');
