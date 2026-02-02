# Autenticação e licenciamento do plugin Commenta

Este documento descreve as regras de planos (Free/Pro), onde o plano é armazenado, a validação antifraude e como a autenticação via token da dashboard deve ser implementada no futuro.

---

## 1. Planos e limites

| Recurso | Free | Pro |
|--------|------|-----|
| **Pins por site** | Até 3 páginas distintas com pins | Todas as páginas |
| **Respostas** | Não permitido | Ilimitadas |
| **Usuários** | 1 usuário permitido | Ilimitados |
| **Ferramentas** | Apenas Pin (Cursor + Pin) | Todas (Cursor, Pin, Retângulo) |

**Preço Pro:** R$ 29,90/mês ou R$ 269,90/ano.

---

## 2. Onde o plano é armazenado (WordPress)

- **Opções** (somente no backend, nunca expor ao frontend em claro):
  - `vf_plan`: `'free'` ou `'pro'`
  - `vf_license_token`: token recebido da dashboard (futuro); pode ficar vazio no Free
  - `vf_license_checksum`: checksum para anti-tamper (ver seção 4)

O plano **nunca** deve ser alterado por formulário público ou por opção editável na UI do plugin. A única forma de passar para Pro é via **validação de token** no endpoint `POST /vf/v1/license` (apenas administrador).

---

## 3. Endpoints da API

### GET `/vf/v1/plan`

- **Permissão:** usuário com permissão de uso do plugin (`check_manage_capability`).
- **Resposta:** objeto com limites atuais e contagens:
  - `plan`: `'free'` | `'pro'`
  - `max_pages_with_pins`: `3` ou `null` (ilimitado)
  - `max_users`: `1` ou `null`
  - `allow_replies`: `boolean`
  - `allowed_tools`: `['cursor','pin']` ou `['cursor','pin','rect']`
  - `pages_with_pins_count`: número de páginas que já têm pelo menos um pin
  - `users_count`: número de usuários permitidos

Usado pelo admin (Configurações, Dashboard) e para injetar no frontend via `wp_localize_script` (plan, allowReplies, allowedTools).

### POST `/vf/v1/license`

- **Permissão:** apenas `manage_options` (administrador).
- **Body (JSON):** `{ "token": "..." }`
- **Comportamento esperado (implementação futura):**
  1. Plugin envia o `token` para a **API da dashboard Commenta**.
  2. Dashboard valida o token (assinatura, expiração, site autorizado etc.) e devolve se o plano é `pro` (ou free).
  3. Se válido para Pro, o plugin grava `vf_plan = 'pro'`, `vf_license_token = token` e atualiza `vf_license_checksum` (ver seção 4).
  4. Se inválido ou expirado, não altera nada e retorna erro.

**Resposta:** `{ "success": true, "plan": "pro" }` ou `{ "success": false, "message": "..." }`.

---

## 4. Validação antifraude (anti-tamper)

Para dificultar que alguém altere manualmente a opção `vf_plan` no banco para `pro`:

1. **Checksum:** ao salvar o plano (apenas dentro de `validate_and_store_license` após validação do token), o plugin grava:
   - `vf_license_checksum = hash('sha256', plan + site_url() + LICENSE_SALT)`
   - `LICENSE_SALT` é uma constante no código (não exposta ao frontend).

2. **Leitura do plano:** em toda leitura de `get_plan()`:
   - Lê `vf_plan` e `vf_license_checksum`.
   - Recalcula o checksum esperado com o mesmo algoritmo.
   - Se `vf_license_checksum` for diferente do esperado, considera plano **Free** (possível adulteração).

Assim, alterar só `vf_plan` no banco não é suficiente; sem o token válido e o fluxo de validação, o checksum fica inconsistente e o plugin volta a se comportar como Free.

---

## 5. Token de teste (desenvolvimento)

Para testar a alteração de plano e as funcionalidades Pro **sem a dashboard**, o plugin aceita um **token de teste** apenas quando ele é **explicitamente habilitado** no `wp-config.php`. Sem essa configuração, nenhum token de teste é aceito (segurança mantida).

### 5.1 Como habilitar

Adicione **uma** das linhas abaixo no `wp-config.php` (antes do “That’s all, stop editing!”):

**Modo 1 – Token customizado (recomendado para staging/segurança)**  
Defina o valor exato que você usará no campo “Token da licença” nas Configurações. Só esse valor será aceito.

```php
define( 'VF_LICENSE_TEST_TOKEN', 'seu_token_secreto_aqui' );
```

Use um valor longo e difícil de adivinhar. Nas Configurações do plugin, cole exatamente `seu_token_secreto_aqui` e clique em “Validar licença”.

**Modo 2 – Token fixo de desenvolvimento**  
Habilita um token fixo do plugin (útil em ambiente local). O token é exibido na tela de Configurações quando esse modo está ativo.

```php
define( 'VF_LICENSE_TEST_TOKEN', true );
```

Nas Configurações, aparecerá uma dica com o token (ex.: `vf_pro_test_8f4a2c9e-4b1d-4e7a-9c3f-1d6b0e5a8f2c`). Use “Copiar” e depois “Validar licença”.

### 5.2 Segurança

- **Sem constante:** se `VF_LICENSE_TEST_TOKEN` **não** estiver definido no `wp-config.php`, nenhum token de teste é aceito. Quem não tem acesso ao servidor não pode ativar Pro por teste.
- **Modo 1:** o token fica só no servidor (wp-config). Quem não tem acesso ao arquivo não sabe o valor.
- **Modo 2:** o token fixo só é aceito quando a constante é `true`. Em produção, não defina essa constante (ou use Modo 1 com um token secreto).
- A comparação do token é feita com `hash_equals()` para evitar timing attacks.

### 5.3 Revalidação do token de teste (voltar para Free)

Quando a licença Pro foi ativada com **token de teste**, o plugin **revalida a cada leitura** do plano (`get_plan()` / `get_limits()`). Assim você pode testar a falta de validação:

1. Com `VF_LICENSE_TEST_TOKEN` definido no wp-config, valide o token na página Configurações → plano vira Pro.
2. **Remova** a constante do wp-config (ou comente a linha) ou **altere** o valor.
3. Recarregue qualquer página do admin (ou do site onde o plugin usa o plano). Na próxima leitura do plano, o plugin vê que o token de teste não está mais válido e **reverte automaticamente para Free**.

Ou seja: remover ou alterar o token no wp-config e recarregar a página já faz o plano voltar para Free. Não é preciso alterar o banco manualmente.

**Licenças reais (futuro):** quando a licença for validada pela dashboard Commenta, não usamos essa revalidação a cada carga; o plano permanece Pro até expiração/revogação tratada pela dashboard.

---

## 6. Fluxo de autenticação (implementação futura)

### 6.1 Onde o token vem

- O token será obtido na **dashboard Commenta** (produto futuro).
- O usuário assina o plano Pro, a dashboard gera um **token de licença** associado ao domínio/site e exibe para o usuário (ou envia por e-mail).
- O usuário cola esse token na tela de Configurações do plugin (campo “Token da licença”) e clica em “Validar licença”.

### 6.2 O que o plugin deve fazer ao validar

1. **Chamar a API da dashboard** (URL a definir, ex.: `https://dashboard.commenta.com.br/api/validate-license` ou similar):
   - Método: `POST`.
   - Body: por exemplo `{ "token": "<token>", "site_url": "<site_url>" }`.
   - Headers: `Content-Type: application/json` e, se a dashboard exigir, um API key do plugin.

2. **Resposta esperada da dashboard:**
   - **Válido (Pro):** `{ "valid": true, "plan": "pro" }` (ou equivalente).
   - **Inválido:** `{ "valid": false }` ou HTTP 4xx, com eventual mensagem de erro.

3. **No plugin (após resposta 200 e `valid === true`):**
   - Atualizar `vf_plan = 'pro'`.
   - Opcional: guardar `vf_license_token = token` (para revalidação periódica).
   - Calcular e gravar `vf_license_checksum` como na seção 4.
   - Retornar ao admin `{ "success": true, "plan": "pro" }`.

4. **Se a dashboard retornar inválido ou erro:**
   - Não alterar `vf_plan` nem checksum.
   - Retornar ao admin `{ "success": false, "message": "..." }` (mensagem amigável).

### 6.3 Revalidação periódica (opcional)

- Em cron ou no carregamento do admin, o plugin pode chamar a dashboard com `vf_license_token` para ver se a licença segue ativa.
- Se a dashboard indicar expirada ou revogada, o plugin pode forçar `vf_plan = 'free'` e limpar token/checksum, ou marcar “licença expirada” e continuar Pro até próximo check (conforme regra de negócio).

### 6.4 Segurança do token

- O token não deve ser exposto no frontend (não enviar em `vfSettings` para o browser).
- Apenas o backend WordPress deve armazenar e usar o token nas chamadas à dashboard.
- Preferir HTTPS em todas as chamadas à API da dashboard.

---

## 7. Resumo para implementação futura

1. **Dashboard Commenta:** gera token de licença por assinatura Pro, associado ao domínio/site.
2. **Plugin:** oferece campo “Token da licença” em Configurações e botão “Validar licença”.
3. **Plugin:** `POST /vf/v1/license` com `{ "token": "..." }` (apenas admin).
4. **Plugin (backend):** chama API da dashboard com token + `site_url`; se resposta “válido Pro”, grava `vf_plan`, token (opcional) e `vf_license_checksum`.
5. **Plugin:** em toda leitura de plano, valida checksum; se inconsistente, trata como Free.
6. **Frontend e admin:** continuam usando GET `/vf/v1/plan` e/ou dados injetados via `wp_localize_script` para exibir limites e bloquear/liberar recursos conforme o plano.

Com isso, a autenticação do plugin fica preparada para ser sempre feita **via token** fornecido pela dashboard, com validação server-side e proteção básica contra adulteração local (checksum).

---

## 8. Implementação na dashboard Commenta (feito)

A dashboard (Next.js) já implementa o lado servidor do fluxo:

### 8.1 Ao confirmar o pagamento (Stripe webhook)

- **Rota:** `POST /api/stripe/webhook`
- **Configuração:** no Stripe Dashboard → Developers → Webhooks, adicione o endpoint `https://seu-dominio.com/api/stripe/webhook` e use o **Signing secret** (`whsec_...`) em `STRIPE_WEBHOOK_SECRET`.
- **Eventos tratados:**
  - **`checkout.session.completed`:** atualiza `profiles` (plan = `pro`, stripe_customer_id, stripe_subscription_id, stripe_subscription_status) e cria uma linha em `licenses` com `license_key` gerada, se ainda não existir para o usuário.
  - **`customer.subscription.updated`:** se status for `active` ou `trialing`, mantém `plan = pro`; caso contrário, define `plan = free`.
  - **`customer.subscription.deleted`:** define `plan = free` e `stripe_subscription_status = canceled`.

Assim, ao concluir o checkout, o usuário vira Pro e recebe uma licença (chave exibida na página **Commenta PRO** do dashboard).

### 8.2 API de validação para o plugin

- **Rota:** `POST /api/validate-license`
- **Body (JSON):**
  - `token` (obrigatório): chave de licença copiada da dashboard.
  - `site_url` (recomendado): URL do site WordPress (ex.: `get_site_url()` ou `home_url()`). Quando enviado e o token for válido PRO, a dashboard **grava ou atualiza** o site na tabela `license_sites` (para histórico e controle de ativações).
  - `site_name` (opcional): nome do site (ex.: `get_bloginfo('name')`).
- **Resposta (200):**
  - Válido: `{ "valid": true, "plan": "pro" }`
  - Inválido: `{ "valid": false, "message": "..." }` (ex.: token inválido, licença revogada, plano não é Pro)

O plugin WordPress deve chamar essa URL (ex.: `https://dashboard.commenta.com.br/api/validate-license`) com o token que o usuário colou nas Configurações e o `site_url` do site. A dashboard consulta `licenses` e `profiles` (via `SUPABASE_SERVICE_ROLE_KEY`); se o plano for Pro, registra o site em `license_sites` e responde `valid: true`.

### 8.3 Variáveis de ambiente necessárias

- **`SUPABASE_SERVICE_ROLE_KEY`** — usada no webhook e na API de validação (leitura/escrita sem RLS). Obtenha em Supabase → Project Settings → API → service_role.
- **`STRIPE_WEBHOOK_SECRET`** — signing secret do endpoint de webhook no Stripe (obrigatório para o webhook).
