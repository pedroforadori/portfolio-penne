import type { Metadata } from "next";
import Link from "next/link";
import { getPosts, postPath } from "@/lib/blog";
import { SITE_NAME, SITE_URL } from "@/lib/site-config";
import RollText from "@/components/home/RollText";

const BLOG_TITLE = "Blog: dicas para o site do casamento";
const BLOG_DESCRIPTION =
  "Dicas da Penne para montar o site do casamento: lista de presentes, confirmação de presença, convite digital e o que os convidados precisam saber.";

export const metadata: Metadata = {
  title: BLOG_TITLE,
  description: BLOG_DESCRIPTION,
  alternates: { canonical: "/blog" },
  openGraph: { url: "/blog", title: BLOG_TITLE, description: BLOG_DESCRIPTION },
  twitter: { title: BLOG_TITLE, description: BLOG_DESCRIPTION },
};

export default async function BlogPage() {
  const posts = await getPosts();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${SITE_URL}/blog#blog`,
    url: `${SITE_URL}/blog`,
    name: `${SITE_NAME} — ${BLOG_TITLE}`,
    description: BLOG_DESCRIPTION,
    inLanguage: "pt-BR",
    publisher: { "@id": `${SITE_URL}/#organization` },
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      url: `${SITE_URL}${postPath(post)}`,
      datePublished: post.publishedAt,
    })),
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
            href="/"
            className="penne-roll font-mono text-xs uppercase leading-[1.3] text-cream/70 hover:text-cream"
          >
            <RollText text="← Todos os casamentos" />
          </Link>
        </nav>
      </header>

      <main className="px-6 pb-16 sm:px-10">
        <h1 className="font-display text-[30vw] uppercase leading-[0.86] sm:text-[clamp(96px,16vw,260px)]">
          Blog
        </h1>
        <p className="mt-6 max-w-xl font-serif text-2xl italic leading-snug text-cream/80 sm:text-3xl">
          Dicas para montar o site do casamento, do convite à lista de presentes.
        </p>

        {posts.length === 0 && (
          <p className="mt-14 font-mono text-xs uppercase text-cream/60 sm:mt-20">
            Os primeiros posts chegam em breve.
          </p>
        )}
        <ol className="mt-14 border-t border-cream/10 sm:mt-20">
          {posts.map((post, index) => (
            <li key={post.slug} className="border-b border-cream/10">
              <Link
                href={postPath(post)}
                className="group grid gap-3 py-8 sm:grid-cols-[4rem_minmax(0,1fr)_minmax(0,24rem)] sm:gap-8 sm:py-10"
              >
                <span className="font-mono text-xs tabular-nums text-cream/55">
                  {String(index + 1).padStart(2, "0")}
                  {post.draft && <span className="ml-2 text-[#dba58c]">Rascunho</span>}
                </span>
                <span className="font-display text-3xl uppercase leading-[0.95] transition-colors group-hover:text-[#dba58c] sm:text-5xl">
                  {post.title}
                </span>
                <span className="flex flex-col gap-3 text-sm leading-relaxed text-cream/70 sm:text-base">
                  {post.description}
                  <span className="font-mono text-[11px] uppercase text-cream/55">
                    {post.readingMinutes} min de leitura
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </main>
    </div>
  );
}
