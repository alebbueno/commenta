-- Commenta — Licenças PRO, versões do plugin e suporte (tickets)
-- Execute após 001_initial_schema.sql

-- =============================================================================
-- 1. LICENSES (chave de licença por usuário PRO)
-- =============================================================================
create table if not exists public.licenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade unique,
  license_key text not null unique,
  status text not null default 'active' check (status in ('active', 'revoked')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.licenses is 'Chave de licença do plugin Commenta PRO por usuário';

create index if not exists licenses_user_id_idx on public.licenses (user_id);
create index if not exists licenses_license_key_idx on public.licenses (license_key);

alter table public.licenses enable row level security;

create policy "Users can read own license"
  on public.licenses for select
  using (auth.uid() = user_id);

-- Inserção/atualização de license apenas pelo backend (webhook Stripe ou função definer)
grant select on public.licenses to authenticated;
grant all on public.licenses to service_role;

-- Função: obter ou criar licença para o usuário atual (apenas se plan = 'pro')
create or replace function public.get_or_create_license()
returns table (license_key text, status text)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (select 1 from profiles where id = auth.uid() and plan = 'pro') then
    raise exception 'User is not on PRO plan';
  end if;
  if exists (select 1 from licenses where user_id = auth.uid()) then
    return query select l.license_key, l.status from licenses l where l.user_id = auth.uid();
    return;
  end if;
  insert into public.licenses (user_id, license_key)
  values (auth.uid(), replace(replace(encode(gen_random_bytes(24), 'base64'), '/', '_'), '+', '-'));
  return query select l.license_key, l.status from public.licenses l where l.user_id = auth.uid();
end;
$$;

grant execute on function public.get_or_create_license() to authenticated;

-- =============================================================================
-- 2. PLUGIN_VERSIONS (versões do plugin para download)
-- =============================================================================
create table if not exists public.plugin_versions (
  id uuid primary key default gen_random_uuid(),
  version text not null unique,
  release_date date,
  changelog_url text,
  changelog_text text,
  download_url text,
  is_prerelease boolean not null default false,
  created_at timestamptz not null default now()
);

comment on table public.plugin_versions is 'Versões do plugin Commenta para download (apenas PRO)';

create index if not exists plugin_versions_version_idx on public.plugin_versions (version);
create index if not exists plugin_versions_release_date_idx on public.plugin_versions (release_date desc);

alter table public.plugin_versions enable row level security;

-- Apenas usuários autenticados podem ler; inserção/update via service_role ou admin
create policy "Authenticated can read plugin versions"
  on public.plugin_versions for select
  to authenticated
  using (true);

grant select on public.plugin_versions to authenticated;
grant all on public.plugin_versions to service_role;

-- Seed: primeira versão do plugin (ajuste download_url e changelog_url no Supabase depois)
insert into public.plugin_versions (version, release_date, changelog_url, download_url, is_prerelease)
values (
  '1.0.0',
  current_date,
  null,
  null,
  false
) on conflict (version) do nothing;

-- =============================================================================
-- 3. SUPPORT_TICKETS (chamados de suporte)
-- =============================================================================
create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  subject text not null,
  status text not null default 'open' check (status in ('open', 'in_progress', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.support_tickets is 'Chamados de suporte (plano PRO)';

create index if not exists support_tickets_user_id_idx on public.support_tickets (user_id);
create index if not exists support_tickets_status_idx on public.support_tickets (status);

alter table public.support_tickets enable row level security;

create policy "Users can read own tickets"
  on public.support_tickets for select
  using (auth.uid() = user_id);

create policy "Users can insert own tickets"
  on public.support_tickets for insert
  with check (auth.uid() = user_id);

create policy "Users can update own tickets (limited)"
  on public.support_tickets for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

grant select, insert, update on public.support_tickets to authenticated;
grant all on public.support_tickets to service_role;

-- =============================================================================
-- 4. SUPPORT_TICKET_MESSAGES (mensagens do ticket)
-- =============================================================================
create table if not exists public.support_ticket_messages (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.support_tickets (id) on delete cascade,
  author_type text not null check (author_type in ('user', 'staff')),
  author_id uuid references public.profiles (id) on delete set null,
  body text not null,
  created_at timestamptz not null default now()
);

comment on table public.support_ticket_messages is 'Mensagens dos chamados (usuário e time)';
comment on column public.support_ticket_messages.author_type is 'user = cliente; staff = time Commenta';
comment on column public.support_ticket_messages.author_id is 'Null para staff (opcional)';

create index if not exists support_ticket_messages_ticket_id_idx on public.support_ticket_messages (ticket_id);

alter table public.support_ticket_messages enable row level security;

-- Usuário só vê mensagens dos próprios tickets
create policy "Users can read messages of own tickets"
  on public.support_ticket_messages for select
  using (
    exists (
      select 1 from public.support_tickets st
      where st.id = support_ticket_messages.ticket_id and st.user_id = auth.uid()
    )
  );

create policy "Users can insert messages on own tickets as user"
  on public.support_ticket_messages for insert
  with check (
    author_type = 'user'
    and auth.uid() = author_id
    and exists (
      select 1 from public.support_tickets st
      where st.id = ticket_id and st.user_id = auth.uid()
    )
  );

grant select, insert on public.support_ticket_messages to authenticated;
grant all on public.support_ticket_messages to service_role;

-- =============================================================================
-- 5. TRIGGER updated_at em licenses
-- =============================================================================
drop trigger if exists licenses_updated_at on public.licenses;
create trigger licenses_updated_at
  before update on public.licenses
  for each row execute function public.set_updated_at();

drop trigger if exists support_tickets_updated_at on public.support_tickets;
create trigger support_tickets_updated_at
  before update on public.support_tickets
  for each row execute function public.set_updated_at();
