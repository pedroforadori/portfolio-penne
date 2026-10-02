import { getSites } from "@/lib/sites";
import { withLocalPreviews } from "@/lib/local-previews";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL, WHATSAPP_DISPLAY, whatsappUrl } from "@/lib/site-config";
import type { Site } from "@/lib/types";
import { casePath } from "@/lib/case-copy";
import Home from "@/components/home/Home";
import { getPosts } from "@/lib/blog";

// Gerada uma vez e servida do cache; o admin revalida ao salvar. A hora é
// rede de segurança pra mudanças feitas fora do admin (ex.: script de capturas).
export const revalidate = 3600;

// Descreve a Penne e cada case para buscadores: a home é um portfólio
// (CollectionPage) cuja lista principal são os sites dos casais.
function structuredData(sites: Site[]) {
  const organization = {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/icon`,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      telephone: WHATSAPP_DISPLAY.replace(/\s/g, "-"),
      url: whatsappUrl(),
      areaServed: "BR",
      availableLanguage: "Portuguese",
    },
  };

  return {
    "@context": "https://schema.org",
    "@graph": [
      organization,
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        inLanguage: "pt-BR",
        publisher: { "@id": organization["@id"] },
      },
      {
        "@type": "Blog",
        "@id": `${SITE_URL}/blog#blog`,
        url: `${SITE_URL}/blog`,
        name: "Blog da Penne",
        inLanguage: "pt-BR",
        isPartOf: { "@id": `${SITE_URL}/#website` },
        publisher: { "@id": organization["@id"] },
      },
      {
        "@type": "CollectionPage",
        "@id": `${SITE_URL}/#portfolio`,
        url: SITE_URL,
        name: "Portfólio de sites de casamento",
        description: SITE_DESCRIPTION,
        inLanguage: "pt-BR",
        isPartOf: { "@id": `${SITE_URL}/#website` },
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: sites.length,
          itemListElement: sites.map((site, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: site.couple,
            url: `${SITE_URL}${casePath(site)}`,
          })),
        },
      },
    ],
  };
}

export default async function Page() {
  const [sites, posts] = await Promise.all([getSites().then(withLocalPreviews), getPosts()]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData(sites)).replace(/</g, "\\u003c"),
        }}
      />
      <Home sites={sites} posts={posts.slice(0, 3)} />
    </>
  );
}
