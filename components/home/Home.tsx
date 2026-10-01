"use client";

import { useEffect, useRef, useState } from "react";
import type { Site } from "@/lib/types";
import SiteSlide from "./SiteSlide";

const pad = (n: number) => String(n).padStart(2, "0");

export default function Home({ sites }: { sites: Site[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);

  // Descobre qual case está na tela pra atualizar o contador e disparar a
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
      <h1 className="sr-only">Penne — Sites de casamento</h1>

      <div
        ref={scrollerRef}
        className="penne-scroller h-full snap-y snap-mandatory overflow-y-auto"
      >
        {sites.length === 0 ? (
          <p className="grid h-full place-items-center font-mono text-xs uppercase text-cream/60">
            Nenhum case publicado ainda.
          </p>
        ) : (
          sites.map((site, index) => (
            <SiteSlide
              key={site.id}
              site={site}
              index={index}
              active={index === current}
            />
          ))
        )}
      </div>

      <header className="pointer-events-none fixed inset-x-0 top-0 z-20 flex items-start justify-between p-6 sm:p-10">
        <span className="font-serif text-3xl italic leading-none">Penne</span>
        {sites.length > 0 && (
          <span className="font-mono text-xs tabular-nums text-cream/70">
            {pad(current + 1)} / {pad(sites.length)}
          </span>
        )}
      </header>
    </div>
  );
}
