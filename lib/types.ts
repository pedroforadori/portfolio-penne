export type Site = {
  id: string;
  couple: string;
  slug: string;
  liveUrl: string;
  githubUrl?: string;
  color: string;
  imageUrl?: string;
  // Captura desktop (1440px de largura) da página inteira, usada no fundo da home.
  fullPageImageUrl?: string;
  order: number;
  createdAt: string;
};
