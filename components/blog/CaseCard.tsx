import Image from "next/image";
import Link from "next/link";
import { getSiteBySlug } from "@/lib/sites";
import { withLocalPreviews } from "@/lib/local-previews";
import { caseDescription, casePath } from "@/lib/case-copy";
import CoupleName from "@/components/home/CoupleName";
import RollText from "@/components/home/RollText";

// Case citado no meio do post: captura do site, nome do casal e link pra
// página do case. Slug inexistente não quebra o post, só não aparece.
export default async function CaseCard({ slug }: { slug: string }) {
  const found = await getSiteBySlug(slug);
  if (!found) return null;
  const [site] = withLocalPreviews([found]);
  const image = site.fullPage?.desktop ?? site.imageUrl;

  return (
    <Link
      href={casePath(site)}
      className="penne-roll my-10 grid gap-5 rounded-lg border border-cream/10 p-4 transition-colors hover:border-cream/25 sm:grid-cols-[minmax(0,15rem)_1fr] sm:items-center sm:p-5"
    >
      {image && (
        <span className="relative block aspect-[16/10] overflow-hidden rounded-md border border-cream/10">
          <Image
            src={image}
            alt={`Site de casamento de ${site.couple}`}
            fill
            sizes="(min-width: 640px) 15rem, 100vw"
            className="object-cover object-top"
          />
        </span>
      )}
      <span className="flex flex-col gap-2">
        <span className="font-mono text-[11px] uppercase text-cream/60">Case da Penne</span>
        <span className="font-display text-3xl uppercase leading-none">
          <CoupleName site={site} stacked={false} />
        </span>
        <span className="line-clamp-3 text-sm leading-relaxed text-cream/70">
          {caseDescription(site)}
        </span>
        <span className="mt-1 font-mono text-xs uppercase text-cream">
          <RollText text="Ver o case →" />
        </span>
      </span>
    </Link>
  );
}
