"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import Link from "next/link";
import type { Site } from "@/lib/types";
import { casePath } from "@/lib/case-copy";
import CoupleName, { accentColor } from "./CoupleName";
import RingsLoader from "./RingsLoader";
import SiteBackground from "./SiteBackground";
import RollText from "./RollText";

// Quanto tempo o mouse precisa ficar parado sobre o nome até a imagem do site
// aparecer no fundo. Tem que bater com --dwell no CSS.
const DWELL_MS = 700;

function isTouch() {
  return window.matchMedia("(hover: none)").matches;
}

export default function SiteSlide({
  site,
  index,
  active,
  near,
}: {
  site: Site;
  index: number;
  active: boolean;
  // Vizinho do case na tela: pré-carrega o fundo.
  near: boolean;
}) {
  const [dwelling, setDwelling] = useState(false);
  const [dwelled, setDwelled] = useState(false);
  const [loaded, setLoaded] = useState(!site.imageUrl && !site.fullPage);
  // Só revela com a imagem inteira: no 4G ela ainda chegaria pela metade.
  const revealed = dwelled && loaded;
  // O fundo só entra quando o case chega perto da tela. Todos de uma vez
  // disputariam a banda e o primeiro demoraria a chegar.
  const [nearby, setNearby] = useState(false);
  if ((active || near) && !nearby) setNearby(true);
  const timer = useRef<number | undefined>(undefined);

  const startDwell = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    window.clearTimeout(timer.current);
    setDwelling(true);
    timer.current = window.setTimeout(() => setDwelled(true), DWELL_MS);
  };

  const stopDwell = () => {
    window.clearTimeout(timer.current);
    setDwelling(false);
    setDwelled(false);
  };

  // Em telas de toque não há hover: a "espera" conta enquanto o case está na tela.
  useEffect(() => {
    if (!active || !isTouch()) return;
    const frame = requestAnimationFrame(() => setDwelling(true));
    const reveal = window.setTimeout(() => setDwelled(true), DWELL_MS);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(reveal);
      setDwelling(false);
      setDwelled(false);
    };
  }, [active]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const accent = accentColor(site);

  return (
    <section
      data-slide
      data-index={index}
      data-active={active}
      data-dwelling={dwelling}
      data-revealed={revealed}
      data-waiting={dwelled && !loaded}
      aria-label={site.couple}
      className="penne-slide relative h-dvh snap-start overflow-hidden"
    >
      {nearby && <SiteBackground site={site} preload={near} onLoad={() => setLoaded(true)} />}
      <div className="penne-veil absolute inset-0 bg-gradient-to-t from-night via-night/35 to-transparent" />
      {/* Separa o cabeçalho da Penne do menu do próprio site quando revelado */}
      <div className="penne-top-veil absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-night/80 to-transparent" />

      {/* Do sm pra cima, começa à direita do menu Avaliações/Blog (SideNav),
          que fica no meio da tela à esquerda */}
      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10 sm:pl-44">
        <a
          href={site.liveUrl}
          target="_blank"
          rel="noreferrer noopener"
          onPointerEnter={startDwell}
          onPointerLeave={stopDwell}
          className="penne-name inline-block font-display text-[21vw] sm:text-[clamp(64px,15vw,250px)] uppercase leading-[0.86] focus:outline-none"
        >
          <CoupleName site={site} />
        </a>

        <div className="mt-5 flex items-center gap-5 sm:mt-6">
          <RingsLoader color={accent} />
          <span className="font-mono text-[11px] uppercase text-cream/60 [@media(hover:none)]:hidden">
            Pare o mouse sobre o nome
          </span>
          <Link
            href={casePath(site)}
            className="penne-roll ml-auto font-display text-lg uppercase leading-none text-cream/70 hover:text-cream sm:text-xl"
          >
            <RollText text="O projeto" />
          </Link>
          <a
            href={site.liveUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="penne-roll font-display text-lg uppercase leading-none sm:text-xl"
          >
            <RollText text="Ver site ↗" />
          </a>
        </div>
      </div>
    </section>
  );
}
