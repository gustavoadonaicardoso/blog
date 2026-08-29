-- Execute uma vez no SQL Editor para habilitar os banners rotativos da página inicial.
create table if not exists home_banners (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 2 and 120),
  image_url text not null,
  mobile_image_url text,
  image_alt text not null check (char_length(image_alt) between 2 and 180),
  destination_url text not null,
  display_seconds smallint not null default 7 check (display_seconds between 3 and 30),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table home_banners enable row level security;
create policy "public read active home banners" on home_banners
  for select using (active = true);
create policy "admin all home banners" on home_banners
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create index if not exists idx_home_banners_active on home_banners(active, created_at desc);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('home-banners', 'home-banners', true, 8388608, array['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
on conflict (id) do update set public = true, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

create policy "admin upload home banners" on storage.objects
  for insert to authenticated with check (bucket_id = 'home-banners');
create policy "admin delete home banners" on storage.objects
  for delete to authenticated using (bucket_id = 'home-banners');
