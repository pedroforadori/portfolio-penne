// Indicador da espera sobre o nome: duas alianças que se aproximam durante a
// espera e terminam entrelaçadas quando a imagem do site é revelada. O
// movimento vem do CSS (.penne-ring-a / .penne-ring-b, duração --dwell).
import { useId } from "react";

const R = 9;
const CY = 14;

export default function RingsLoader({ color }: { color: string }) {
  const clipId = useId();

  return (
    <svg
      viewBox="0 0 64 28"
      aria-hidden
      className="penne-rings h-7 w-16 shrink-0 overflow-visible"
      fill="none"
      strokeWidth={2}
    >
      <defs>
        {/* Quarto superior direito da aliança A (em coordenadas locais dela):
            redesenhado por cima da B pra dar a ilusão de entrelaçamento. */}
        <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
          <rect x={0} y={CY - R - 2} width={R + 2} height={R + 2} />
        </clipPath>
      </defs>

      <g className="penne-ring-a">
        <circle cx={0} cy={CY} r={R} stroke="var(--cream)" />
      </g>
      <g className="penne-ring-b">
        <circle cx={0} cy={CY} r={R} stroke={color} />
      </g>
      <g className="penne-ring-a">
        <circle cx={0} cy={CY} r={R} stroke="var(--cream)" clipPath={`url(#${clipId})`} />
      </g>
    </svg>
  );
}
