import type { Site } from "@/lib/types";
import { splitCouple } from "@/lib/case-copy";

// Cor do case clareada pra ter contraste no fundo escuro.
export function accentColor(site: Pick<Site, "color">) {
  return `color-mix(in oklab, ${site.color} 65%, white)`;
}

// Nome do casal com o "&" em serifa itálica na cor do case. Empilhado (um nome
// por linha, com a entrada .penne-line) ou numa linha só.
export default function CoupleName({
  site,
  stacked = true,
}: {
  site: Site;
  stacked?: boolean;
}) {
  const { first, second } = splitCouple(site.couple);
  const amp = (
    <span
      className="penne-amp font-serif font-medium normal-case italic"
      style={{ color: accentColor(site) }}
    >
      &amp;
    </span>
  );

  if (!stacked) {
    return (
      <span className="penne-line">
        <span>
          {first}
          {second && (
            <>
              {" "}
              {amp} {second}
            </>
          )}
        </span>
      </span>
    );
  }

  return (
    <>
      <span className="penne-line">
        <span>{first}</span>
      </span>
      {second && (
        <span className="penne-line">
          <span>
            {amp} {second}
          </span>
        </span>
      )}
    </>
  );
}
