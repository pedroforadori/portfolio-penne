import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatPostDate, getPost, getPosts, postPath } from "@/lib/blog";
import { SITE_NAME, SITE_URL, whatsappUrl } from "@/lib/site-config";
import RollText from "@/components/home/RollText";
import { testimonials } from "@/lib/testimonials";

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const post = await getPost((await params).slug);
  if (!post) return {};

  const { title, description, publishedAt, updatedAt, draft } = post.meta;
  const url = postPath(post.meta);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title,
      description,
      publishedTime: publishedAt,
      modifiedTime: updatedAt ?? publishedAt,
    },
    twitter: { title, description },
    ...(draft && { robots: { index: false, follow: false } }),
  };
}

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const { meta, Content } = post;
  const url = `${SITE_URL}${postPath(meta)}`;
  const related = (await getPosts()).filter((p) => p.slug !== meta.slug).slice(0, 2);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${url}#post`,
        headline: meta.title,
        description: meta.description,
        url,
        mainEntityOfPage: url,
        image: `${url}/opengraph-image`,
        datePublished: meta.publishedAt,
        dateModified: meta.updatedAt ?? meta.publishedAt,
        inLanguage: "pt-BR",
        keywords: meta.keyword,
        author: { "@id": `${SITE_URL}/#organization` },
        publisher: { "@id": `${SITE_URL}/#organization` },
        isPartOf: { "@id": `${SITE_URL}/blog#blog` },
        ...(meta.cases?.length && {
          about: meta.cases.map((c) => ({ "@type": "WebPage", url: `${SITE_URL}/casamentos/${c}` })),
        }),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: SITE_NAME, item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
          { "@type": "ListItem", position: 3, name: meta.title, item: url },
        ],
      },
    ],
  };

  return (
    <div className="penne min-h-dvh bg-night text-cream">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <header className="flex items-start justify-between p-6 sm:p-10">
        {/* Espaço reservado pro logo */}
        <div aria-hidden className="h-[30px] w-24" />
        <nav className="flex items-center gap-6">
          <Link
            href="/blog"
            className="penne-roll font-mono text-xs uppercase leading-[1.3] text-cream/70 hover:text-cream"
          >
            <RollText text="← Blog" />
          </Link>
          {testimonials.length > 0 && (
            <Link
              href="/#avaliacoes"
              className="penne-roll font-mono text-xs uppercase leading-[1.3] text-cream/70 hover:text-cream"
            >
              <RollText text="Avaliações" />
            </Link>
          )}
        </nav>
      </header>

      <main className="px-6 pb-16 sm:px-10">
        <p className="font-mono text-[11px] uppercase text-cream/60">
          {meta.draft && <span className="mr-3 text-[#dba58c]">Rascunho</span>}
          {meta.readingMinutes} min de leitura
          {meta.updatedAt && <> · Atualizado em {formatPostDate(meta.updatedAt)}</>}
        </p>
        <h1 className="mt-3 max-w-[16ch] font-display text-[13vw] uppercase leading-[0.9] sm:text-[clamp(56px,7.5vw,120px)]">
          {meta.title}
        </h1>
        <p className="mt-6 max-w-2xl font-serif text-2xl italic leading-snug text-cream/80 sm:text-3xl">
          {meta.description}
        </p>

        <article className="mt-12 max-w-[65ch] border-t border-cream/10 pt-4 text-[17px] leading-relaxed text-cream/80 sm:mt-16 sm:text-lg">
          <Content />
        </article>

        <section className="mt-16 flex flex-col gap-5 border-t border-cream/10 pt-8 sm:mt-24 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="font-serif text-3xl italic leading-tight sm:text-5xl">
            Quer um site assim pro seu casamento?
          </h2>
          <a
            href={whatsappUrl(`Oi! Li "${meta.title}" no blog da Penne e quero um site para o meu casamento.`)}
            target="_blank"
            rel="noopener"
            className="penne-roll shrink-0 font-display text-2xl uppercase leading-none text-[#dba58c]"
          >
            <RollText text="Orçamento no WhatsApp ↗" />
          </a>
        </section>

        {related.length > 0 && (
          <section className="mt-12 border-t border-cream/10 pt-8 sm:mt-16">
            <h2 className="font-mono text-[11px] uppercase text-cream/60">Leia também</h2>
            <ul className="mt-6 grid gap-8 sm:grid-cols-2">
              {related.map((p) => (
                <li key={p.slug}>
                  <Link href={postPath(p)} className="group block">
                    <span className="block font-display text-3xl uppercase leading-[0.95] transition-colors group-hover:text-[#dba58c] sm:text-4xl">
                      {p.title} →
                    </span>
                    <span className="mt-3 block text-sm leading-relaxed text-cream/65">
                      {p.description}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
}
