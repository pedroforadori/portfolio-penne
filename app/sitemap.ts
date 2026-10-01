import type { MetadataRoute } from "next";
import { getSites } from "@/lib/sites";
import { SITE_URL } from "@/lib/site-config";
import { casePath } from "@/lib/case-copy";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sites = await getSites();
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
  ];
}
