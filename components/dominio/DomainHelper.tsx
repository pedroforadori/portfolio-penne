"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import RollText from "@/components/home/RollText";
import { whatsappUrl } from "@/lib/site-config";
import {
  availabilityBonus,
  evaluate,
  isValidLabel,
  suggestLabels,
  toLabel,
  variationsOf,
  TLDS,
  type CheckResult,
  type CoupleInput,
  type Tld,
} from "@/lib/domain";

type Row = {
  label: string;
  original?: string; // o que o casal digitou, pra avisar do acento
  custom?: boolean; // digitado na busca direta: fica fixo no topo
  variantOf?: string; // alternativa pra um domínio digitado que já tem dono
  result?: CheckResult;
};

// Poucas consultas ao mesmo tempo: o registro.br limita quem pergunta demais.
const CONCURRENCY = 3;

const FIELD =
  "w-full border-b border-cream/25 bg-transparent py-2 font-serif text-2xl text-cream placeholder:text-cream/30 focus:border-cream focus:outline-none sm:text-3xl";
const LABEL = "font-mono text-[11px] uppercase text-cream/55";

export default function DomainHelper({ initial }: { initial: CoupleInput }) {
  // Quem chega por um link compartilhado já vê o resultado.
  const [initialLabels] = useState(() =>
    initial.nome1 && initial.nome2 ? suggestLabels(initial) : []
  );
  const [form, setForm] = useState<CoupleInput>(initial);
  const [rows, setRows] = useState<Row[]>(() => initialLabels.map((label) => ({ label })));
  const [pending, setPending] = useState(initialLabels.length);
  const [error, setError] = useState<string | null>(null);
  const [customText, setCustomText] = useState("");
  const runId = useRef(0);
  // Leitura das linhas atuais dentro de handlers assíncronos.
  const rowsRef = useRef(rows);
  useEffect(() => {
    rowsRef.current = rows;
  }, [rows]);

  // Quem chama já somou os rótulos em `pending`.
  async function checkAll(labels: string[], id: number) {
    const queue = [...labels];
    const results: Record<string, CheckResult> = {};

    async function worker() {
      while (queue.length > 0) {
        const label = queue.shift()!;
        let result: CheckResult;
        try {
          const res = await fetch(`/api/dominio?nome=${encodeURIComponent(label)}`);
          const body = await res.json();
          if (!res.ok) {
            if (res.status === 429) setError(body.error);
            result = { "com.br": "erro", com: "erro" };
          } else {
            result = body.result;
          }
        } catch {
          result = { "com.br": "erro", com: "erro" };
        }
        if (runId.current !== id) return;
        results[label] = result;
        setRows((current) => current.map((r) => (r.label === label ? { ...r, result } : r)));
        setPending((p) => p - 1);
      }
    }

    await Promise.all(Array.from({ length: CONCURRENCY }, worker));
    return results;
  }

  function search(input: CoupleInput) {
    const labels = suggestLabels(input);
    const id = ++runId.current;
    setError(null);
    setPending(labels.length);
    setRows(labels.map((label) => ({ label })));
    if (labels.length > 0) checkAll(labels, id);

    // Link compartilhável: um manda pro outro já com a busca feita.
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(input)) if (value) params.set(key, value);
    window.history.replaceState(null, "", `?${params}`);
  }

  useEffect(() => {
    if (initialLabels.length === 0) return;
    const id = runId.current;
    checkAll(initialLabels, id);
    // No StrictMode o efeito roda duas vezes: a primeira rodada é descartada.
    return () => {
      if (runId.current === id) runId.current += 1;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!form.nome1.trim() || !form.nome2.trim()) {
      setError("Preencha os dois nomes.");
      return;
    }
    search(form);
  }

  async function onCustom(event: FormEvent) {
    event.preventDefault();
    const original = customText.trim().replace(/^(https?:\/\/)?(www\.)?/i, "");
    const label = toLabel(original.replace(/\.(com\.br|com|br|net|org)\/?$/i, ""));
    if (!isValidLabel(label)) {
      setError("Digite só o nome, de 2 a 26 letras ou números. Ex.: anaejoao.com.br");
      return;
    }
    setError(null);
    setCustomText("");
    if (rows.some((r) => r.label === label)) return;
    const id = runId.current;

    // Com hífen: mantém o que o casal digitou, mas confere junto a versão sem.
    const plain = label.replace(/-/g, "");
    const first: Row[] = [{ label, original, custom: true }];
    if (plain !== label && isValidLabel(plain) && !rows.some((r) => r.label === plain)) {
      first.push({ label: plain, custom: true, variantOf: label });
    }
    setRows((current) => [...first, ...current]);
    setPending((p) => p + first.length);
    const results = await checkAll(
      first.map((r) => r.label),
      id
    );

    // Já tem dono nos dois: oferece parecidos em vez de só dizer não.
    const result = results[label];
    if (!result || !TLDS.every((tld) => result[tld] === "registrado")) return;
    const variants = variationsOf(label, form.data).filter(
      (v) => !rowsRef.current.some((r) => r.label === v)
    );
    if (variants.length === 0 || runId.current !== id) return;
    setRows((current) => {
      const at = current.findIndex((r) => r.label === label) + first.length;
      const added = variants.map((v) => ({ label: v, custom: true, variantOf: label }));
      return [...current.slice(0, at), ...added, ...current.slice(at)];
    });
    setPending((p) => p + variants.length);
    checkAll(variants, id);
  }

  const done = rows.length > 0 && pending === 0;
  // Reordena só no fim, pra lista não pular enquanto as respostas chegam.
  // O que o casal digitou fica em cima, na ordem em que digitou.
  const typed = rows.filter((r) => r.custom);
  const suggested = rows.filter((r) => !r.custom);
  const ordered = [
    ...typed,
    ...(done ? [...suggested].sort((x, y) => rank(y) - rank(x)) : suggested),
  ];
  const best = done ? suggested.length > 0 && ordered.find((r) => !r.custom && isAvailable(r)) : undefined;

  return (
    <div>
      <form onSubmit={onCustom} className="flex flex-col gap-6">
        <label className="flex flex-col gap-1">
          <span className={LABEL}>Já tem um nome em mente?</span>
          <input
            className={FIELD}
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="anaejoao.com.br"
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
          />
        </label>
        <button
          type="submit"
          className="penne-roll justify-self-start self-start font-display text-3xl uppercase leading-none text-[#dba58c]"
        >
          <RollText text="Consultar →" />
        </button>
      </form>

      <p className="my-12 flex items-center gap-4 font-mono text-[11px] uppercase text-cream/55 sm:my-16">
        <span className="h-px flex-1 bg-cream/10" />
        ou deixa a gente sugerir
        <span className="h-px flex-1 bg-cream/10" />
      </p>

      <form onSubmit={onSubmit} className="grid gap-8 sm:grid-cols-2 sm:gap-x-10">
        <label className="flex flex-col gap-1">
          <span className={LABEL}>Nome 1</span>
          <input
            className={FIELD}
            value={form.nome1}
            onChange={(e) => setForm({ ...form, nome1: e.target.value })}
            placeholder="Ana"
            autoComplete="off"
            required
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className={LABEL}>Nome 2</span>
          <input
            className={FIELD}
            value={form.nome2}
            onChange={(e) => setForm({ ...form, nome2: e.target.value })}
            placeholder="João"
            autoComplete="off"
            required
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className={LABEL}>Data do casamento (opcional)</span>
          <input
            type="date"
            className={`${FIELD} [color-scheme:dark]`}
            value={form.data ?? ""}
            onChange={(e) => setForm({ ...form, data: e.target.value })}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className={LABEL}>Sobrenome da família (opcional)</span>
          <input
            className={FIELD}
            value={form.sobrenome ?? ""}
            onChange={(e) => setForm({ ...form, sobrenome: e.target.value })}
            placeholder="Souza"
            autoComplete="off"
          />
        </label>
        <button
          type="submit"
          className="penne-roll justify-self-start font-display text-3xl uppercase leading-none text-[#dba58c] sm:col-span-2"
        >
          <RollText text="Sugerir domínios →" />
        </button>
      </form>

      {error && (
        <p role="alert" className="mt-8 font-mono text-xs uppercase text-[#dba58c]">
          {error}
        </p>
      )}

      {rows.length > 0 && (
        <section className="mt-14 sm:mt-20" aria-live="polite">
          <div className="border-b border-cream/10 pb-8">
            <p className="font-mono text-xs uppercase text-cream/55">
              {done
                ? `${rows.filter(isAvailable).length} de ${rows.length} com algum endereço livre`
                : `Consultando ${pending} de ${rows.length}…`}
            </p>
          </div>

          <ol>
            {ordered.map((row) => (
              <DomainRow key={row.label} row={row} best={row === best} />
            ))}
          </ol>
        </section>
      )}
    </div>
  );
}

function isAvailable(row: Row) {
  return TLDS.some((tld) => row.result?.[tld] === "livre");
}

function rank(row: Row) {
  return evaluate(row.label, row.original).score + availabilityBonus(row.result) + (row.custom ? 5 : 0);
}

function DomainRow({ row, best }: { row: Row; best: boolean }) {
  const { tips } = evaluate(row.label, row.original);
  const free = TLDS.find((tld) => row.result?.[tld] === "livre");
  const taken = row.result && TLDS.every((tld) => row.result![tld] === "registrado");

  return (
    <li className="grid gap-4 border-b border-cream/10 py-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-8">
      <div className="flex min-w-0 flex-col gap-3">
        <span
          className={`break-all font-display text-3xl uppercase leading-[0.95] sm:text-4xl ${
            taken ? "text-cream/35" : ""
          }`}
        >
          {row.label}
          {row.variantOf && (
            <span className="ml-3 align-middle font-mono text-[11px] normal-case text-cream/55">
              parecido com {row.variantOf}
            </span>
          )}
          {best && (
            <span className="ml-3 align-middle font-mono text-[11px] normal-case text-[#dba58c]">
              ★ nossa sugestão
            </span>
          )}
        </span>
        <span className="flex flex-wrap gap-2">
          {TLDS.map((tld) => (
            <Status key={tld} tld={tld} status={row.result?.[tld]} />
          ))}
          {taken && (
            <span className="rounded-full bg-cream/10 px-2.5 py-1 font-mono text-[11px] text-cream/75">
              {row.custom && !row.variantOf ? "Já tem dono. Veja os parecidos abaixo" : "Já tem dono"}
            </span>
          )}
          {tips.map((tip) => (
            <span
              key={tip.text}
              className={`rounded-full px-2.5 py-1 font-mono text-[11px] ${
                tip.tone === "bom" ? "bg-cream/10 text-cream/75" : "bg-[#dba58c]/10 text-[#dba58c]/90"
              }`}
            >
              {tip.text}
            </span>
          ))}
        </span>
      </div>

      {free && (
        <a
          href={whatsappUrl(
            `Oi! Vi no site da Penne que o domínio ${row.label}.${free} está livre e quero um site de casamento com ele.`
          )}
          target="_blank"
          rel="noopener"
          className="penne-roll justify-self-start font-display text-xl uppercase leading-none text-[#dba58c] sm:justify-self-end"
        >
          <RollText text="Quero esse ↗" />
        </a>
      )}
    </li>
  );
}

function Status({ tld, status }: { tld: Tld; status?: CheckResult[Tld] }) {
  const base = "rounded-full border px-2.5 py-1 font-mono text-[11px]";
  if (!status) {
    return <span className={`${base} animate-pulse border-cream/15 text-cream/45`}>.{tld} …</span>;
  }
  if (status === "livre") {
    return <span className={`${base} border-[#dba58c] text-[#dba58c]`}>.{tld} livre</span>;
  }
  if (status === "registrado") {
    return <span className={`${base} border-cream/15 text-cream/40 line-through`}>.{tld}</span>;
  }
  return (
    <span className={`${base} border-cream/15 text-cream/45`} title="Não deu pra conferir agora">
      .{tld} ?
    </span>
  );
}
