export type ViewMode = "slides" | "carousel";

const MODES: { id: ViewMode; label: string }[] = [
  { id: "slides", label: "Um a um" },
  { id: "carousel", label: "Carrossel" },
];

// Menu flutuante no meio da tela, à direita, pra trocar o modo de
// visualização dos cases. O ■ marca o modo ativo. No celular fica logo abaixo
// do contador, pra não cobrir o card do carrossel.
export default function ViewMenu({
  mode,
  visible,
  onChange,
}: {
  mode: ViewMode;
  visible: boolean;
  onChange: (mode: ViewMode) => void;
}) {
  return (
    <nav
      aria-label="Modo de visualização"
      inert={!visible}
      className={`fixed right-6 top-24 z-30 flex flex-col sm:top-1/2 sm:-translate-y-1/2 items-end gap-2.5 font-mono text-[11px] uppercase transition-opacity duration-500 [text-shadow:0_0_12px_rgb(0_0_0/0.6)] sm:right-10 sm:text-xs ${
        visible ? "" : "pointer-events-none opacity-0"
      }`}
    >
      {MODES.map(({ id, label }) => {
        const active = mode === id;
        return (
          <button
            key={id}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(id)}
            className={`flex items-center gap-2.5 transition-colors ${
              active ? "text-cream" : "text-cream/55 hover:text-cream"
            }`}
          >
            {label}
            <span
              aria-hidden
              className={`size-1.5 transition-colors ${active ? "bg-cream" : "bg-transparent"}`}
            />
          </button>
        );
      })}
    </nav>
  );
}
