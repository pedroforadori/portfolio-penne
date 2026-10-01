import type { MetadataRoute } from "next";
import { getSites } from "@/lib/sites";
import { SITE_URL } from "@/lib/site-config";

export const dynamic = "force-dynamic";

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
  ];
}
