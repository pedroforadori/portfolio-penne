import { chromium } from "playwright";
import { get, put } from "@vercel/blob";
import type { Site } from "../lib/types";

if (!process.env.BLOB_READ_WRITE_TOKEN) {
  console.error("BLOB_READ_WRITE_TOKEN não configurado.");
  process.exit(1);
}

const PATHNAME = "data/sites.json";

async function loadSites(): Promise<Site[]> {
  const result = await get(PATHNAME, { access: "public", useCache: false });
  if (!result || result.statusCode !== 200) return [];
  const text = await new Response(result.stream).text();
  return JSON.parse(text) as Site[];
}

async function saveSites(sites: Site[]) {
  await put(PATHNAME, JSON.stringify(sites), {
    access: "public",
    contentType: "application/json",
    allowOverwrite: true,
    addRandomSuffix: false,
  });
}

async function main() {
  const sites = await loadSites();
  if (sites.length === 0) {
    console.error("Nenhum site cadastrado ainda.");
    process.exit(1);
  }

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 1600 } });

  for (const site of sites) {
    console.log(`Capturando ${site.couple} (${site.liveUrl})...`);
    try {
      await page.goto(site.liveUrl, { waitUntil: "networkidle", timeout: 30000 });
      await page.waitForTimeout(1500); // deixa animações/fontes assentarem
      const buffer = await page.screenshot({ type: "jpeg", quality: 85 });

      const blob = await put(`sites/${site.slug}-homepage.jpg`, buffer, {
        access: "public",
        contentType: "image/jpeg",
        allowOverwrite: true,
        addRandomSuffix: false,
      });

      site.imageUrl = blob.url;
      console.log(`  -> ${blob.url}`);
    } catch (err) {
      console.error(`  falhou: ${(err as Error).message}`);
    }
  }

  await browser.close();
  await saveSites(sites);
  console.log("sites.json atualizado.");
}

main();
