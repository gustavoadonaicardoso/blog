-- Execute uma vez no SQL Editor para habilitar os banners rotativos da página inicial.
create table if not exists home_banners (
  id uuid primary key default gen_random_uuid(),
  title text check (title is null or char_length(title) between 2 and 120),
  image_url text not null,
  mobile_image_url text,
  image_alt text not null check (char_length(image_alt) between 2 and 180),
  destination_url text not null,
  display_seconds smallint not null default 7 check (display_seconds between 3 and 30),
  locale text not null default 'pt-BR' check (locale in ('pt-BR', 'es', 'en')),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table home_banners enable row level security;
drop policy if exists "public read active home banners" on home_banners;
create policy "public read active home banners" on home_banners
  for select using (active = true);
drop policy if exists "admin all home banners" on home_banners;
create policy "admin all home banners" on home_banners
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
alter table home_banners add column if not exists locale text;
update home_banners set locale = 'pt-BR' where locale is null;
alter table home_banners alter column locale set default 'pt-BR';
alter table home_banners alter column locale set not null;
alter table home_banners drop constraint if exists home_banners_locale_check;
alter table home_banners add constraint home_banners_locale_check check (locale in ('pt-BR', 'es', 'en'));

create index if not exists idx_home_banners_active on home_banners(active, created_at desc);
create index if not exists idx_home_banners_active_locale on home_banners(active, locale, created_at desc);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('home-banners', 'home-banners', true, 8388608, array['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
on conflict (id) do update set public = true, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "admin upload home banners" on storage.objects;
create policy "admin upload home banners" on storage.objects
  for insert to authenticated with check (bucket_id = 'home-banners');
drop policy if exists "admin delete home banners" on storage.objects;
create policy "admin delete home banners" on storage.objects
  for delete to authenticated using (bucket_id = 'home-banners');

-- Compatibilidade para instalações que criaram a primeira versão da tabela.
alter table home_banners alter column title drop not null;
alter table home_banners drop constraint if exists home_banners_title_check;
alter table home_banners add constraint home_banners_title_check check (title is null or char_length(title) between 2 and 120);
