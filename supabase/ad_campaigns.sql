-- Execute este arquivo no SQL Editor do Supabase em projetos já existentes.
create table if not exists ad_campaigns (
  id uuid primary key default gen_random_uuid(), sponsor_name text not null,
  contact_email text not null, title text not null, description text,
  image_url text, mobile_image_url text, destination_url text not null,
  placement text not null default 'inline' check (placement in ('inline', 'sticky', 'popup')),
  article_slug text, starts_at timestamptz, ends_at timestamptz,
  approved boolean default false, active boolean default false,
  impressions bigint default 0, clicks bigint default 0,
  created_at timestamptz default now(), updated_at timestamptz default now()
);

alter table ad_campaigns enable row level security;
drop policy if exists "public read active campaigns" on ad_campaigns;
drop policy if exists "public submit campaigns" on ad_campaigns;
drop policy if exists "admin all" on ad_campaigns;
create policy "public read active campaigns" on ad_campaigns for select using (
  approved = true and active = true and (starts_at is null or starts_at <= now()) and (ends_at is null or ends_at >= now())
);
create policy "public submit campaigns" on ad_campaigns for insert with check (approved = false and active = false);
create policy "admin all" on ad_campaigns for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

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
create index if not exists idx_ad_campaigns_delivery on ad_campaigns(approved, active, placement, starts_at, ends_at);
