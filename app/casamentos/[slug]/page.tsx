import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSiteBySlug, getSites } from "@/lib/sites";
import { SITE_NAME, SITE_URL, whatsappUrl } from "@/lib/site-config";
import {
  caseDescription,
  caseMetaDescription,
  casePath,
  caseTitle,
  splitCouple,
} from "@/lib/case-copy";
import RollText from "@/components/home/RollText";

export const revalidate = 3600;

export async function generateStaticParams() {
  const sites = await getSites();
  return sites.map((site) => ({ slug: site.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/casamentos/[slug]">): Promise<Metadata> {
  const site = await getSiteBySlug((await params).slug);
  if (!site) return {};

  const title = caseTitle(site);
  const description = caseMetaDescription(site);
  return {
    title,
    description,
    alternates: { canonical: casePath(site) },
    openGraph: { type: "article", url: casePath(site), title, description },
    twitter: { title, description },
  };
}

export default async function CasePage({ params }: PageProps<"/casamentos/[slug]">) {
  const { slug } = await params;
  const sites = await getSites();
  const index = sites.findIndex((s) => s.slug === slug);
  if (index === -1) notFound();

  const site = sites[index];
  const next = sites[(index + 1) % sites.length];
  const { first, second } = splitCouple(site.couple);
  const accent = `color-mix(in oklab, ${site.color} 65%, white)`;
  const desktop = site.fullPage?.desktop ?? site.imageUrl;
  const mobile = site.fullPage?.mobile;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: `Site de casamento de ${site.couple}`,
        url: site.liveUrl,
        description: caseDescription(site),
        inLanguage: "pt-BR",
        ...(desktop && { image: new URL(desktop, SITE_URL).toString() }),
        creator: { "@id": `${SITE_URL}/#organization` },
        subjectOf: { "@type": "WebPage", url: `${SITE_URL}${casePath(site)}` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: SITE_NAME, item: SITE_URL },
          {
            "@type": "ListItem",
            position: 2,
            name: site.couple,
            item: `${SITE_URL}${casePath(site)}`,
          },
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
        <Link
          href="/"
          className="penne-roll font-mono text-xs uppercase leading-none text-cream/70 hover:text-cream"
        >
          <RollText text="← Todos os casamentos" />
        </Link>
      </header>

      <main className="px-6 pb-16 sm:px-10">
        <p className="font-mono text-[11px] uppercase text-cream/60">Site de casamento</p>
        <h1 className="mt-3 font-display text-[21vw] uppercase leading-[0.86] sm:text-[clamp(64px,13vw,220px)]">
          <span className="block">{first}</span>
          {second && (
            <span className="block">
              <span className="font-serif font-medium normal-case italic" style={{ color: accent }}>
                &amp;
              </span>{" "}
              {second}
            </span>
          )}
        </h1>

        <div className="mt-8 grid gap-8 sm:mt-12 lg:grid-cols-[minmax(0,32rem)_1fr] lg:items-end">
          <p className="text-base leading-relaxed text-cream/75 sm:text-lg">
            {caseDescription(site)}
          </p>
          <a
            href={site.liveUrl}
            target="_blank"
            rel="noopener"
            className="penne-roll justify-self-start font-display text-2xl uppercase leading-none lg:justify-self-end"
          >
            <RollText text="Ver o site ao vivo ↗" />
          </a>
        </div>

        {desktop && (
          <div className="mt-12 flex flex-col gap-6 sm:mt-16 sm:flex-row sm:items-end">
            <figure className="relative aspect-[16/10] overflow-hidden rounded-lg border border-cream/10 sm:flex-1">
              <Image
                src={desktop}
                alt={`Página inicial do site de casamento de ${site.couple} no computador`}
                fill
                sizes="(min-width: 640px) 75vw, 100vw"
                preload
                className="object-cover object-top"
              />
            </figure>
            {mobile && (
              <figure className="relative aspect-[390/844] w-3/5 shrink-0 self-center overflow-hidden rounded-xl border border-cream/10 sm:w-[18%] sm:self-auto sm:rounded-lg">
                <Image
                  src={mobile}
                  alt={`Página inicial do site de casamento de ${site.couple} no celular`}
                  fill
                  sizes="(min-width: 640px) 18vw, 60vw"
                  className="object-cover object-top"
                />
              </figure>
            )}
          </div>
        )}

        <section className="mt-16 flex flex-col gap-5 border-t border-cream/10 pt-8 sm:mt-24 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="font-serif text-3xl italic leading-tight sm:text-5xl">
            Quer um site assim pro seu casamento?
          </h2>
          <a
            href={whatsappUrl(
              `Oi! Vi o site de ${site.couple} no portfólio da Penne e quero um para o meu casamento.`
            )}
            target="_blank"
            rel="noopener"
            className="penne-roll shrink-0 font-display text-2xl uppercase leading-none text-[#dba58c]"
          >
            <RollText text="Orçamento no WhatsApp ↗" />
          </a>
        </section>

        {next && next.id !== site.id && (
          <Link
            href={casePath(next)}
            className="penne-roll mt-12 block border-t border-cream/10 pt-8 sm:mt-16"
          >
            <span className="font-mono text-[11px] uppercase text-cream/60">Próximo casamento</span>
            <span className="mt-3 block font-display text-[12vw] uppercase leading-[0.9] sm:text-[clamp(48px,8vw,128px)]">
              <RollText text={`${next.couple} →`} />
            </span>
          </Link>
        )}
      </main>
    </div>
  );
}
