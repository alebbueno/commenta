-- Commenta — Usuários administradores do painel
-- Execute após 004_license_sites.sql
--
-- Para tornar um usuário admin, insira o id na tabela admin_users:
--   insert into public.admin_users (user_id) select id from auth.users where email = 'seu-email@exemplo.com';

-- =============================================================================
-- 1. ADMIN_USERS (quem pode acessar /admin)
-- =============================================================================
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

comment on table public.admin_users is 'Usuários que podem acessar o painel administrativo /admin';

alter table public.admin_users enable row level security;

-- Apenas service_role pode ler/escrever; a API admin usa createAdminClient() para verificar
create policy "Service role full access admin_users"
  on public.admin_users for all
  to service_role
  using (true)
  with check (true);

grant all on public.admin_users to service_role;
