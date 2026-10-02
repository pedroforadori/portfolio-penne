import { PenneSeal } from "@/components/PenneLogo";
import RollText from "./RollText";

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
      className="penne-slide relative flex h-dvh snap-start flex-col overflow-hidden pt-20 sm:block sm:pt-0"
    >
      {/* No celular a tela é uma coluna: espaço do header, o selo centralizado
          no vão que sobra (encolhe em tela baixa, sem nunca encostar no
          título) e o texto embaixo. Do sm pra cima, o selo fica no vazio à
          direita do título (o wrapper some com sm:contents). Em celular baixo
          não há vão pro selo: some, e as alianças do header aparecem (Home). */}
      <div className="flex min-h-0 flex-1 items-center justify-center px-6 py-4 sm:contents [@media(max-width:639.98px)_and_(max-height:680px)]:invisible">
        <PenneSeal className="penne-intro-seal aspect-square h-full max-h-[220px] sm:absolute sm:right-10 sm:top-1/2 sm:h-auto sm:max-h-none sm:size-[clamp(220px,26vw,360px)] sm:-translate-y-1/2" />
      </div>

      <div className="p-6 sm:absolute sm:inset-x-0 sm:bottom-0 sm:p-10">
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

        <div className="penne-intro-body mt-4 grid gap-5 sm:mt-10 sm:gap-8 lg:relative lg:grid-cols-[minmax(0,28rem)_minmax(0,1fr)] lg:items-end lg:gap-16">
          <p className="max-w-md text-[15px] leading-normal text-cream/75 sm:text-lg sm:leading-relaxed">
            A Penne cria sites de casamento sob medida, com convite digital, confirmação de
            presença, lista de presentes e a história do casal, tudo com a cara de vocês. Se
            procuram um site para o casamento que não pareça modelo pronto, aqui estão alguns
            casais que já ganharam o seu.
          </p>

          {/* Centralizado na tela: embaixo do texto até o tablet; no desktop,
              onde o texto fica só na coluna da esquerda, no centro da página,
              alinhado com o fim do parágrafo. */}
          <div className="flex justify-center lg:pointer-events-none lg:absolute lg:inset-x-0 lg:bottom-0">
            {hasSites && (
              <button
                type="button"
                onClick={onStart}
                className="penne-roll shrink-0 font-display text-lg uppercase leading-none sm:text-xl lg:pointer-events-auto"
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
