import "server-only";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import type { ComponentType } from "react";
import type { PostMeta } from "./types";

const DIR = path.join(process.cwd(), "content/blog");

// Rascunhos aparecem em dev e no preview do PR, pra revisar antes do merge.
const SHOW_DRAFTS =
  process.env.NODE_ENV === "development" || process.env.VERCEL_ENV === "preview";

type PostModule = {
  default: ComponentType;
  post: Omit<PostMeta, "slug" | "readingMinutes">;
};

export function postPath(post: Pick<PostMeta, "slug">) {
  return `/blog/${post.slug}`;
}

function allSlugs() {
  return readdirSync(DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.slice(0, -".mdx".length));
}

// ~200 palavras por minuto, contando só o texto (sem exports, comentários e tags).
function readingMinutes(slug: string) {
  const text = readFileSync(path.join(DIR, `${slug}.mdx`), "utf8")
    .replace(/^export const[\s\S]*?^};?$/m, "")
    .replace(/^(import|export) .*$/gm, "")
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, " ")
    .replace(/<[^>]+>/g, " ");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

async function load(slug: string) {
  const mod: PostModule = await import(`@/content/blog/${slug}.mdx`);
  const meta: PostMeta = { ...mod.post, slug, readingMinutes: readingMinutes(slug) };
  return { meta, Content: mod.default };
}

// Mais recentes primeiro; no mesmo dia, pelo `order`.
export async function getPosts(): Promise<PostMeta[]> {
  const posts = await Promise.all(allSlugs().map(async (slug) => (await load(slug)).meta));
  return posts
    .filter((post) => SHOW_DRAFTS || !post.draft)
    .sort(
      (a, b) =>
        b.publishedAt.localeCompare(a.publishedAt) || (a.order ?? 0) - (b.order ?? 0)
    );
}

export async function getPost(slug: string) {
  if (!allSlugs().includes(slug)) return undefined;
  const post = await load(slug);
  if (post.meta.draft && !SHOW_DRAFTS) return undefined;
  return post;
}

// "2026-10-02" → "2 de outubro de 2026"
export function formatPostDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}
