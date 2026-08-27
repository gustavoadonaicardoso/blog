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

-- ad_campaigns: anúncios enviados por patrocinadores e aprovados pelo admin
create table ad_campaigns (
  id uuid primary key default gen_random_uuid(),
  sponsor_name text not null,
  contact_email text not null,
  title text not null,
  description text,
  image_url text,
  mobile_image_url text,
  destination_url text not null,
  placement text not null default 'top' check (placement in ('inline', 'top', 'bottom', 'sidebar', 'sticky', 'popup')),
  article_slug text,
  starts_at timestamptz,
  ends_at timestamptz,
  approved boolean default false,
  active boolean default false,
  impressions bigint default 0,
  clicks bigint default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- marketing_leads: contatos que autorizaram comunicações de marketing
create table marketing_leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  whatsapp text not null,
  marketing_consent boolean not null default false,
  consent_text text not null,
  consented_at timestamptz not null default now(),
  source text default 'newsletter_popup',
  unsubscribed_at timestamptz,
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

-- campanhas: visitantes enviam; somente campanhas aprovadas/ativas são públicas
alter table ad_campaigns enable row level security;
create policy "public read active campaigns" on ad_campaigns
  for select using (
    approved = true and active = true
    and (starts_at is null or starts_at <= now())
    and (ends_at is null or ends_at >= now())
  );
create policy "public submit campaigns" on ad_campaigns
  for insert with check (approved = false and active = false);
create policy "admin all" on ad_campaigns
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create or replace function record_ad_event(campaign_id uuid, event_type text)
returns void language plpgsql security definer set search_path = public as $$
begin
  if event_type = 'impression' then
    update ad_campaigns set impressions = impressions + 1 where id = campaign_id and approved = true and active = true;
  elsif event_type = 'click' then
    update ad_campaigns set clicks = clicks + 1 where id = campaign_id and approved = true and active = true;
  end if;
end;
$$;
grant execute on function record_ad_event(uuid, text) to anon, authenticated;

alter table marketing_leads enable row level security;
create policy "public subscribe" on marketing_leads
  for insert with check (marketing_consent = true and unsubscribed_at is null);
create policy "admin all" on marketing_leads
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- =============================================================
-- Índices úteis
-- =============================================================
create index if not exists idx_posts_slug on posts(slug);
create index if not exists idx_posts_published on posts(published, created_at desc);
create index if not exists idx_contact_messages_read on contact_messages(read, created_at desc);
create index if not exists idx_sponsor_interests_read on sponsor_interests(read, created_at desc);
create index if not exists idx_ad_campaigns_delivery on ad_campaigns(approved, active, placement, starts_at, ends_at);
create unique index if not exists idx_marketing_leads_email on marketing_leads(lower(email));
create index if not exists idx_marketing_leads_active on marketing_leads(unsubscribed_at, created_at desc);
