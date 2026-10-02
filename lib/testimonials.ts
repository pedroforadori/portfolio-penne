import type { Testimonial } from "./types";

// Rascunhos aparecem em dev e no preview do PR, igual aos posts do blog.
const SHOW_DRAFTS =
  process.env.NODE_ENV === "development" || process.env.VERCEL_ENV === "preview";

// Avaliações dos casais, na ordem em que aparecem na home. Sem nenhuma, a tela
// de avaliações e o link do header somem.
const all: Testimonial[] = [
  {
    id: "camila-victor",
    couple: "Camila & Victor",
    rating: 5,
    caseSlug: "camila-victor",
    text: "ficou incrível 🥹😭😍, do jeitinho que a gente queria",
  },
  {
    id: "vania-mauro",
    couple: "Vânia & Mauro",
    rating: 5,
    caseSlug: "vania-mauro",
    text: "atendimento atencioso do começo ao fim.",
  },
  {
    id: "eden-cerimonial",
    couple: "Éden Cerimonial",
    rating: 5,
    caseSlug: "fernanda-rafael",
    text: "um casal nosso fez com vocês e ficou incrível 😍",
  },
  {
    id: "fernanda-rafael",
    couple: "Fernanda & Rafael",
    rating: 5,
    caseSlug: "fernanda-rafael",
    text: "a lista de presentes funcionou perfeitamente, recomendamos pra quem está organizando o casamento.",
  },
  {
    id: "gabriela-vinicius",
    couple: "Gabi & Vini",
    rating: 5,
    caseSlug: "gabriela-vinicius",
    text: "os convidados confirmaram presença rapidinho e todo mundo elogiou o site 🧡",
  },
  {
    id: "tanne-pedro",
    couple: "Tanne & Pedro",
    rating: 5,
    caseSlug: "tanne-pedro",
    text: "entenderam a nossa história e colocaram ela no site, ficou a nossa cara.",
  },
];

export const testimonials = all.filter((testimonial) => SHOW_DRAFTS || !testimonial.draft);
