import "server-only";
import { existsSync } from "node:fs";
import path from "node:path";
import type { Device, Site } from "./types";

const DEVICES: Device[] = ["mobile", "tablet", "desktop"];

// Só em desenvolvimento: usa as capturas locais de public/previews/
// (geradas por `npm run capture-screenshots -- --local`) nos dispositivos que
// ainda não têm captura no Blob.
export function withLocalPreviews(sites: Site[]): Site[] {
  if (process.env.NODE_ENV !== "development") return sites;

  return sites.map((site) => {
    const fullPage = { ...site.fullPage };
    for (const device of DEVICES) {
      const file = `previews/${site.slug}-${device}.jpg`;
      if (!fullPage[device] && existsSync(path.join(process.cwd(), "public", file))) {
        fullPage[device] = `/${file}`;
      }
    }
    return { ...site, fullPage };
  });
}
