import { get, put } from "@vercel/blob";
import { seedSites } from "./seed-data";

const PATHNAME = "data/sites.json";

const hasBlobConfig = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

// Fallback em memória para rodar `next dev` sem BLOB_READ_WRITE_TOKEN
// configurado, já populado com os cases do seed. Nunca usado em produção
// (exige a env var lá).
const memoryStore = globalThis as unknown as {
  __sitesMemory?: unknown;
  __sitesReadFellBack?: boolean;
};

export async function readRaw<T>(): Promise<T | null> {
  if (!hasBlobConfig) {
    memoryStore.__sitesMemory ??= seedSites;
    return memoryStore.__sitesMemory as T;
  }

  try {
    const result = await get(PATHNAME, { access: "public", useCache: false });
    if (!result || result.statusCode !== 200) return null;

    const text = await new Response(result.stream).text();
    memoryStore.__sitesReadFellBack = false;
    return JSON.parse(text) as T;
  } catch (error) {
    // Em dev, o firewall da Vercel às vezes desafia o fetch do Node ("Security
    // Checkpoint", 403) mesmo com token válido. Cai no seed pra página não
    // quebrar; em produção o erro continua subindo.
    if (process.env.NODE_ENV !== "development") throw error;
    memoryStore.__sitesReadFellBack = true;
    console.warn(`[store] Falha ao ler ${PATHNAME} do Blob, usando o seed local:`, (error as Error).message);
    return seedSites as T;
  }
}

export async function writeRaw<T>(value: T): Promise<void> {
  if (!hasBlobConfig) {
    memoryStore.__sitesMemory = value;
    return;
  }

  // Salvar em cima do seed apagaria os cases reais do Blob.
  if (memoryStore.__sitesReadFellBack) {
    throw new Error(
      "A última leitura do Blob falhou e a lista exibida é o seed local; salvar agora sobrescreveria os cases de produção."
    );
  }

  await put(PATHNAME, JSON.stringify(value), {
    access: "public",
    contentType: "application/json",
    allowOverwrite: true,
    addRandomSuffix: false,
  });
}

export const isUsingMemoryFallback = !hasBlobConfig;
