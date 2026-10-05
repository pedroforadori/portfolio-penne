// Assistente de domínio: gera sugestões a partir dos nomes do casal, avalia
// cada uma (tamanho, hífen, número, acento) e define o que dá pra consultar.
// Usado na página /dominio (cliente) e na rota /api/dominio (servidor).

export const TLDS = ["com.br", "com"] as const;
export type Tld = (typeof TLDS)[number];

export type Availability = "livre" | "registrado" | "erro";
export type CheckResult = Record<Tld, Availability>;

// O registro.br aceita de 2 a 26 caracteres no nome; vale o mais restrito.
const MIN_LENGTH = 2;
const MAX_LENGTH = 26;

// Sugestão nunca leva hífen (ver dica "Sem hífen e sem acento" na página).
const noHyphen = (text: string) => toLabel(text).replace(/-/g, "");

// "João Pedro" → "joaopedro". Tira acento, espaço e o que não vale em domínio.
export function toLabel(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function isValidLabel(label: string): boolean {
  return (
    label.length >= MIN_LENGTH &&
    label.length <= MAX_LENGTH &&
    /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(label)
  );
}

export type CoupleInput = {
  nome1: string;
  nome2: string;
  data?: string; // AAAA-MM-DD
  sobrenome?: string;
};

// Só o primeiro nome entra nas combinações: "Ana Clara" vira "anaclara", mas
// "Maria Eduarda Souza" ficaria longo demais, então fica "maria".
function firstName(text: string): string {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const joined = noHyphen(words.slice(0, 2).join(""));
  return joined.length <= 10 ? joined : noHyphen(words[0] ?? "");
}

export function suggestLabels({ nome1, nome2, data, sobrenome }: CoupleInput): string[] {
  const a = firstName(nome1);
  const b = firstName(nome2);
  if (!a || !b) return [];

  const [ano] = (data ?? "").split("-");
  const yyyy = ano?.length === 4 ? ano : "";
  const yy = yyyy.slice(2);
  const sob = sobrenome ? noHyphen(sobrenome.trim().split(/\s+/).pop() ?? "") : "";

  const candidates = [
    `${a}e${b}`,
    `${b}e${a}`,
    `${a}${b}`,
    `casamento${a}e${b}`,
    yyyy && `${a}e${b}${yyyy}`,
    yy && `${a}e${b}${yy}`,
    yyyy && `${a[0]}e${b[0]}${yyyy}`,
    `${a}mais${b}`,
    `sim${a}e${b}`,
    sob && `casamento${sob}`,
    sob && `os${sob}`,
    sob && yyyy && `os${sob}${yyyy}`,
  ];

  return [...new Set(candidates.filter((c): c is string => Boolean(c)))].filter(isValidLabel);
}

// Alternativas pra um domínio que o casal digitou e já tem dono.
export function variationsOf(label: string, data?: string): string[] {
  const plain = label.replace(/-/g, "");
  const yyyy = (data ?? "").split("-")[0];
  const candidates = [
    plain !== label && plain,
    `casamento${plain}`,
    `sim${plain}`,
    yyyy?.length === 4 && `${plain}${yyyy}`,
    yyyy?.length === 4 && `${plain}${yyyy.slice(2)}`,
    `${plain}casamento`,
  ];
  return [...new Set(candidates.filter((c): c is string => Boolean(c)))]
    .filter((c) => c !== label)
    .filter(isValidLabel);
}

export type Tip = { tone: "bom" | "atencao"; text: string };

// Dicas que aparecem do lado de cada domínio, e a nota que ordena a lista.
export function evaluate(label: string, original?: string): { score: number; tips: Tip[] } {
  const tips: Tip[] = [];
  let score = 100;

  if (label.length <= 14) {
    tips.push({ tone: "bom", text: "Curto" });
  } else if (label.length > 20) {
    score -= 25;
    tips.push({ tone: "atencao", text: "Longo de digitar" });
  } else {
    score -= label.length - 14;
  }

  if (label.includes("-")) {
    score -= 30;
    tips.push({ tone: "atencao", text: "Hífen é difícil de ditar" });
  }

  if (/\d/.test(label)) {
    score -= 10;
    tips.push({ tone: "atencao", text: "Avise que o número é em algarismo" });
  }

  // "joseeana", "camilaandre": a vogal repetida na emenda some quando alguém
  // digita de ouvido. Consoante dobrada ("ss", "rr") é normal em português.
  if (/([aeiou])\1/.test(label)) {
    score -= 15;
    tips.push({ tone: "atencao", text: "Vogal repetida confunde" });
  }

  if (original && /[^\x00-\x7F]/.test(original)) {
    tips.push({ tone: "atencao", text: "Sem acento no endereço" });
  }

  if (!tips.some((t) => t.tone === "atencao")) {
    tips.push({ tone: "bom", text: "Fácil de falar" });
  }

  return { score, tips };
}

// .com.br vale mais: é o que o convidado brasileiro tenta primeiro.
export function availabilityBonus(result?: CheckResult): number {
  if (!result) return 0;
  return (result["com.br"] === "livre" ? 40 : 0) + (result.com === "livre" ? 15 : 0);
}
