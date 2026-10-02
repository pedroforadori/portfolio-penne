export type ViewMode = "slides" | "carousel";

const MODES: { id: ViewMode; label: string }[] = [
  { id: "slides", label: "Um a um" },
  { id: "carousel", label: "Carrossel" },
];

// Menu flutuante no meio da tela, à direita, pra trocar o modo de
// visualização dos cases. O ■ marca o modo ativo. Só do sm pra cima: no
// celular fica só o modo "um a um".
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
      className={`fixed right-10 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-end gap-2.5 font-mono text-xs transition-opacity duration-500 [text-shadow:0_0_12px_rgb(0_0_0/0.6)] sm:flex ${
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
