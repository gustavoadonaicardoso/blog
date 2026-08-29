-- Execute uma vez no SQL Editor para habilitar imagens de destaque nos posts existentes.
alter table posts add column if not exists image_url text;
alter table posts add column if not exists image_alt text;

-- Bucket público: as imagens precisam ser acessíveis por leitores e redes sociais.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'post-images',
  'post-images',
  true,
  8388608,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update set
  public = true,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "admin upload post images" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'post-images');
create policy "admin update post images" on storage.objects
  for update to authenticated
  using (bucket_id = 'post-images')
  with check (bucket_id = 'post-images');
create policy "admin delete post images" on storage.objects
  for delete to authenticated
  using (bucket_id = 'post-images');
