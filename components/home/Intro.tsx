import RollText from "./RollText";

// Cada passo tem um texto pra mouse e outro pra tela de toque, onde o site
// aparece sozinho depois de um instante no case.
const STEPS = [
  { mouse: "Role a página: um casamento por tela", touch: "Role a página: um casamento por tela" },
  {
    mouse: "Pare o mouse sobre o nome do casal e o site aparece no fundo",
    touch: "Espere um instante e o site aparece no fundo",
  },
  { mouse: "Clique no nome pra abrir o site ao vivo", touch: "Toque no nome pra abrir o site ao vivo" },
];

export default function Intro({
  active,
  hasSites,
  onStart,
}: {
  active: boolean;
  hasSites: boolean;
  onStart: () => void;
}) {
  return (
    <section
      data-slide
      data-index={-1}
      data-active={active}
      aria-labelledby="penne-intro-title"
      className="penne-slide relative h-dvh snap-start overflow-hidden"
    >
      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10">
        <h1
          id="penne-intro-title"
          className="font-display text-[17vw] uppercase leading-[0.86] sm:text-[clamp(56px,11vw,190px)]"
        >
          <span className="penne-line">
            <span>
              Sites{" "}
              <span className="font-serif font-medium normal-case italic text-[#dba58c]">de</span>
            </span>
          </span>
          <span className="penne-line">
            <span>casamento</span>
          </span>
        </h1>

        <div className="penne-intro-body mt-6 grid gap-8 sm:mt-10 lg:grid-cols-[minmax(0,28rem)_minmax(0,1fr)] lg:items-end lg:gap-16">
          <p className="max-w-md text-base leading-relaxed text-cream/75 sm:text-lg">
            A Penne cria sites de casamento sob medida, cada um com as cores, o jeito e a
            história do casal. Se vocês procuram um site para o casamento que não pareça modelo
            pronto, aqui estão alguns casais que já ganharam o seu.
          </p>

          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <ol className="flex flex-col gap-2.5 font-mono text-[11px] uppercase leading-snug text-cream/60">
              {STEPS.map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="tabular-nums text-cream/35">{String(i + 1).padStart(2, "0")}</span>
                  <span className="[@media(hover:none)]:hidden">{step.mouse}</span>
                  <span className="hidden [@media(hover:none)]:inline">{step.touch}</span>
                </li>
              ))}
            </ol>

            {hasSites && (
              <button
                type="button"
                onClick={onStart}
                className="penne-roll shrink-0 self-start font-display text-lg uppercase leading-none sm:self-auto sm:text-xl"
              >
                <RollText text="Ver os casamentos ↓" />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
