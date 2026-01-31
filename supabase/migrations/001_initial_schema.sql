-- Commenta — Tabelas e permissões iniciais (Supabase)
-- Execute no SQL Editor do Supabase Dashboard ou via CLI: supabase db push

-- =============================================================================
-- 1. EXTENSÕES (se necessário)
-- =============================================================================
-- create extension if not exists "uuid-ossp";

-- =============================================================================
-- 2. TABELA PROFILES (perfil do usuário + plano + Stripe)
-- =============================================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  plan text not null default 'free' check (plan in ('free', 'pro')),
  stripe_customer_id text,
  stripe_subscription_id text,
  stripe_subscription_status text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'Perfil do usuário (auth) + plano Commenta + IDs Stripe';
comment on column public.profiles.plan is 'free | pro';
comment on column public.profiles.stripe_subscription_status is 'active | canceled | past_due | etc.';

-- Índices
create index if not exists profiles_stripe_customer_id_idx on public.profiles (stripe_customer_id);
create index if not exists profiles_plan_idx on public.profiles (plan);

-- =============================================================================
-- 3. TRIGGER: criar profile ao cadastrar usuário (auth.users)
-- =============================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'email',
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do update set
    email = coalesce(excluded.email, profiles.email),
    full_name = coalesce(excluded.full_name, profiles.full_name),
    avatar_url = coalesce(excluded.avatar_url, profiles.avatar_url),
    updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =============================================================================
-- 4. TRIGGER: atualizar updated_at em profiles
-- =============================================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- =============================================================================
-- 5. ROW LEVEL SECURITY (RLS)
-- =============================================================================
alter table public.profiles enable row level security;

-- Política: usuário autenticado pode ler apenas o próprio perfil
create policy "Users can read own profile"
  on public.profiles
  for select
  using (auth.uid() = id);

-- Política: usuário autenticado pode atualizar apenas o próprio perfil
create policy "Users can update own profile"
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Política: insert é feito pelo trigger (handle_new_user) com security definer,
-- então o usuário não precisa de policy de insert. Se quiser permitir upsert
-- manual pelo app (ex.: após OAuth), pode adicionar:
create policy "Users can insert own profile"
  on public.profiles
  for insert
  with check (auth.uid() = id);

-- Política para service role / webhooks: permitir que backend atualize
-- stripe_* e plan (via service key ou função definer). Para isso, use
-- uma função com security definer chamada pelo backend, ou grant direto.
-- Aqui não damos policy para "todos" — o app usa o JWT do usuário.
-- Para Stripe webhook atualizar subscription, crie uma Edge Function ou
-- API route que use service_role e faça update em profiles.

-- =============================================================================
-- 6. (OPCIONAL) TABELA SUBSCRIPTIONS — histórico de assinaturas Stripe
-- =============================================================================
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  stripe_subscription_id text unique,
  stripe_price_id text,
  status text not null,
  current_period_start timestamptz,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.subscriptions is 'Histórico/estado das assinaturas Stripe por usuário';

create index if not exists subscriptions_user_id_idx on public.subscriptions (user_id);
create index if not exists subscriptions_stripe_subscription_id_idx on public.subscriptions (stripe_subscription_id);

alter table public.subscriptions enable row level security;

create policy "Users can read own subscriptions"
  on public.subscriptions
  for select
  using (auth.uid() = user_id);

-- Inserções/atualizações em subscriptions devem ser feitas pelo backend (Stripe webhook)
-- com service_role ou função security definer. Não damos insert/update para usuário.

-- =============================================================================
-- 7. GRANTS (acesso ao schema public para roles do Supabase)
-- =============================================================================
grant usage on schema public to anon, authenticated;
grant select, insert, update on public.profiles to authenticated;
grant select on public.subscriptions to authenticated;

-- Para o trigger que insere em profiles (roda como definer), já tem acesso.
-- O role 'service_role' tem acesso total; anon/authenticated seguem as policies.
grant all on public.profiles to service_role;
grant all on public.subscriptions to service_role;
