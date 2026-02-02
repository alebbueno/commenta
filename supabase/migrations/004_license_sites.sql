-- Commenta — Sites ativados por licença (gravação ao validar token PRO)
-- Execute após 003_plugin_releases_full.sql

-- =============================================================================
-- 1. LICENSE_SITES (sites onde o plugin PRO foi ativado com token válido)
-- =============================================================================
create table if not exists public.license_sites (
  id uuid primary key default gen_random_uuid(),
  license_id uuid not null references public.licenses (id) on delete cascade,
  site_url text not null,
  site_name text,
  first_validated_at timestamptz not null default now(),
  last_validated_at timestamptz not null default now(),
  unique (license_id, site_url)
);

comment on table public.license_sites is 'Sites onde a licença PRO foi validada (plugin envia token + site_url)';
comment on column public.license_sites.site_url is 'URL do site WordPress normalizada (ex: https://meusite.com)';
comment on column public.license_sites.site_name is 'Nome do site opcional enviado pelo plugin';

create index if not exists license_sites_license_id_idx on public.license_sites (license_id);
create index if not exists license_sites_site_url_idx on public.license_sites (site_url);
create index if not exists license_sites_last_validated_idx on public.license_sites (last_validated_at desc);

alter table public.license_sites enable row level security;

-- Leitura apenas pelo backend/dashboard; escrita apenas via service_role (API validate-license)
create policy "Service role full access license_sites"
  on public.license_sites for all
  to service_role
  using (true)
  with check (true);

grant select on public.license_sites to authenticated;
grant all on public.license_sites to service_role;

-- =============================================================================
-- 2. FUNÇÃO: upsert de site ao validar licença (preserva first_validated_at)
-- =============================================================================
create or replace function public.upsert_license_site(
  p_license_id uuid,
  p_site_url text,
  p_site_name text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.license_sites (license_id, site_url, site_name, first_validated_at, last_validated_at)
  values (p_license_id, lower(trim(p_site_url)), nullif(trim(p_site_name), ''), now(), now())
  on conflict (license_id, site_url) do update set
    last_validated_at = now(),
    site_name = coalesce(nullif(trim(excluded.site_name), ''), license_sites.site_name);
end;
$$;

grant execute on function public.upsert_license_site(uuid, text, text) to service_role;
comment on function public.upsert_license_site is 'Registra ou atualiza site ao validar token PRO; chamado pela API validate-license.';
