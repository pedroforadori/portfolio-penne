"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import type { Site } from "@/lib/types";
import { casePath } from "@/lib/case-copy";
import CoupleName from "./CoupleName";
import RollText from "./RollText";

// Quanto o scroll do mouse precisa acumular pra passar de case, e a pausa
// depois de cada passo (um "tique" de trackpad gera dezenas de eventos).
const WHEEL_THRESHOLD = 40;
const WHEEL_COOLDOWN_MS = 550;
const SWIPE_PX = 50;

// Cards visíveis de cada lado do centro, e quantos são renderizados: os que
// sobram nas pontas ficam invisíveis e é por eles que os cards entram e saem
// sem pular (inclusive ao clicar num card a duas posições de distância).
const VISIBLE = 2;
const WINDOW = 4;

const wrap = (position: number, length: number) => ((position % length) + length) % length;

// Carrossel infinito: a posição é um contador sem fim (pode ficar negativa ou
// passar do total) e cada "vaga" ao redor dela mostra o case
// posição % total. As vagas são a chave dos cards, então ao andar o mesmo
// elemento só muda de deslocamento e a transição é sempre suave.
export default function CarouselView({
  sites,
  initialIndex,
  onChange,
}: {
  sites: Site[];
  initialIndex: number;
  onChange: (index: number) => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const swipe = useRef({ x: 0, moved: false });
  const [position, setPosition] = useState(initialIndex);
  const positionRef = useRef(initialIndex);

  const goTo = useCallback(
    (next: number) => {
      positionRef.current = next;
      setPosition(next);
      onChange(wrap(next, sites.length));
    },
    [onChange, sites.length]
  );

  // Scroll do mouse/trackpad (vertical ou horizontal) e setas do teclado.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let accumulated = 0;
    let locked = false;
    let unlock = 0;
    const step = (delta: number) => goTo(positionRef.current + delta);

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (locked) return;
      accumulated += Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(accumulated) < WHEEL_THRESHOLD) return;
      step(Math.sign(accumulated));
      accumulated = 0;
      locked = true;
      unlock = window.setTimeout(() => (locked = false), WHEEL_COOLDOWN_MS);
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") step(1);
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") step(-1);
    };

    root.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    return () => {
      root.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(unlock);
    };
  }, [goTo]);

  // Card do lado: em vez de abrir o site, traz ele pro centro. Também ignora o
  // clique que encerra um arraste.
  const onCardClick = (e: MouseEvent, slot: number) => {
    if (swipe.current.moved || slot !== position) {
      e.preventDefault();
      if (!swipe.current.moved) goTo(slot);
    }
  };

  const site = sites[wrap(position, sites.length)];
  const slots = Array.from({ length: WINDOW * 2 + 1 }, (_, i) => position - WINDOW + i);

  return (
    <div
      ref={rootRef}
      className="penne-carousel absolute inset-0 flex touch-pan-y flex-col items-center justify-center gap-6 px-6 pt-16 select-none sm:gap-8"
      onPointerDown={(e) => (swipe.current = { x: e.clientX, moved: false })}
      onPointerUp={(e) => {
        const dx = e.clientX - swipe.current.x;
        if (Math.abs(dx) < SWIPE_PX) return;
        swipe.current.moved = true;
        goTo(positionRef.current + (dx < 0 ? 1 : -1));
      }}
    >
      <div className="penne-carousel-stage relative">
        {slots.map((slot) => {
          const s = sites[wrap(slot, sites.length)];
          const offset = slot - position;
          const distance = Math.abs(offset);
          const hidden = distance > VISIBLE;
          return (
            <a
              key={slot}
              href={s.liveUrl}
              target="_blank"
              rel="noreferrer noopener"
              draggable={false}
              aria-label={offset === 0 ? `Abrir o site de ${s.couple}` : `Ver ${s.couple}`}
              aria-hidden={hidden || undefined}
              tabIndex={hidden ? -1 : undefined}
              data-center={offset === 0}
              onClick={(e) => onCardClick(e, slot)}
              className="penne-card absolute inset-0 overflow-hidden bg-night"
              style={{ "--offset": offset, "--distance": distance, zIndex: 10 - distance } as CSSProperties}
            >
              <CardImage site={s} />
            </a>
          );
        })}
      </div>

      <div className="flex flex-col items-center gap-4 text-center">
        {/* key: remonta a cada troca pra repetir a entrada do nome */}
        <p
          key={position}
          className="penne-carousel-name font-display text-[clamp(36px,9vw,64px)] uppercase leading-[0.9] lg:text-[clamp(48px,6vw,104px)]"
        >
          <CoupleName site={site} stacked={false} />
        </p>
        <div className="flex items-center gap-6">
          <Link
            href={casePath(site)}
            className="penne-roll font-display text-lg uppercase leading-none text-cream/70 hover:text-cream sm:text-xl"
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
    </div>
  );
}

// Captura do dispositivo: celular nos cards em pé (mobile/tablet), computador
// nos cards deitados (desktop). Sem captura, o screenshot vertical da home.
function CardImage({ site }: { site: Site }) {
  const layers = [
    { src: site.fullPage?.mobile ?? site.imageUrl, className: "lg:hidden", sizes: "62vw" },
    { src: site.fullPage?.desktop ?? site.imageUrl, className: "hidden lg:block", sizes: "56vw" },
  ];

  return layers.map(({ src, className, sizes }) =>
    src ? (
      <Image
        key={className}
        src={src}
        alt=""
        fill
        sizes={sizes}
        draggable={false}
        className={`penne-card-image object-cover object-top ${className}`}
      />
    ) : null
  );
}
