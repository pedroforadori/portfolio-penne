import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium, devices, type BrowserContextOptions, type Page } from "playwright";
import { get, put } from "@vercel/blob";
import type { Device, Site } from "../lib/types";

// --local: salva as capturas em public/previews/ (usadas só no `next dev`, via
// lib/local-previews.ts) e não toca no Blob nem no sites.json.
const LOCAL = process.argv.includes("--local");
const LOCAL_DIR = path.join(process.cwd(), "public", "previews");

// Cada site é capturado como se fosse aberto em cada dispositivo (viewport,
// user agent e toque), pra renderizar o próprio layout responsivo. DPR 2 pra
// ficar nítido sem gerar arquivos enormes nas páginas longas.
const DEVICES: Record<Device, BrowserContextOptions> = {
  mobile: { ...devices["iPhone 13"], viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 },
  tablet: { ...devices["iPad Pro 11"], viewport: { width: 834, height: 1194 }, deviceScaleFactor: 2 },
  desktop: { viewport: { width: 1440, height: 900 } },
};

// Altura máxima da captura, em pixels da imagem. Acima de 16383 px o otimizador
// do Next não consegue gerar WebP (limite do formato) e entrega o JPEG cru, e o
// Safari do iPhone deixa de desenhar imagens tão grandes. O fundo da home só
// percorre o começo do site mesmo.
const MAX_CAPTURE_PX = 12000;

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
  const { height, step } = await page.evaluate(() => ({
    height: document.documentElement.scrollHeight,
    step: Math.round(window.innerHeight * 0.7),
  }));
  for (let y = 0; y < height; y += step) {
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
  // Screenshot vertical da home: reserva quando não há captura do dispositivo.
  const portrait = await browser.newPage({ viewport: { width: 1280, height: 1600 } });
  const pages = {} as Record<Device, Page>;
  for (const [device, options] of Object.entries(DEVICES) as [Device, BrowserContextOptions][]) {
    pages[device] = await (await browser.newContext(options)).newPage();
  }

  for (const site of sites) {
    console.log(`Capturando ${site.couple} (${site.liveUrl})...`);
    try {
      if (!LOCAL) {
        await portrait.goto(site.liveUrl, { waitUntil: "networkidle", timeout: 30000 });
        await portrait.waitForTimeout(1500); // deixa animações/fontes assentarem
        const homepage = await portrait.screenshot({ type: "jpeg", quality: 85 });
        site.imageUrl = await upload(`sites/${site.slug}-homepage.jpg`, homepage);
        console.log(`  homepage -> ${site.imageUrl}`);
        // Campo antigo (só desktop), substituído por fullPage.
        delete (site as Site & { fullPageImageUrl?: string }).fullPageImageUrl;
      }

      site.fullPage ??= {};
      for (const [device, page] of Object.entries(pages) as [Device, Page][]) {
        await page.goto(site.liveUrl, { waitUntil: "networkidle", timeout: 30000 });
        await page.waitForTimeout(1500);
        await warmUpFullPage(page);
        const { width, height } = await page.evaluate(() => ({
          width: window.innerWidth,
          height: document.documentElement.scrollHeight,
        }));
        const scale = DEVICES[device].deviceScaleFactor ?? 1;
        const buffer = await page.screenshot({
          type: "jpeg",
          quality: 80,
          fullPage: true,
          clip: { x: 0, y: 0, width, height: Math.min(height, MAX_CAPTURE_PX / scale) },
        });

        if (LOCAL) {
          await writeFile(path.join(LOCAL_DIR, `${site.slug}-${device}.jpg`), buffer);
          console.log(`  ${device} -> public/previews/${site.slug}-${device}.jpg`);
        } else {
          site.fullPage[device] = await upload(`sites/${site.slug}-fullpage-${device}.jpg`, buffer);
          console.log(`  ${device} -> ${site.fullPage[device]}`);
        }
      }
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
