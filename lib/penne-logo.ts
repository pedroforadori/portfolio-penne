import { SEAL_BOTTOM_TEXT, SEAL_TOP_TEXT } from "./penne-logo-paths";

// Logo da Penne: duas alianças entrelaçadas, uma creme e uma rosé, com a
// hachura fina do original. O arquivo original foi desenhado pra fundo claro
// e usava anéis "da cor do fundo" pra cortar o entrelaçado; aqui os cortes e
// a hachura são máscaras, então o logo fica transparente e funciona sobre o
// fundo escuro e sobre as capturas dos cases.

export const LOGO_COLORS = {
  ink: "#f4ede6",
  gold: ["#f3d3bf", "#dba58c", "#a8735d"],
} as const;

type Options = {
  /** Prefixo dos ids internos (máscaras, gradiente); único por página. */
  id?: string;
  /** Cor das letras, dos frisos e da aliança clara. */
  ink?: string;
  /** Hachura nas alianças; some bem em tamanhos pequenos. */
  hatch?: boolean;
};

// As duas alianças, no referencial já girado de -18°: centros em x 173 e 227.
const ring = (cx: number, r1: number, r2: number) =>
  `M${cx - r1},200a${r1},${r1} 0 1,0 ${2 * r1},0a${r1},${r1} 0 1,0 ${-2 * r1},0Z` +
  `M${cx - r2},200a${r2},${r2} 0 1,0 ${2 * r2},0a${r2},${r2} 0 1,0 ${-2 * r2},0Z`;

const RING_A = ring(173, 50, 39);
const RING_B = ring(227, 50, 39);
// Folga em volta de cada aliança, que vira o corte do entrelaçado.
const GAP_A = ring(173, 54, 35);
const GAP_B = ring(227, 54, 35);
// No cruzamento de cima a aliança A passa por cima; no de baixo, a B.
const TOP_CROSSING = `<circle cx="200" cy="164.63" r="19"/>`;

// Cada aliança num grupo .penne-seal-ring-a/b com o centro dela na origem, pra um
// rotate() do CSS girar no próprio eixo sem depender de transform-origin.
const spinning = (ring: "a" | "b", cx: number, content: string) =>
  `<g transform="translate(${cx} 200)"><g class="penne-seal-ring-${ring}"><g transform="translate(${-cx} -200)">${content}</g></g></g>`;

function rings({ id = "penne", ink = LOGO_COLORS.ink, hatch = true }: Options) {
  const [g0, g1, g2] = LOGO_COLORS.gold;
  const full = `x="0" y="0" width="400" height="400"`;
  // A hachura vai em cada aliança (e não no par), pra girar junto com ela.
  const hatchMask = hatch ? ` mask="url(#${id}-mh)"` : "";
  return `<defs>
<linearGradient id="${id}-gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${g0}"/><stop offset=".5" stop-color="${g1}"/><stop offset="1" stop-color="${g2}"/></linearGradient>
<clipPath id="${id}-top">${TOP_CROSSING}</clipPath>
<mask id="${id}-ma" maskUnits="userSpaceOnUse" ${full}><rect ${full} fill="#fff"/><path d="${GAP_B}" fill="#000" fill-rule="evenodd"/><g fill="#fff">${TOP_CROSSING}</g></mask>
<mask id="${id}-mb" maskUnits="userSpaceOnUse" ${full}><rect ${full} fill="#fff"/><path d="${GAP_A}" fill="#000" fill-rule="evenodd" clip-path="url(#${id}-top)"/></mask>
${
  hatch
    ? `<pattern id="${id}-lines" patternUnits="userSpaceOnUse" width="4.72" height="10" patternTransform="rotate(19.29)"><rect width="4.72" height="10" fill="#fff"/><rect width="1.04" height="10" fill="#000"/></pattern>
<mask id="${id}-mh" maskUnits="userSpaceOnUse" ${full}><rect ${full} fill="url(#${id}-lines)"/></mask>`
    : ""
}
</defs>
<g transform="rotate(-18 200 200)">
<g mask="url(#${id}-ma)">${spinning("a", 173, `<g${hatchMask}><path d="${RING_A}" fill="${ink}" fill-rule="evenodd"/></g>`)}</g>
<g mask="url(#${id}-mb)">${spinning("b", 227, `<g${hatchMask}><path d="${RING_B}" fill="url(#${id}-gold)" fill-rule="evenodd"/></g>`)}</g>
</g>`;
}

/** Só as alianças, recortadas justas: pro header e pro ícone. */
export function penneMarkSvg(options: Options = {}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="120 137 160 126">${rings({ hatch: false, ...options })}</svg>`;
}

/** O selo completo, com "PENNE" e "CASAMENTOS" em volta. As alianças ficam
 *  em .penne-seal-ring-a e .penne-seal-ring-b, pra poderem girar cada uma no seu eixo. */
export function penneSealSvg(options: Options = {}) {
  const ink = options.ink ?? LOGO_COLORS.ink;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
<g fill="none" stroke="${ink}"><circle cx="200" cy="200" r="185" stroke-width="2"/><circle cx="200" cy="200" r="179" stroke-width=".7"/><circle cx="200" cy="200" r="115" stroke-width="1"/></g>
<g fill="${ink}"><path d="${SEAL_TOP_TEXT}"/><path d="${SEAL_BOTTOM_TEXT}"/><circle cx="350" cy="200" r="2.8"/><circle cx="50" cy="200" r="2.8"/></g>
${rings(options)}</svg>`;
}
