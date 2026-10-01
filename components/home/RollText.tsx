import type { CSSProperties } from "react";

// Cada letra tem uma cópia logo abaixo; no hover do elemento `.penne-roll`
// mais próximo, as duas sobem juntas (com atraso por letra). As letras ficam
// agrupadas por palavra pra quebra de linha acontecer só entre palavras.
export default function RollText({ text }: { text: string }) {
  let charIndex = 0;

  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {text.split(" ").map((word, w) => (
          <span key={w}>
            {w > 0 && " "}
            <span className="whitespace-nowrap">
              {[...word].map((char) => {
                const i = charIndex++;
                return (
                  <span
                    key={i}
                    className="penne-roll-char"
                    style={{ "--i": i } as CSSProperties}
                  >
                    <span>{char}</span>
                    <span>{char}</span>
                  </span>
                );
              })}
            </span>
          </span>
        ))}
      </span>
    </>
  );
}
