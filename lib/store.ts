import { get, put } from "@vercel/blob";

const PATHNAME = "data/sites.json";

const hasBlobConfig = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

// Fallback em memória para rodar `next dev` sem BLOB_READ_WRITE_TOKEN
// configurado. Nunca usado em produção (exige a env var lá).
const memoryStore = globalThis as unknown as { __sitesMemory?: unknown };

export async function readRaw<T>(): Promise<T | null> {
  if (!hasBlobConfig) {
    return (memoryStore.__sitesMemory as T | undefined) ?? null;
  }

  const result = await get(PATHNAME, { access: "public", useCache: false });
  if (!result || result.statusCode !== 200) return null;

  const text = await new Response(result.stream).text();
  return JSON.parse(text) as T;
}

export async function writeRaw<T>(value: T): Promise<void> {
  if (!hasBlobConfig) {
    memoryStore.__sitesMemory = value;
    return;
  }

  await put(PATHNAME, JSON.stringify(value), {
    access: "public",
    contentType: "application/json",
    allowOverwrite: true,
    addRandomSuffix: false,
  });
}

export const isUsingMemoryFallback = !hasBlobConfig;
