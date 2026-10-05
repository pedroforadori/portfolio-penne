import type { NextRequest } from "next/server";
import { isValidLabel, toLabel, TLDS, type Availability, type CheckResult, type Tld } from "@/lib/domain";

// Consulta pública via RDAP, o protocolo oficial dos registros: 404 é livre,
// 200 é registrado. Sem chave de API. Ver page /dominio.
const RDAP: Record<Tld, (label: string) => string> = {
  "com.br": (label) => `https://rdap.registro.br/domain/${label}.com.br`,
  com: (label) => `https://rdap.verisign.com/com/v1/domain/${label}.com`,
};

async function check(label: string, tld: Tld): Promise<Availability> {
  try {
    const res = await fetch(RDAP[tld](label), {
      headers: { Accept: "application/rdap+json" },
      // Mesma consulta em sequência (o casal testando de novo) não volta ao registro.
      next: { revalidate: 600 },
      signal: AbortSignal.timeout(6000),
    });
    if (res.status === 404) return "livre";
    if (res.ok) return "registrado";
    return "erro";
  } catch {
    return "erro";
  }
}

// Limite por IP pra página não virar proxy de consulta em massa. Fica na
// memória da instância: não é exato entre instâncias, mas segura o abuso.
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 40;
const hits = new Map<string, { count: number; resetAt: number }>();

function allow(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || entry.resetAt < now) {
    if (hits.size > 5000) hits.clear();
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  entry.count += 1;
  return entry.count <= MAX_PER_WINDOW;
}

export async function GET(request: NextRequest) {
  const label = toLabel(request.nextUrl.searchParams.get("nome") ?? "");
  if (!isValidLabel(label)) {
    return Response.json({ error: "Nome inválido" }, { status: 400 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (!allow(ip)) {
    return Response.json(
      { error: "Muitas consultas seguidas. Espere um minuto." },
      { status: 429 }
    );
  }

  const statuses = await Promise.all(TLDS.map((tld) => check(label, tld)));
  const result = Object.fromEntries(TLDS.map((tld, i) => [tld, statuses[i]])) as CheckResult;

  return Response.json({ label, result });
}
