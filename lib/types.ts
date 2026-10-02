export type Device = "mobile" | "tablet" | "desktop";

export type Site = {
  id: string;
  couple: string;
  slug: string;
  liveUrl: string;
  githubUrl?: string;
  // Texto da página do casal (/casamentos/[slug]); sem ele, usa um padrão.
  description?: string;
  color: string;
  imageUrl?: string;
  // Capturas da página inteira em cada dispositivo, usadas no fundo da home
  // (cada tela carrega a do seu tamanho).
  fullPage?: Partial<Record<Device, string>>;
  order: number;
  createdAt: string;
};

// Metadados de um post do blog: cada content/blog/<slug>.mdx exporta `post`
// com estes campos (menos os calculados, slug e readingMinutes).
export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  // AAAA-MM-DD. Vai no JSON-LD e no sitemap; a página não mostra.
  publishedAt: string;
  // Quando existe, a página mostra "Atualizado em …".
  updatedAt?: string;
  // Desempate entre posts publicados no mesmo dia (menor primeiro).
  order?: number;
  keyword: string;
  // Slugs dos cases citados no post.
  cases?: string[];
  // Rascunho: aparece só em dev e nos previews da Vercel, nunca em produção.
  draft?: boolean;
  readingMinutes: number;
};
