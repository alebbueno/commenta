-- Commenta — Sincronizar email e nome no profile (OAuth/Google)
-- O trigger original usa só raw_user_meta_data; com Google o email pode estar em auth.users.email
-- e o nome em name, full_name ou given_name/family_name. Este migration ajusta e adiciona sync no UPDATE.

-- =============================================================================
-- 1. ATUALIZAR handle_new_user: usar auth.users.email e vários campos de nome
-- =============================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  p_email text;
  p_name text;
  p_avatar text;
begin
  -- Email: coluna auth.users.email é preenchida pelo Supabase (OAuth inclusive)
  p_email := coalesce(
    nullif(trim(new.raw_user_meta_data->>'email'), ''),
    new.email
  );
  -- Nome: Google envia "name" ou "full_name"; alguns providers usam given_name + family_name
  p_name := coalesce(
    nullif(trim(new.raw_user_meta_data->>'full_name'), ''),
    nullif(trim(new.raw_user_meta_data->>'name'), ''),
    nullif(trim(
      coalesce(new.raw_user_meta_data->>'given_name', '') || ' ' || coalesce(new.raw_user_meta_data->>'family_name', '')
    ), '')
  );
  -- Avatar: Google envia "picture", outros "avatar_url"
  p_avatar := coalesce(
    nullif(trim(new.raw_user_meta_data->>'avatar_url'), ''),
    nullif(trim(new.raw_user_meta_data->>'picture'), '')
  );

  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, p_email, p_name, p_avatar)
  on conflict (id) do update set
    email = coalesce(nullif(trim(excluded.email), ''), profiles.email),
    full_name = coalesce(nullif(trim(excluded.full_name), ''), profiles.full_name),
    avatar_url = coalesce(nullif(trim(excluded.avatar_url), ''), profiles.avatar_url),
    updated_at = now();
  return new;
end;
$$;

-- =============================================================================
-- 2. TRIGGER ON UPDATE: sincronizar profile quando auth.users for atualizado
-- (ex.: segundo login com OAuth quando o Supabase atualiza metadata)
-- =============================================================================
create or replace function public.sync_profile_from_auth()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  p_email text;
  p_name text;
  p_avatar text;
begin
  p_email := coalesce(
    nullif(trim(new.raw_user_meta_data->>'email'), ''),
    new.email
  );
  p_name := coalesce(
    nullif(trim(new.raw_user_meta_data->>'full_name'), ''),
    nullif(trim(new.raw_user_meta_data->>'name'), ''),
    nullif(trim(
      coalesce(new.raw_user_meta_data->>'given_name', '') || ' ' || coalesce(new.raw_user_meta_data->>'family_name', '')
    ), '')
  );
  p_avatar := coalesce(
    nullif(trim(new.raw_user_meta_data->>'avatar_url'), ''),
    nullif(trim(new.raw_user_meta_data->>'picture'), '')
  );

  update public.profiles
  set
    email = coalesce(nullif(trim(p_email), ''), profiles.email),
    full_name = coalesce(nullif(trim(p_name), ''), profiles.full_name),
    avatar_url = coalesce(nullif(trim(p_avatar), ''), profiles.avatar_url),
    updated_at = now()
  where id = new.id;
  return new;
end;
$$;

drop trigger if exists on_auth_user_updated on auth.users;
create trigger on_auth_user_updated
  after update on auth.users
  for each row
  when (
    old.email is distinct from new.email
    or old.raw_user_meta_data is distinct from new.raw_user_meta_data
  )
  execute function public.sync_profile_from_auth();

-- =============================================================================
-- 3. CORRIGIR PERFIS EXISTENTES: preencher email/nome a partir de auth.users
-- =============================================================================
update public.profiles p
set
  email = coalesce(nullif(trim(p.email), ''), u.email),
  full_name = coalesce(
    nullif(trim(p.full_name), ''),
    nullif(trim(u.raw_user_meta_data->>'full_name'), ''),
    nullif(trim(u.raw_user_meta_data->>'name'), ''),
    nullif(trim(
      coalesce(u.raw_user_meta_data->>'given_name', '') || ' ' || coalesce(u.raw_user_meta_data->>'family_name', '')
    ), '')
  ),
  avatar_url = coalesce(
    nullif(trim(p.avatar_url), ''),
    nullif(trim(u.raw_user_meta_data->>'avatar_url'), ''),
    nullif(trim(u.raw_user_meta_data->>'picture'), '')
  ),
  updated_at = now()
from auth.users u
where u.id = p.id
  and (p.email is null or p.email = '' or p.full_name is null or p.full_name = '');
