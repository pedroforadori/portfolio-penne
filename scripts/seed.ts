import { Redis } from "@upstash/redis";
import type { Site } from "../lib/types";

const url = process.env.KV_REST_API_URL;
const token = process.env.KV_REST_API_TOKEN;

if (!url || !token) {
  console.error(
    "KV_REST_API_URL/KV_REST_API_TOKEN não configurados. Rode com " +
      "`vercel env pull .env.production.local` e aponte pra esse arquivo, " +
      "ou cadastre os cases direto pelo admin em produção."
  );
  process.exit(1);
}

const redis = new Redis({ url, token });
const now = new Date().toISOString();

const sites: Site[] = [
  {
    id: crypto.randomUUID(),
    couple: "Vania & Mauro",
    slug: "vania-mauro",
    liveUrl: "https://app-wedding-vania-mauro.vercel.app",
    githubUrl: "https://github.com/pedroforadori/app-wedding-vania-mauro",
    color: "#C97B5C",
    order: 0,
    createdAt: now,
  },
  {
    id: crypto.randomUUID(),
    couple: "Gabriela & Vinicius",
    slug: "gabriela-vinicius",
    liveUrl: "https://web-gabivini.vercel.app",
    githubUrl: "https://github.com/pedroforadori/web-gabivini",
    color: "#3F6F68",
    order: 1,
    createdAt: now,
  },
  {
    id: crypto.randomUUID(),
    couple: "Fernanda & Rafael",
    slug: "fernanda-rafael",
    liveUrl: "https://wedding-ferafa.vercel.app",
    githubUrl: "https://github.com/pedroforadori/wedding-ferafa",
    color: "#D98F6F",
    order: 2,
    createdAt: now,
  },
  {
    id: crypto.randomUUID(),
    couple: "Tanne & Pedro",
    slug: "tanne-pedro",
    liveUrl: "https://penne-wedding.vercel.app",
    githubUrl: "https://github.com/pedroforadori/web-pennewedding",
    color: "#6B3548",
    order: 3,
    createdAt: now,
  },
];

async function main() {
  await redis.set("sites:list", sites);
  console.log(`Seeded ${sites.length} sites.`);
}

main();
