"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Testimonial } from "@/lib/types";
import RollText from "./RollText";

export type HomeTestimonial = Testimonial & { caseHref?: string };

const pad = (n: number) => String(n).padStart(2, "0");

// Tela da home entre o último case e o blog: os depoimentos dos casais num
// carrossel horizontal (swipe nativo no celular, setas no desktop).
export default function TestimonialsSlide({
  testimonials,
  index,
  active,
}: {
  testimonials: HomeTestimonial[];
  index: number;
  active: boolean;
}) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [current, setCurrent] = useState(0);
  // No desktop cabem vários cards: o fim do trilho chega antes do último card
  // encostar na esquerda, então a seta "próxima" olha pra rolagem.
  const [atEnd, setAtEnd] = useState(testimonials.length <= 1);

  // O card "atual" é o que está encostado na borda esquerda do trilho.
  const onScroll = () => {
    const track = trackRef.current;
    const card = track?.firstElementChild as HTMLElement | null;
    if (!track || !card) return;
    const step = card.offsetWidth + parseFloat(getComputedStyle(track).columnGap || "0");
    setCurrent(Math.min(testimonials.length - 1, Math.round(track.scrollLeft / step)));
    setAtEnd(track.scrollLeft + track.clientWidth >= track.scrollWidth - 2);
  };

  // Confere o fim do trilho na montagem e quando a tela muda de largura (no
  // desktop, três cards podem caber inteiros sem rolagem nenhuma).
  useEffect(() => {
    onScroll();
    window.addEventListener("resize", onScroll);
    return () => window.removeEventListener("resize", onScroll);
  });

  const go = (direction: 1 | -1) => {
    const track = trackRef.current;
    const card = track?.firstElementChild as HTMLElement | null;
    if (!track || !card) return;
    track.scrollBy({ left: direction * card.offsetWidth, behavior: "smooth" });
  };

  return (
    <section
      id="avaliacoes"
      data-slide
      data-index={index}
      data-active={active}
      aria-labelledby="penne-testimonials-title"
      className="penne-slide relative h-dvh snap-start overflow-hidden"
    >
      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10">
        <h2
          id="penne-testimonials-title"
          className="font-display text-[17vw] uppercase leading-[0.86] sm:text-[clamp(56px,9vw,150px)]"
        >
          <span className="penne-line">
            <span>
              {/* Sem acento em cima: a linha corta o que passa da altura das maiúsculas */}
              Quem{" "}
              <span className="font-serif font-medium normal-case italic text-[#dba58c]">
                casou
              </span>
            </span>
          </span>
          <span className="penne-line">
            <span>recomenda</span>
          </span>
        </h2>

        <div className="penne-intro-body mt-6 sm:mt-10">
          <ul
            ref={trackRef}
            onScroll={onScroll}
            aria-label="Avaliações dos casais"
            className="penne-scroller flex snap-x snap-mandatory gap-6 overflow-x-auto border-t border-cream/10 sm:gap-10"
          >
            {testimonials.map((testimonial) => (
              <li
                key={testimonial.id}
                className="flex w-full shrink-0 snap-start flex-col gap-4 pt-5 sm:w-[calc((100%-2.5rem)/2)] sm:pt-6 lg:w-[calc((100%-5rem)/3)]"
              >
                <Stars rating={testimonial.rating} />
                <blockquote className="font-serif text-xl italic leading-snug sm:text-2xl">
                  “{testimonial.text}”
                </blockquote>
                <div className="mt-auto flex items-baseline justify-between gap-4 font-mono text-[11px] uppercase">
                  <span className="text-cream/70">{testimonial.couple}</span>
                  {testimonial.caseHref && (
                    <Link
                      href={testimonial.caseHref}
                      className="penne-roll shrink-0 text-[#dba58c]"
                    >
                      <RollText text="Ver o site →" />
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </ul>

          {testimonials.length > 1 && (
            <div className="mt-6 flex items-center gap-5 font-mono text-xs uppercase leading-none sm:mt-8">
              <button
                type="button"
                onClick={() => go(-1)}
                disabled={current === 0}
                aria-label="Avaliação anterior"
                className="text-cream/70 transition-colors hover:text-cream disabled:opacity-30"
              >
                ←
              </button>
              <span className="tabular-nums text-cream/70">
                {pad(current + 1)} / {pad(testimonials.length)}
              </span>
              <button
                type="button"
                onClick={() => go(1)}
                disabled={atEnd}
                aria-label="Próxima avaliação"
                className="text-cream/70 transition-colors hover:text-cream disabled:opacity-30"
              >
                →
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <span role="img" aria-label={`Nota ${rating} de 5`} className="text-sm tracking-[0.2em]">
      <span className="text-[#dba58c]">{"★".repeat(rating)}</span>
      <span className="text-cream/25">{"★".repeat(5 - rating)}</span>
    </span>
  );
}
