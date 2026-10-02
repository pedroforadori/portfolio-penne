import { useId, type CSSProperties, type ReactNode } from "react";

// Uma tela da home, desenhada em miniatura no tooltip das setas.
export type MiniScreen =
  | { kind: "intro" }
  | { kind: "case"; accent: string }
  | { kind: "testimonials" }
  | { kind: "blog" };

// Setas pra voltar, com legenda: "↑ Voltar um" volta uma tela (do primeiro
// case, pra abertura) e "⤒ Voltar tudo" volta ao início — as duas sempre
// juntas, mesmo no primeiro case, onde levam ao mesmo lugar. Centralizadas
// e lado a lado no header (o centro dele fica livre depois da abertura). Só
// do sm pra cima: no celular não há setas. No hover a seta sai por cima e
// volta por baixo, e um tooltip mostra uma telinha de computador rolando a
// home da tela atual até o destino (sem legenda visível).
export default function PrevButton({
  canGoBack,
  screens,
  position,
  backHint,
  onBack,
  onHome,
}: {
  canGoBack: boolean;
  // Todas as telas da home, da abertura ao blog, e a posição da atual nelas.
  screens: MiniScreen[];
  position: number;
  // Pra onde "Voltar um" leva, ex.: "Ir para Vania & Mauro".
  backHint: string;
  onBack: () => void;
  onHome: () => void;
}) {
  return (
    <div
      inert={!canGoBack}
      className={`fixed left-1/2 top-8 z-30 hidden -translate-x-1/2 items-center gap-5 whitespace-nowrap font-mono text-xs [text-shadow:0_0_12px_rgb(0_0_0/0.6)] transition-opacity duration-500 sm:flex ${
        canGoBack ? "" : "pointer-events-none opacity-0"
      }`}
    >
      <Arrow
        label="Voltar um"
        hint={backHint}
        preview={<MiniSite screens={screens} from={position} to={Math.max(0, position - 1)} />}
        onClick={onBack}
      >
        <path d="M8 23V2M2 8l6-6 6 6" />
      </Arrow>
      <Arrow
        label="Voltar tudo"
        hint="Ir para a abertura"
        preview={<MiniSite screens={screens} from={position} to={0} />}
        onClick={onHome}
      >
        <path d="M8 23V7M2 13l6-6 6 6M2 1.5h12" />
      </Arrow>
    </div>
  );
}

function Arrow({
  label,
  hint,
  preview,
  onClick,
  children,
}: {
  label: string;
  hint: string;
  preview: ReactNode;
  onClick: () => void;
  children: ReactNode;
}) {
  const hintId = useId();

  return (
    <button
      type="button"
      onClick={onClick}
      aria-describedby={hintId}
      className="penne-prev relative flex items-center gap-2 py-1 text-cream/70 transition-colors hover:text-cream focus-visible:text-cream"
    >
      <span className="block h-5 w-3.5 overflow-hidden">
        <svg
          viewBox="0 0 16 24"
          aria-hidden
          className="penne-prev-arrow block h-full w-full"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.25}
        >
          {children}
        </svg>
      </span>
      {label}
      <span role="tooltip" className="penne-tip">
        {preview}
        {/* Sem legenda visível (a telinha já mostra o destino); o texto fica
            só pra leitores de tela */}
        <span id={hintId} className="sr-only">
          {hint}
        </span>
      </span>
    </button>
  );
}

// Monitor em miniatura com as telas da home empilhadas: no hover, a pilha rola
// da tela atual (`from`) até o destino (`to`), em loop.
function MiniSite({ screens, from, to }: { screens: MiniScreen[]; from: number; to: number }) {
  return (
    <span aria-hidden className="flex flex-col items-center">
      <span className="penne-mini-screen block overflow-hidden rounded-[3px] border border-cream/60 bg-night">
        <span
          className="penne-mini-col block"
          style={{ "--from": from, "--to": to } as CSSProperties}
        >
          {screens.map((screen, i) => (
            <MiniSlide key={i} screen={screen} />
          ))}
        </span>
      </span>
      {/* pezinho do monitor */}
      <span className="block h-1.5 w-2 bg-cream/40" />
      <span className="block h-[2px] w-7 rounded-full bg-cream/40" />
    </span>
  );
}

const BAR = "block rounded-[1px] bg-cream";

function MiniSlide({ screen }: { screen: MiniScreen }) {
  return (
    <span className="penne-mini-slide relative block">
      {screen.kind === "intro" && (
        <>
          <span className="absolute right-2 top-2 size-3.5 rounded-full border border-cream/70" />
          <span className="absolute bottom-2.5 left-2 flex w-[60%] flex-col gap-[3px]">
            <span className={`${BAR} h-[5px] w-[55%]`} />
            <span className={`${BAR} h-[5px] w-full`} />
          </span>
        </>
      )}
      {screen.kind === "case" && (
        <span className="absolute bottom-2.5 left-2 flex w-[62%] flex-col gap-[3px]">
          <span className={`${BAR} h-[7px] w-[75%]`} />
          <span className="flex items-center gap-[3px]">
            <span className="size-[6px] shrink-0 rounded-full" style={{ background: screen.accent }} />
            <span className={`${BAR} h-[7px] w-full`} />
          </span>
        </span>
      )}
      {(screen.kind === "testimonials" || screen.kind === "blog") && (
        <span className="absolute inset-x-2 bottom-2 flex flex-col gap-[3px]">
          <span className={`${BAR} h-[4px] w-[45%]`} />
          <span className={`${BAR} mb-[2px] h-[4px] w-[60%]`} />
          {screen.kind === "testimonials" ? (
            <span className="flex gap-[3px]">
              <span className="block h-[6px] flex-1 rounded-[1px] bg-cream/30" />
              <span className="block h-[6px] flex-1 rounded-[1px] bg-cream/30" />
              <span className="block h-[6px] flex-1 rounded-[1px] bg-cream/30" />
            </span>
          ) : (
            <>
              <span className="block h-px w-full bg-cream/30" />
              <span className="block h-px w-full bg-cream/30" />
              <span className="block h-px w-full bg-cream/30" />
            </>
          )}
        </span>
      )}
    </span>
  );
}
