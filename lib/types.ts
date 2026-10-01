export type Device = "mobile" | "tablet" | "desktop";

export type Site = {
  id: string;
  couple: string;
  slug: string;
  liveUrl: string;
  githubUrl?: string;
  color: string;
  imageUrl?: string;
  // Capturas da página inteira em cada dispositivo, usadas no fundo da home
  // (cada tela carrega a do seu tamanho).
  fullPage?: Partial<Record<Device, string>>;
  order: number;
  createdAt: string;
};
