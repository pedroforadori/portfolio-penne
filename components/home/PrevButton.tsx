import type { ReactNode } from "react";

// Setas pra voltar, com legenda: "↑ Voltar um" volta uma tela (do primeiro
// case, pra abertura) e "⤒ Voltar tudo" volta ao início. Centralizadas no
// alto: lado a lado no header do sm pra cima (o centro dele fica livre depois
// da abertura); no celular, uma embaixo da outra, entre os menus flutuantes,
// porque o centro do header é do WhatsApp. No hover a seta sai por cima e
// volta por baixo.
export default function PrevButton({
  canGoBack,
  canGoHome,
  onBack,
  onHome,
}: {
  canGoBack: boolean;
  // Do segundo case em diante: no primeiro, voltar um já é voltar ao início.
  canGoHome: boolean;
  onBack: () => void;
  onHome: () => void;
}) {
  return (
    <div
      inert={!canGoBack}
      className={`fixed left-1/2 top-24 z-30 flex -translate-x-1/2 flex-col items-start gap-1 font-mono text-[11px] mix-blend-difference transition-opacity duration-500 sm:top-8 sm:flex-row sm:items-center sm:gap-5 sm:text-xs ${
        canGoBack ? "" : "pointer-events-none opacity-0"
      }`}
    >
      <Arrow label="Voltar um" onClick={onBack}>
        <path d="M8 23V2M2 8l6-6 6 6" />
      </Arrow>
      {/* Some do layout (em vez de só ficar transparente) pra "Voltar um"
          ficar centralizado sozinho no primeiro case */}
      {canGoHome && (
        <Arrow label="Voltar tudo" onClick={onHome}>
          <path d="M8 23V7M2 13l6-6 6 6M2 1.5h12" />
        </Arrow>
      )}
    </div>
  );
}

function Arrow({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="penne-prev penne-fade-in flex items-center gap-2 py-1 text-cream/70 transition-colors hover:text-cream focus-visible:text-cream"
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
    </button>
  );
}
