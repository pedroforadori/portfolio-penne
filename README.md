# Penne — Portfólio

Portfólio dos sites de casamento desenvolvidos pela Penne. Grid com um case
por casal; passar o mouse (ou focar/tocar) revela o nome do casal e o link
pro site ao vivo. Admin de cadastro em uma URL oculta, protegida por senha.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Redis (integração "Redis" do Vercel Marketplace, ex-Vercel KV) para os dados dos cases
- Vercel Blob para os screenshots enviados pelo admin

## Rodando localmente

```bash
npm install
npm run dev
```

Sem `KV_REST_API_URL`/`KV_REST_API_TOKEN` configurados, o app usa um
armazenamento em memória (`lib/store.ts`) só pra desenvolvimento — os dados
somem ao reiniciar o servidor. Sem `BLOB_READ_WRITE_TOKEN`, o upload de
imagem no admin é ignorado silenciosamente.

Veja `.env.example` para as variáveis necessárias. Um `.env.local` de
desenvolvimento já vem configurado com `ADMIN_PATH`, `ADMIN_PASSWORD` e
`SESSION_SECRET` de teste (não usar em produção).

## Admin

Acesse `/<ADMIN_PATH>` (o valor da env var, não tem link em lugar nenhum do
site). Sem sessão válida, redireciona pra `/<ADMIN_PATH>/login`. A rota
interna `/admin-internal` é bloqueada diretamente — só é alcançada através do
`ADMIN_PATH` correto.

## Deploy na Vercel

1. Conectar este repositório a um projeto na Vercel.
2. Adicionar a integração **Redis** (Marketplace) e **Blob** ao projeto —
   isso injeta `KV_REST_API_URL`, `KV_REST_API_TOKEN` e
   `BLOB_READ_WRITE_TOKEN` automaticamente.
3. Definir manualmente: `ADMIN_PATH` (um slug não-óbvio), `ADMIN_PASSWORD` e
   `SESSION_SECRET` (string aleatória longa).
4. Popular os cases iniciais rodando `npm run seed` com
   `KV_REST_API_URL`/`KV_REST_API_TOKEN` de produção no ambiente (ex. via
   `vercel env pull .env.production.local` e ajustando o script), ou
   cadastrando manualmente pelo admin em produção.
