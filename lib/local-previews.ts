import "server-only";
import { existsSync } from "node:fs";
import path from "node:path";
import type { Site } from "./types";

// Só em desenvolvimento: enquanto o script de captura ainda não grava a página
// inteira no Blob, usa capturas locais em public/previews/<slug>-full.jpg.
export function withLocalPreviews(sites: Site[]): Site[] {
  if (process.env.NODE_ENV !== "development") return sites;

  return sites.map((site) => {
    if (site.fullPageImageUrl) return site;
    const file = `previews/${site.slug}-full.jpg`;
    return existsSync(path.join(process.cwd(), "public", file))
      ? { ...site, fullPageImageUrl: `/${file}` }
      : site;
  });
}
