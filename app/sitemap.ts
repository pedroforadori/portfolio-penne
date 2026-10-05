import type { MetadataRoute } from "next";
import { getSites } from "@/lib/sites";
import { SITE_URL } from "@/lib/site-config";
import { casePath } from "@/lib/case-copy";
import { getPosts, postPath } from "@/lib/blog";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [sites, posts] = await Promise.all([getSites(), getPosts()]);
  // A home muda quando entra um case novo.
  const lastModified = sites.reduce<string | undefined>(
    (latest, s) => (!latest || s.createdAt > latest ? s.createdAt : latest),
    undefined
  );

  return [
    {
      url: SITE_URL,
      lastModified: lastModified ? new Date(lastModified) : new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    ...sites.map((site) => ({
      url: `${SITE_URL}${casePath(site)}`,
      lastModified: new Date(site.createdAt),
      changeFrequency: "yearly" as const,
      priority: 0.8,
    })),
    {
      url: `${SITE_URL}/dominio`,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    },
    ...(posts.length > 0
      ? [
          {
            // Posts vêm do mais recente pro mais antigo.
            url: `${SITE_URL}/blog`,
            lastModified: new Date(posts[0].updatedAt ?? posts[0].publishedAt),
            changeFrequency: "weekly" as const,
            priority: 0.7,
          },
        ]
      : []),
    ...posts.map((post) => ({
      url: `${SITE_URL}${postPath(post)}`,
      lastModified: new Date(post.updatedAt ?? post.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
