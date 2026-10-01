import type { Site } from "./types";

const now = new Date().toISOString();

export const seedSites: Site[] = [
  {
    id: crypto.randomUUID(),
    couple: "Camila & Victor",
    slug: "camila-victor",
    description:
      "Site de casamento para um destination wedding na praia de São Miguel dos Milagres (AL), com três dias de celebração. Reúne a programação de cada dia com traje sugerido, confirmação de presença por evento, um guia da região com hospedagem, restaurantes e passeios, como chegar, lista de presentes e um mural de mensagens para os noivos, tudo em domínio próprio.",
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
    description:
      "Site de casamento com a história do casal, contagem regressiva e confirmação de presença com acompanhantes. A lista de presentes é feita de experiências para a vida a dois, de um café da manhã especial a um passeio de balão, e a página da festa traz mapa, horário e dress code.",
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
    description:
      "Site de casamento que conta a história de um amor que começou na faculdade. Tem lista de presentes dividida entre a viagem de lua de mel e a casa nova, PIX por QR Code, confirmação de presença e todas as informações da festa.",
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
    description:
      "Site de casamento aberto com um versículo de Rute que guia a história do casal. A lista de presentes é feita de cotas da lua de mel na Disney e em Miami, com PIX por QR Code, e o site traz confirmação de presença e os detalhes da festa em páginas próprias.",
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
    description:
      "Site de casamento com o humor do casal: a história de como se conheceram num jogo do Palmeiras e uma lista de presentes cheia de piadas, do rolo de macarrão ao capacete contra ele. Tem também confirmação de presença e as informações da festa, com contatos de transporte para os convidados.",
    liveUrl: "https://penne-wedding.vercel.app",
    githubUrl: "https://github.com/pedroforadori/web-pennewedding",
    color: "#6B3548",
    order: 4,
    createdAt: now,
  },
];
