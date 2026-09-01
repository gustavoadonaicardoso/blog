-- Vórtice Blog — traduções dos artigos
-- Execute este arquivo em projetos Supabase que já possuem a tabela posts.

alter table public.posts add column if not exists title_es text;
alter table public.posts add column if not exists excerpt_es text;
alter table public.posts add column if not exists content_es text;
alter table public.posts add column if not exists title_en text;
alter table public.posts add column if not exists excerpt_en text;
alter table public.posts add column if not exists content_en text;
