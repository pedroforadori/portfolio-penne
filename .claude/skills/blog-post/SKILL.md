---
name: blog-post
description: Escreve um rascunho de post para o blog da Penne (content/blog/*.mdx) e abre um PR para revisão. Use quando pedirem um post novo para o blog, ou na rotina semanal. Aceita argumentos opcionais tema=, palavra-chave=, cases=, tamanho=, branch=.
---

# Rascunho de post para o blog da Penne

A Penne cria sites de casamento sob medida. O blog (`/blog`) existe para captar
buscas de casais que estão organizando o casamento e levá-los aos cases e ao
WhatsApp. Cada post é um **rascunho**: o Pedro revisa, acrescenta experiência
real e só então publica. Nunca publique direto.

## Argumentos (todos opcionais)

Vêm em `$ARGUMENTS`, no formato `chave="valor"`:

- `tema`: assunto do post. Sem ele, use o primeiro item `[pendente]` de `content/blog/PAUTA.md`.
- `palavra-chave`: consulta principal de busca. Sem ela, a da pauta; se não houver, escolha a mais natural para o tema.
- `cases`: slugs dos cases para citar, separados por vírgula.
- `tamanho`: `curto` (600–900 palavras), `medio` (900–1300, padrão), `longo` (1300–1800).
- `branch`: nome do branch. Padrão `blog/<slug>`.

## Passo a passo

1. **Contexto.** Leia `content/blog/PAUTA.md`, todos os posts em `content/blog/*.mdx` (para não repetir tema e para escolher links internos) e os cases em `lib/seed-data.ts`. Só cite fatos de um case que estejam na descrição dele.
2. **Slug.** Minúsculo, sem acento, com a palavra-chave, curto. Confira se `content/blog/<slug>.mdx` não existe.
3. **Escreva** `content/blog/<slug>.mdx` começando por:
   ```mdx
   export const post = {
     title: "…",            // até ~65 caracteres, com a palavra-chave
     description: "…",      // 140–160 caracteres, vira a meta description
     publishedAt: "AAAA-MM-DD", // data de hoje
     keyword: "…",
     cases: ["slug"],
     draft: true,
   };
   ```
   O título já é o H1 da página: o texto começa direto no primeiro parágrafo, e as seções usam `##` e `###`.
4. **Marque o que é do Pedro** com comentários MDX (`<!-- -->` quebra o build):
   `{/* PENNE: … */}`. Use 2 a 4 marcações, onde a experiência real da Penne faz diferença: um print, como foi com um casal, uma dúvida que os casais costumam ter, como a Penne faz tal coisa. Não invente essas respostas.
5. **Atualize a pauta:** marque o item como `[rascunho PR #N]` depois de abrir o PR (ou acrescente o tema, se veio por argumento).
6. **Verifique:** `npm run lint` e `BLOB_READ_WRITE_TOKEN= npm run build` (sem o token, o build usa os cases do seed).
7. **PR:** crie o branch, faça o commit (mensagem em pt-BR, no estilo do `git log`) e rode `gh pr create` com o título `Blog: <título>` e este corpo:
   ```
   Rascunho do post "<título>" (palavra-chave: <kw>).

   Para publicar:
   - [ ] Conferir os fatos e o que foi dito sobre cada case
   - [ ] Preencher os trechos {/* PENNE: … */} (e apagar os comentários)
   - [ ] Imagens em public/blog/<slug>/, se houver
   - [ ] Ajustar publishedAt para o dia do merge
   - [ ] Tirar `draft: true`
   ```
   O preview da Vercel mostra o rascunho (com a marca "Rascunho") para revisar no navegador.

## Guia editorial

- **Para quem:** casais organizando o casamento, no celular. Português do Brasil, tom próximo e direto, falando com "vocês". Pode usar "pro"/"pra" com moderação.
- **Palavra-chave:** no título, no slug, no primeiro parágrafo e em pelo menos um `##`. Sem repetir à força.
- **Estrutura:** cada `##` responde a uma pergunta que o casal realmente faz. Listas e tabelas (GFM) quando ajudam a escanear.
- **Cases:** pelo menos um `<CaseCard slug="…" />` logo depois do parágrafo que cita o case. Só fatos que estão na descrição do case.
- **Links internos:** 1 a 3 links para outros posts (`[texto](/blog/slug)`) onde fizerem sentido.
- **CTA:** a página já termina com a chamada pro WhatsApp. Um `<WhatsAppCta mensagem="…" />` no meio do texto é opcional, e nunca no final.
- **Não pode:** números, preços, prazos ou estatísticas sem fonte; falar mal de concorrentes; prometer funcionalidades que a Penne não confirmou (use um `{/* PENNE: … */}`); enchimento ("neste artigo vamos ver…", conclusões que repetem o texto); título caça-clique.
- **Sem MDX inválido:** nada de `<` ou `{` soltos no texto, e nenhum `import` (os componentes já estão disponíveis).
