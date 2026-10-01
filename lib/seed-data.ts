import type { Site } from "./types";

const now = new Date().toISOString();

export const seedSites: Site[] = [
  {
    id: crypto.randomUUID(),
    couple: "Camila & Victor",
    slug: "camila-victor",
    liveUrl: "https://camilaevictoremmilagres.com.br",
    githubUrl: "https://github.com/pedroforadori/wedding-camilaevictoremmilagres",
    color: "#C7A876",
    order: 0,
    createdAt: now,
  },
  {
    id: crypto.randomUUID(),
    couple: "Vania & Mauro",
    slug: "vania-mauro",
    liveUrl: "https://app-wedding-vania-mauro.vercel.app",
    githubUrl: "https://github.com/pedroforadori/app-wedding-vania-mauro",
    color: "#C97B5C",
    order: 1,
    createdAt: now,
  },
  {
    id: crypto.randomUUID(),
    couple: "Fernanda & Rafael",
    slug: "fernanda-rafael",
    liveUrl: "https://wedding-ferafa.vercel.app",
    githubUrl: "https://github.com/pedroforadori/wedding-ferafa",
    color: "#D98F6F",
    order: 2,
    createdAt: now,
  },
  {
    id: crypto.randomUUID(),
    couple: "Gabriela & Vinicius",
    slug: "gabriela-vinicius",
    liveUrl: "https://web-gabivini.vercel.app",
    githubUrl: "https://github.com/pedroforadori/web-gabivini",
    color: "#3F6F68",
    order: 3,
    createdAt: now,
  },
  {
    id: crypto.randomUUID(),
    couple: "Tanne & Pedro",
    slug: "tanne-pedro",
    liveUrl: "https://penne-wedding.vercel.app",
    githubUrl: "https://github.com/pedroforadori/web-pennewedding",
    color: "#6B3548",
    order: 4,
    createdAt: now,
  },
];
