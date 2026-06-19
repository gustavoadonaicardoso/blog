-- =============================================================
-- Vórtice Blog — Schema Supabase
-- Execute no SQL Editor do seu projeto Supabase
-- =============================================================

-- posts
create table posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text,
  published boolean default false,
  is_sponsored boolean default false,
  sponsor_name text,
  sponsor_url text,
  sponsor_badge text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- contact_messages
create table contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  read boolean default false,
  created_at timestamptz default now()
);

-- sponsor_interests
create table sponsor_interests (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  email text not null,
  message text,
  website text,
  read boolean default false,
  created_at timestamptz default now()
);

-- =============================================================
-- Row Level Security
-- =============================================================

-- posts: públicos somente leitura para publicados
alter table posts enable row level security;
create policy "public read published" on posts
  for select using (published = true);
create policy "admin all" on posts
  for all using (auth.role() = 'authenticated');

-- contact_messages: qualquer um pode inserir, admin vê tudo
alter table contact_messages enable row level security;
create policy "admin all" on contact_messages
  for all using (auth.role() = 'authenticated');
create policy "insert only" on contact_messages
  for insert with check (true);

-- sponsor_interests: qualquer um pode inserir, admin vê tudo
alter table sponsor_interests enable row level security;
create policy "admin all" on sponsor_interests
  for all using (auth.role() = 'authenticated');
create policy "insert only" on sponsor_interests
  for insert with check (true);

-- =============================================================
-- Índices úteis
-- =============================================================
create index if not exists idx_posts_slug on posts(slug);
create index if not exists idx_posts_published on posts(published, created_at desc);
create index if not exists idx_contact_messages_read on contact_messages(read, created_at desc);
create index if not exists idx_sponsor_interests_read on sponsor_interests(read, created_at desc);
