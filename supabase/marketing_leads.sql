-- Execute uma vez no SQL Editor do Supabase em projetos existentes.
create table if not exists marketing_leads (
  id uuid primary key default gen_random_uuid(), name text not null,
  email text not null, whatsapp text not null,
  marketing_consent boolean not null default false,
  consent_text text not null, consented_at timestamptz not null default now(),
  source text default 'newsletter_popup', unsubscribed_at timestamptz,
  created_at timestamptz default now()
);
alter table marketing_leads enable row level security;
drop policy if exists "public subscribe" on marketing_leads;
drop policy if exists "admin all" on marketing_leads;
create policy "public subscribe" on marketing_leads for insert with check (marketing_consent = true and unsubscribed_at is null);
create policy "admin all" on marketing_leads for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create unique index if not exists idx_marketing_leads_email on marketing_leads(lower(email));
create index if not exists idx_marketing_leads_active on marketing_leads(unsubscribed_at, created_at desc);
