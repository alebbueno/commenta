-- Commenta — Tabela de releases do plugin (completa para cadastro futuro)
-- Execute após 002_pro_licenses_support.sql
--
-- Como cadastrar novos releases depois:
-- 1. Supabase Dashboard → Table Editor → plugin_versions → Insert row
-- 2. Preencha: version (ex: 1.0.2), release_date, description, changelog_text, download_url, file_name, is_prerelease, release_channel (stable|beta|alpha)
-- 3. Opcional: changelog_url (link para página de changelog)

-- =============================================================================
-- 1. NOVAS COLUNAS EM PLUGIN_VERSIONS (para cadastro completo de releases)
-- =============================================================================
alter table public.plugin_versions
  add column if not exists description text,
  add column if not exists file_name text,
  add column if not exists release_channel text default 'stable' check (release_channel in ('stable', 'beta', 'alpha'));

comment on column public.plugin_versions.description is 'Descrição / release notes curtas da versão';
comment on column public.plugin_versions.file_name is 'Nome do arquivo para download (ex: commenta-pro-1.0.1.zip)';
comment on column public.plugin_versions.release_channel is 'stable | beta | alpha';

-- Índice para filtrar por canal
create index if not exists plugin_versions_release_channel_idx on public.plugin_versions (release_channel);

-- =============================================================================
-- 2. REMOVER SEED ANTIGO 1.0.0 (opcional: substituir por 1.0.1)
-- =============================================================================
delete from public.plugin_versions where version = '1.0.0';

-- =============================================================================
-- 3. INSERIR VERSÃO DE PRODUÇÃO v1.0.1
-- =============================================================================
insert into public.plugin_versions (
  version,
  release_date,
  description,
  changelog_text,
  changelog_url,
  download_url,
  file_name,
  is_prerelease,
  release_channel
) values (
  '1.0.1',
  '2025-01-31',
  'Primeira versão estável do Commenta PRO. Inclui todas as ferramentas visuais (pins, setas, círculos, áreas), dashboard completo, usuários ilimitados e remoção de branding. Compatível com WordPress 6.0+.',
  '- Lançamento inicial do Commenta PRO
- Ferramentas visuais: pins, setas, círculos e áreas destacadas
- Dashboard com listagem de comentários e tarefas
- Suporte a múltiplos usuários no mesmo projeto
- Remoção total de branding para assinantes PRO
- Integração com temas WordPress modernos',
  null,
  null,
  'commenta-pro-1.0.1.zip',
  false,
  'stable'
) on conflict (version) do update set
  description = excluded.description,
  changelog_text = excluded.changelog_text,
  file_name = excluded.file_name,
  release_channel = excluded.release_channel,
  release_date = excluded.release_date;

-- =============================================================================
-- 4. INSERIR VERSÃO BETA v1.1.0-beta
-- =============================================================================
insert into public.plugin_versions (
  version,
  release_date,
  description,
  changelog_text,
  changelog_url,
  download_url,
  file_name,
  is_prerelease,
  release_channel
) values (
  '1.1.0-beta',
  '2025-01-31',
  'Versão beta com melhorias no desempenho e correções. Inclui preview de notificações por e-mail e ajustes na toolbar. Use apenas em ambiente de teste.',
  '- Melhorias de desempenho na renderização de comentários
- Ajustes na toolbar de anotações
- Preview: notificações por e-mail (em desenvolvimento)
- Correções de acessibilidade
- Compatibilidade com WordPress 6.4',
  null,
  null,
  'commenta-pro-1.1.0-beta.zip',
  true,
  'beta'
) on conflict (version) do update set
  description = excluded.description,
  changelog_text = excluded.changelog_text,
  file_name = excluded.file_name,
  release_channel = excluded.release_channel,
  release_date = excluded.release_date;
