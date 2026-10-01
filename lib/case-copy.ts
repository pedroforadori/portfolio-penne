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

// Versão pra meta description: o Google corta em ~160 caracteres, então usa
// as frases inteiras que couberem; se sobrar pouco texto, corta na última
// palavra antes do limite.
export function caseMetaDescription(
  site: Pick<Site, "couple" | "description">,
  max = 160
): string {
  const text = caseDescription(site);
  if (text.length <= max) return text;

  let fitting = "";
  for (const sentence of text.match(/[^.!?]+[.!?]+/g) ?? []) {
    if ((fitting + sentence).trim().length > max) break;
    fitting += sentence;
  }
  if (fitting.trim().length >= 110) return fitting.trim();
  return `${text.slice(0, max - 1).replace(/\s+\S*$/, "").replace(/[,;:]$/, "")}…`;
}

// "Camila & Victor" → ["Camila", "Victor"]
export function splitCouple(couple: string) {
  const [first, second] = couple.split(/\s*&\s*/);
  return { first, second };
}
