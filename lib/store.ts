import { Redis } from "@upstash/redis";

const KEY = "sites:list";

const hasRedisConfig = Boolean(
  process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN
);

const redis = hasRedisConfig
  ? new Redis({
      url: process.env.KV_REST_API_URL!,
      token: process.env.KV_REST_API_TOKEN!,
    })
  : null;

// Fallback em memória para rodar `next dev` sem uma instância Redis
// configurada. Nunca usado em produção (exige KV_REST_API_URL/TOKEN lá).
const memoryStore = globalThis as unknown as { __sitesMemory?: unknown };

export async function readRaw<T>(): Promise<T | null> {
  if (redis) return redis.get<T>(KEY);
  return (memoryStore.__sitesMemory as T | undefined) ?? null;
}

export async function writeRaw<T>(value: T): Promise<void> {
  if (redis) {
    await redis.set(KEY, value);
    return;
  }
  memoryStore.__sitesMemory = value;
}

export const isUsingMemoryFallback = !redis;
