import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium, type Page } from "playwright";
import { get, put } from "@vercel/blob";
import type { Site } from "../lib/types";

// --local: salva as capturas em public/previews/ (usadas só no `next dev`, via
// lib/local-previews.ts) e não toca no Blob nem no sites.json.
const LOCAL = process.argv.includes("--local");
const LOCAL_DIR = path.join(process.cwd(), "public", "previews");

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

async function upload(pathname: string, buffer: Buffer): Promise<string> {
  const blob = await put(pathname, buffer, {
    access: "public",
    contentType: "image/jpeg",
    allowOverwrite: true,
    addRandomSuffix: false,
  });
  return blob.url;
}

// Rola até o fim e volta, pra disparar lazy-load de imagens e animações de
// entrada antes da captura da página inteira.
async function warmUpFullPage(page: Page) {
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += 600) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(250);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(800);
}

async function main() {
  const sites = await loadSites();
  if (sites.length === 0) {
    console.error("Nenhum site cadastrado ainda.");
    process.exit(1);
  }
  if (LOCAL) await mkdir(LOCAL_DIR, { recursive: true });

  const browser = await chromium.launch();
  // Vertical: tile do mobile. Desktop: fundo da home, com a página inteira.
  const portrait = await browser.newPage({ viewport: { width: 1280, height: 1600 } });
  const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  for (const site of sites) {
    console.log(`Capturando ${site.couple} (${site.liveUrl})...`);
    try {
      await portrait.goto(site.liveUrl, { waitUntil: "networkidle", timeout: 30000 });
      await portrait.waitForTimeout(1500); // deixa animações/fontes assentarem
      const homepage = await portrait.screenshot({ type: "jpeg", quality: 85 });

      await desktop.goto(site.liveUrl, { waitUntil: "networkidle", timeout: 30000 });
      await desktop.waitForTimeout(1500);
      await warmUpFullPage(desktop);
      const fullPage = await desktop.screenshot({ type: "jpeg", quality: 80, fullPage: true });

      if (LOCAL) {
        await writeFile(path.join(LOCAL_DIR, `${site.slug}-full.jpg`), fullPage);
        console.log(`  -> public/previews/${site.slug}-full.jpg`);
        continue;
      }

      site.imageUrl = await upload(`sites/${site.slug}-homepage.jpg`, homepage);
      site.fullPageImageUrl = await upload(`sites/${site.slug}-fullpage.jpg`, fullPage);
      console.log(`  -> ${site.imageUrl}\n  -> ${site.fullPageImageUrl}`);
    } catch (err) {
      console.error(`  falhou: ${(err as Error).message}`);
    }
  }

  await browser.close();
  if (LOCAL) return;
  await saveSites(sites);
  console.log("sites.json atualizado.");
}

main();
