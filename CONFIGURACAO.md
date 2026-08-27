# Configuração e publicação — Vórtice

O blog é uma aplicação **Astro (SSR) + Supabase + Resend**, hospedada na **Vercel**.
Siga os passos abaixo uma vez para colocar tudo no ar.

---

## 1. Supabase (banco de dados + login do admin)

1. Crie uma conta em <https://supabase.com> e um novo projeto (plano free serve).
2. No menu **SQL Editor**, rode o conteúdo de [`supabase/schema.sql`](supabase/schema.sql) (cria as tabelas e as regras de acesso).
3. Em seguida rode [`supabase/seed.sql`](supabase/seed.sql) para inserir os 3 artigos de exemplo (opcional).
4. Crie o **usuário admin**: menu **Authentication > Users > Add user**, com o seu e-mail e uma senha. (É com esse e-mail/senha que você entra em `/admin`.)
5. Pegue as chaves em **Project Settings > API**:
   - `Project URL`  →  `SUPABASE_URL`
   - `anon public`  →  `SUPABASE_ANON_KEY`

Se o projeto Supabase já existia antes do gerenciador de anúncios, execute também
[`supabase/ad_campaigns.sql`](supabase/ad_campaigns.sql) uma única vez no **SQL Editor**.

Para ativar a captação de newsletter em um projeto existente, execute também
[`supabase/marketing_leads.sql`](supabase/marketing_leads.sql) uma única vez.

## Campanhas de anúncios

- Empresas enviam propostas em `/patrocinar`; elas entram como pendentes.
- O administrador revisa em `/admin/patrocinios` e pode aprovar, pausar ou revogar.
- O botão **Nova campanha** permite cadastrar e agendar campanhas diretamente.
- Formatos disponíveis: banner no artigo, faixa fixa inferior e pop-up após 5 segundos.
- Imagens são informadas por URL. Use sempre arquivos HTTPS hospedados em origem confiável.

## Newsletter, prospecção e cookies

- O pop-up público coleta nome, e-mail, WhatsApp e autorização de marketing.
- Os contatos ficam disponíveis em `/admin/leads` e podem ser exportados em CSV.
- Contatos cancelados não entram na exportação e podem ser gerenciados no admin.
- O aviso de cookies registra separadamente as preferências essenciais, de análise e marketing.

## 2. Resend (aviso por e-mail das mensagens de contato)

1. Crie uma conta em <https://resend.com>.
2. Em **API Keys**, gere uma chave  →  `RESEND_API_KEY`.
3. Defina o destinatário do aviso  →  `ADMIN_EMAIL` (seu e-mail).
4. Remetente (`EMAIL_FROM`): para testes use `Vórtice <onboarding@resend.dev>`.
   Para produção, verifique seu domínio no Resend e use algo como `Vórtice <contato@seudominio.com>`.

> Sem o Resend, o formulário de contato continua funcionando — as mensagens só
> aparecem no admin sem enviar o e-mail de aviso.

## 3. Rodar localmente

```bash
cp .env.example .env      # e preencha os valores reais
npm install
npm run dev               # http://localhost:4321  (admin em /admin)
```

## 4. Publicar na Vercel

> ⚠ A conta Vercel precisa estar **ativa** (sem suspensão / com método de pagamento).

1. Defina as variáveis de ambiente do projeto (uma vez):

   ```bash
   vercel link --yes --project blog-vortice
   vercel env add SUPABASE_URL production
   vercel env add SUPABASE_ANON_KEY production
   vercel env add RESEND_API_KEY production
   vercel env add EMAIL_FROM production
   vercel env add ADMIN_EMAIL production
   vercel env add SITE_URL production        # ex.: https://blog-vortice.vercel.app
   ```

   (Ou faça isso pela interface da Vercel em **Project > Settings > Environment Variables**.)

2. Faça o deploy de produção:

   ```bash
   vercel deploy --prod
   ```

Depois do primeiro deploy, atualize `SITE_URL` e o campo `site` em
[`astro.config.mjs`](astro.config.mjs) com o domínio final.

## 5. Logo

Coloque os arquivos reais da logo conforme o guia em
[`public/brand/LEIA-ME.md`](public/brand/LEIA-ME.md). O código apenas referencia
esses arquivos — não recria nenhuma logo.

---

## Resumo das variáveis de ambiente

| Variável             | Para que serve                                  |
| -------------------- | ----------------------------------------------- |
| `SUPABASE_URL`       | Endereço do projeto Supabase                    |
| `SUPABASE_ANON_KEY`  | Chave pública do Supabase                        |
| `RESEND_API_KEY`     | Envio do e-mail de aviso de novas mensagens     |
| `EMAIL_FROM`         | Remetente do aviso                              |
| `ADMIN_EMAIL`        | Para qual e-mail chega o aviso                  |
| `SITE_URL`           | URL pública (SEO, RSS, sitemap)                 |
