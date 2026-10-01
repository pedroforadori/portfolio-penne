import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-config";

// O admin não entra aqui de propósito: listar o ADMIN_PATH no robots.txt
// revelaria o caminho secreto. Ele sai do índice pelo X-Robots-Tag do proxy.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
