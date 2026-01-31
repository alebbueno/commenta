# Configuração Stripe — Commenta PRO

Como criar os produtos e preços na Stripe para assinatura **Brasil (BRL)** e **Internacional (USD)**, mensal e anual, com opção de parcelamento no Brasil.

---

## 1. Preços desejados

| Região   | Mensal   | Anual     | Parcelamento (Brasil) |
|----------|----------|-----------|------------------------|
| Brasil   | R$ 29,90 | R$ 299,00 | Sim (cartão)           |
| Internacional | $ 29,90 | $ 299,00 | —                      |

---

## 2. Criar produto e preços na Stripe

1. Acesse **Stripe Dashboard** → **Products** → **Add product**.
2. Crie **um produto** (ou dois, se quiser separar Brasil/Internacional):
   - **Name:** Commenta PRO
   - **Description:** Plugin de feedback visual para WordPress. Acesso completo, usuários ilimitados, sem branding.

### 2.1 Preços no mesmo produto (recomendado)

No produto **Commenta PRO**, adicione **4 preços**:

| Nome (interno)     | Valor  | Moeda | Tipo     | ID (copiar)   |
|--------------------|--------|--------|----------|---------------|
| PRO Brasil Mensal  | 29,90  | BRL    | Recurring / Monthly  | `STRIPE_PRICE_BR_MONTHLY`  |
| PRO Brasil Anual   | 299,00 | BRL    | Recurring / Yearly   | `STRIPE_PRICE_BR_ANNUAL`   |
| PRO US Mensal      | 29.90  | USD    | Recurring / Monthly  | `STRIPE_PRICE_US_MONTHLY`  |
| PRO US Anual       | 299.00 | USD    | Recurring / Yearly   | `STRIPE_PRICE_US_ANNUAL`   |

**Como criar cada preço:**
- No produto → **Add another price**.
- **Pricing model:** Standard pricing.
- **Price:** valor (ex.: 29.90).
- **Billing period:** Monthly ou Yearly.
- **Currency:** BRL (Brasil) ou USD (Internacional).
- Salve e copie o **Price ID** (começa com `price_...`) para o `.env`.

---

## 3. Variáveis de ambiente

No `.env.local` (ou produção), defina:

```env
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PRICE_BR_MONTHLY=price_xxx
STRIPE_PRICE_BR_ANNUAL=price_xxx
STRIPE_PRICE_US_MONTHLY=price_xxx
STRIPE_PRICE_US_ANNUAL=price_xxx
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## 4. Parcelamento no Brasil (cartão)

Para permitir **parcelar no cartão** em BRL:

1. **Stripe Dashboard** → **Settings** → **Payment methods** → **Cards**.
2. Verifique se **Brazil** está habilitado e se há opções de installments (parcelamento) para o seu tipo de conta.
3. No **Checkout**, a Stripe exibe automaticamente opções de parcelamento quando o cliente paga em BRL com cartão brasileiro (ex.: “parcelar em até 12x”), desde que sua conta Stripe tenha essa funcionalidade ativada para o país.

Se a sua conta não tiver parcelamento habilitado, o cliente ainda pode pagar à vista (R$ 299,00 no cartão). Para parcelamento nativo, consulte a documentação da Stripe para Brasil ou o suporte Stripe.

---

## 5. Fluxo no site

- **LP (landing):** A seção de preços usa o idioma (PT = Brasil/R$, EN = Internacional/USD). Os valores exibidos vêm de `pricingByLocale`. O CTA “Assinar” leva para `/login?next=/dashboard`.
- **Dashboard:** O usuário escolhe **Mensal** ou **Anual** e clica em “Assinar PRO”. O front envia `interval` e `locale` para `POST /api/stripe/checkout`, que escolhe o Price ID correto (BR ou US, mensal ou anual) e redireciona para o Stripe Checkout.
- **Webhook:** Ao concluir o pagamento (`checkout.session.completed`), o webhook atualiza o perfil para `plan = pro` e cria a licença.

---

## 6. Webhook no Stripe

1. **Developers** → **Webhooks** → **Add endpoint**.
2. **URL:** `https://seu-dominio.com/api/stripe/webhook`.
3. **Eventos:** marque `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`.
4. Copie o **Signing secret** (`whsec_...`) para `STRIPE_WEBHOOK_SECRET`.

---

## 6.1 Teste local — STRIPE_WEBHOOK_SECRET

Para testar o webhook na máquina local, use o **Stripe CLI** para encaminhar eventos ao seu `localhost`:

1. Instale o Stripe CLI (se ainda não tiver):  
   [Stripe CLI – instalação](https://stripe.com/docs/stripe-cli#install)

2. Faça login:  
   `stripe login`

3. Com o app rodando (`npm run dev`), em **outro terminal** execute:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

4. O CLI exibe uma linha como:
   ```text
   Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
   Copie esse valor e coloque no `.env.local`:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

5. Reinicie o servidor Next.js (ou recarregue as variáveis) e faça um checkout de teste; o webhook será recebido no seu ambiente local.

---

## 7. Resumo

| Onde       | O que fazer |
|------------|-------------|
| Stripe     | 1 produto, 4 preços (BR mensal/anual, US mensal/anual). Webhook apontando para `/api/stripe/webhook`. |
| .env       | `STRIPE_PRICE_BR_MONTHLY`, `STRIPE_PRICE_BR_ANNUAL`, `STRIPE_PRICE_US_MONTHLY`, `STRIPE_PRICE_US_ANNUAL`, `STRIPE_WEBHOOK_SECRET`. |
| LP         | Preços e CTA já configurados (PT = R$, EN = $). CTA “Assinar” → login → dashboard. |
| Dashboard  | Toggle Mensal/Anual + botão Assinar envia `interval` e `locale` para o checkout. |

Com isso, o pagamento fica com assinatura mensal e anual, em Real (Brasil) e Dólar (internacional), e o parcelamento no cartão em BRL depende da configuração da sua conta Stripe para Brasil.
