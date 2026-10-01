"use client";

import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
  type SyntheticEvent,
} from "react";
import type { Site } from "@/lib/types";
import RingsLoader from "./RingsLoader";
import RollText from "./RollText";

// Quanto tempo o mouse precisa ficar parado sobre o nome até a imagem do site
// aparecer no fundo. Tem que bater com --dwell no CSS.
const DWELL_MS = 700;

// Velocidade com que o fundo percorre a página inteira depois de revelado.
const PAN_SPEED_PX_S = 140;

function isTouch() {
  return window.matchMedia("(hover: none)").matches;
}

export default function SiteSlide({
  site,
  index,
  active,
}: {
  site: Site;
  index: number;
  active: boolean;
}) {
  const [dwelling, setDwelling] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const pageViewportRef = useRef<HTMLDivElement>(null);
  const [pan, setPan] = useState(0);

  // Quanto a imagem da página inteira precisa subir pra mostrar o fim do site.
  const measurePan = (e: SyntheticEvent<HTMLImageElement>) => {
    const viewport = pageViewportRef.current;
    if (!viewport) return;
    setPan(Math.min(0, viewport.clientHeight - e.currentTarget.offsetHeight));
  };

  const startDwell = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    window.clearTimeout(timer.current);
    setDwelling(true);
    timer.current = window.setTimeout(() => setRevealed(true), DWELL_MS);
  };

  const stopDwell = () => {
    window.clearTimeout(timer.current);
    setDwelling(false);
    setRevealed(false);
  };

  // Em telas de toque não há hover: a "espera" conta enquanto o case está na tela.
  useEffect(() => {
    if (!active || !isTouch()) return;
    const frame = requestAnimationFrame(() => setDwelling(true));
    const reveal = window.setTimeout(() => setRevealed(true), DWELL_MS);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(reveal);
      setDwelling(false);
      setRevealed(false);
    };
  }, [active]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const [first, second] = site.couple.split(/\s*&\s*/);
  // Cor do case clareada pra ter contraste no fundo escuro.
  const accent = `color-mix(in oklab, ${site.color} 65%, white)`;

  return (
    <section
      data-slide
      data-index={index}
      data-active={active}
      data-dwelling={dwelling}
      data-revealed={revealed}
      aria-label={site.couple}
      className="penne-slide relative h-dvh snap-start overflow-hidden"
    >
      {/* Mobile (ou sem captura da página inteira): screenshot vertical da home */}
      {site.imageUrl && (
        <div className={`penne-bg absolute inset-0 ${site.fullPageImageUrl ? "sm:hidden" : ""}`}>
          <Image
            src={site.imageUrl}
            alt=""
            fill
            sizes="100vw"
            preload={index === 0}
            className="object-cover object-top"
          />
        </div>
      )}

      {/* Desktop: a página inteira, que começa na home e desce devagar pelo site */}
      {site.fullPageImageUrl && (
        <div ref={pageViewportRef} className="penne-bg absolute inset-0 hidden sm:block">
          <Image
            src={site.fullPageImageUrl}
            alt=""
            width={1440}
            height={900}
            sizes="100vw"
            onLoad={measurePan}
            className="penne-page h-auto w-full"
            style={
              {
                "--pan": `${pan}px`,
                "--pan-duration": `${Math.abs(pan) / PAN_SPEED_PX_S}s`,
              } as CSSProperties
            }
          />
        </div>
      )}
      <div className="penne-veil absolute inset-0 bg-gradient-to-t from-night via-night/35 to-transparent" />
      {/* Separa o cabeçalho da Penne do menu do próprio site quando revelado */}
      <div className="penne-top-veil absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-night/80 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10">
        <a
          href={site.liveUrl}
          target="_blank"
          rel="noreferrer noopener"
          onPointerEnter={startDwell}
          onPointerLeave={stopDwell}
          className="penne-name inline-block font-display text-[21vw] sm:text-[clamp(64px,15vw,250px)] uppercase leading-[0.86] focus:outline-none"
        >
          <span className="penne-line">
            <span>{first}</span>
          </span>
          {second && (
            <span className="penne-line">
              <span>
                <span
                  className="penne-amp font-serif font-medium normal-case italic"
                  style={{ color: accent }}
                >
                  &amp;
                </span>{" "}
                {second}
              </span>
            </span>
          )}
        </a>

        <div className="mt-5 flex items-center gap-5 sm:mt-6">
          <RingsLoader color={accent} />
          <span className="font-mono text-[11px] uppercase text-cream/60 [@media(hover:none)]:hidden">
            Pare o mouse sobre o nome
          </span>
          <a
            href={site.liveUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="penne-roll ml-auto font-display text-lg uppercase leading-none sm:text-xl"
          >
            <RollText text="Ver site ↗" />
          </a>
        </div>
      </div>
    </section>
  );
}
