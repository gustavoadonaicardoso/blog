-- Execute uma vez no SQL Editor do Supabase.
create table if not exists library_downloads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  book_slug text not null,
  user_agent text,
  downloaded_at timestamptz not null default now()
);

alter table library_downloads enable row level security;
-- O endpoint usa a service role. Visitantes não acessam esta tabela diretamente.
create index if not exists idx_library_downloads_book on library_downloads(book_slug, downloaded_at desc);
create index if not exists idx_library_downloads_email on library_downloads(lower(email));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('library-books', 'library-books', false, 52428800, array['application/pdf'])
on conflict (id) do update set public = false, file_size_limit = 52428800, allowed_mime_types = array['application/pdf'];
