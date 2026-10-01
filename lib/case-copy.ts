import type { Site } from "./types";

export function casePath(site: Pick<Site, "slug">) {
  return `/casamentos/${site.slug}`;
}

export function caseTitle(site: Pick<Site, "couple">) {
  return `${site.couple}: site de casamento`;
}

// Texto da página do casal quando o admin ainda não escreveu uma descrição.
export function caseDescription(site: Pick<Site, "couple" | "description">) {
  return (
    site.description ??
    `Site de casamento de ${site.couple}, feito sob medida pela Penne com as cores, o jeito e a história do casal.`
  );
}

// "Camila & Victor" → ["Camila", "Victor"]
export function splitCouple(couple: string) {
  const [first, second] = couple.split(/\s*&\s*/);
  return { first, second };
}
