# Penne — Portfólio

Portfólio dos sites de casamento desenvolvidos pela Penne. Grid com um case
por casal; passar o mouse (ou focar/tocar) revela o nome do casal e o link
pro site ao vivo. Admin de cadastro em uma URL oculta, protegida por senha.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Vercel Blob para tudo: a lista de cases (`data/sites.json`) e os
  screenshots enviados pelo admin

## Rodando localmente

```bash
npm install
npm run dev
```

Sem `BLOB_READ_WRITE_TOKEN` configurado, o app usa um armazenamento em
memória (`lib/store.ts`) só pra desenvolvimento, já populado com os cases
de `lib/seed-data.ts` — as alterações feitas pelo admin somem ao
reiniciar o servidor, e o upload de imagem no admin é ignorado
silenciosamente.

Veja `.env.example` para as variáveis necessárias.

### Réplica de produção

Pra rodar localmente com os mesmos dados e configuração de produção:

```bash
npx vercel login   # só na primeira vez
npx vercel link    # só na primeira vez, escolher o projeto do portfólio
npm run env:pull   # gera .env.local com as env vars de produção
npm run dev
```

Atenção: com o `BLOB_READ_WRITE_TOKEN` de produção, o app local lê e
**escreve** no mesmo Blob store de produção — qualquer alteração feita pelo
admin local aparece no site publicado.

## Admin

Acesse `/<ADMIN_PATH>` (o valor da env var, não tem link em lugar nenhum do
site). Sem sessão válida, redireciona pra `/<ADMIN_PATH>/login`. A rota
interna `/admin-internal` é bloqueada diretamente — só é alcançada através do
`ADMIN_PATH` correto.

## Deploy na Vercel

1. Conectar este repositório a um projeto na Vercel.
2. Adicionar um **Blob store** ao projeto (`vercel blob create-store <nome>
   --access public`) — isso injeta `BLOB_READ_WRITE_TOKEN`
   automaticamente.
3. Definir manualmente: `ADMIN_PATH` (um slug não-óbvio), `ADMIN_PASSWORD` e
   `SESSION_SECRET` (string aleatória longa).
4. Popular os cases iniciais rodando `npm run seed` com
   `BLOB_READ_WRITE_TOKEN` de produção no ambiente (ex. via
   `vercel env pull .env.production.local` e ajustando o script), ou
   cadastrando manualmente pelo admin em produção.

## Screenshots dos sites

Cada case tem duas capturas, feitas automaticamente a partir do `liveUrl`:

- `imageUrl` — screenshot vertical da home (1280x1600), usado no mobile;
- `fullPageImageUrl` — página inteira em desktop (1440px de largura), usada
  no fundo da home no desktop: aparece quando o mouse para sobre o nome do
  casal e desce devagar pelo site.

```bash
npx playwright install chromium   # só na primeira vez
npm run capture-screenshots
```

Isso **grava no Blob de produção**: sobe as duas capturas de cada case e
atualiza o `sites.json`. Também dá pra enviar um screenshot vertical manual
pelo formulário do admin — o upload manual tem prioridade até rodar o script
de novo.

Pra testar só localmente, sem tocar no Blob:

```bash
npm run capture-screenshots -- --local
```

As capturas de página inteira vão pra `public/previews/` (fora do git) e o
`next dev` passa a usá-las nos cases que ainda não têm `fullPageImageUrl`.

Sites que rolam dentro de um container próprio (em vez da página) saem só
com a primeira dobra na captura de página inteira.
