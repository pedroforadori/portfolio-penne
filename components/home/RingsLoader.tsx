// Indicador da espera sobre o nome: duas alianças que rolam uma em direção à
// outra durante a espera e terminam entrelaçadas quando a imagem do site é
// revelada. O movimento vem do CSS (.penne-ring-a / .penne-ring-b, duração
// --dwell): cada grupo é transladado até a posição e girado no próprio
// centro (os círculos ficam na origem local). A pedrinha e o brilho é que
// deixam o giro visível — um círculo liso girando parece parado.
import { useId } from "react";

const R = 9;

export default function RingsLoader({ color }: { color: string }) {
  const clipId = useId();

  return (
    <svg
      viewBox="0 0 92 28"
      aria-hidden
      className="penne-rings h-7 w-[92px] shrink-0 overflow-visible"
      fill="none"
      strokeWidth={2}
    >
      <defs>
        {/* Quarto superior direito da aliança A (em coordenadas locais dela):
            redesenhado por cima da B pra dar a ilusão de entrelaçamento. Fica
            num grupo que só anda, sem girar, pro recorte não rodar junto. */}
        <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
          <rect x={0} y={-R - 2} width={R + 2} height={R + 2} />
        </clipPath>
      </defs>

      <g className="penne-ring-a">
        <circle r={R} stroke="var(--cream)" />
        {/* brilho */}
        <circle cy={-R} r={1.8} fill="var(--cream)" />
      </g>
      <g className="penne-ring-b">
        <circle r={R} stroke={color} />
        {/* pedrinha */}
        <path d={`M0 ${-R - 5} L3 ${-R - 2} L0 ${-R + 0.5} L-3 ${-R - 2} Z`} fill={color} />
      </g>
      <g className="penne-ring-a-over">
        <circle r={R} stroke="var(--cream)" clipPath={`url(#${clipId})`} />
      </g>
    </svg>
  );
}
