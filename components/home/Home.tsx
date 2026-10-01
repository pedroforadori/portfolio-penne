"use client";

import { useEffect, useRef, useState } from "react";
import type { Site } from "@/lib/types";
import { whatsappUrl } from "@/lib/site-config";
import Intro from "./Intro";
import RollText from "./RollText";
import SiteSlide from "./SiteSlide";

const pad = (n: number) => String(n).padStart(2, "0");

export default function Home({ sites }: { sites: Site[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  // -1 é a abertura; daí em diante, o índice do case na tela.
  const [current, setCurrent] = useState(-1);

  const goToFirstSite = () => {
    scrollerRef.current
      ?.querySelector('[data-index="0"]')
      ?.scrollIntoView({ behavior: "smooth" });
  };

  // Descobre qual tela está visível pra atualizar o contador e disparar a
  // entrada do nome.
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setCurrent(Number((entry.target as HTMLElement).dataset.index));
          }
        }
      },
      { root: scroller, threshold: 0.6 }
    );
    scroller.querySelectorAll("[data-slide]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sites.length]);

  return (
    <div className="penne fixed inset-0 bg-night text-cream">
      <div
        ref={scrollerRef}
        className="penne-scroller h-full snap-y snap-mandatory overflow-y-auto"
      >
        <Intro active={current === -1} hasSites={sites.length > 0} onStart={goToFirstSite} />
        {sites.map((site, index) => (
          <SiteSlide key={site.id} site={site} index={index} active={index === current} />
        ))}
      </div>

      <header className="pointer-events-none fixed inset-x-0 top-0 z-20 flex items-start justify-between p-6 sm:p-10">
        <span className="font-serif text-3xl italic leading-none">Penne</span>
        <div className="flex flex-col items-end gap-3">
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener"
            className="penne-roll pointer-events-auto font-display text-base uppercase leading-none text-[#dba58c] sm:text-xl"
          >
            <RollText text="Orçamento no WhatsApp ↗" />
          </a>
          {sites.length > 0 && (
            <span
              className={`font-mono text-xs tabular-nums text-cream/70 transition-opacity duration-500 ${current < 0 ? "opacity-0" : ""}`}
            >
              {pad(Math.max(current, 0) + 1)} / {pad(sites.length)}
            </span>
          )}
        </div>
      </header>
    </div>
  );
}
