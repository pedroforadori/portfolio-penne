// Endereço público do portfólio, usado em canonical, sitemap, Open Graph e
// JSON-LD. Defina NEXT_PUBLIC_SITE_URL com o domínio final; sem ele, cai no
// domínio de produção da Vercel e, em dev, no localhost.
function resolveSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  return "http://localhost:3000";
}

export const SITE_URL = resolveSiteUrl().replace(/\/$/, "");

export const SITE_NAME = "Penne";
export const SITE_TITLE = "Penne — Sites de casamento personalizados";
export const SITE_DESCRIPTION =
  "Sites de casamento sob medida, com convite digital, confirmação de presença e lista de presentes. Veja os casais que já ganharam um site com a cara deles.";
