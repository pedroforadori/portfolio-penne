"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { PostMeta, Site } from "@/lib/types";
import { whatsappUrl } from "@/lib/site-config";
import BlogSlide from "./BlogSlide";
import CarouselView from "./CarouselView";
import Intro from "./Intro";
import RollText from "./RollText";
import SiteSlide from "./SiteSlide";
import ViewMenu, { type ViewMode } from "./ViewMenu";

const pad = (n: number) => String(n).padStart(2, "0");

export default function Home({ sites, posts }: { sites: Site[]; posts: PostMeta[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  // -1 é a abertura; daí em diante, o índice do case na tela. Depois do
  // último case vem a tela do blog.
  const [current, setCurrent] = useState(-1);
  const blogIndex = sites.length;
  const onCase = current >= 0 && current < sites.length;
  const [mode, setMode] = useState<ViewMode>("slides");

  const goToFirstSite = () => {
    scrollerRef.current
      ?.querySelector('[data-index="0"]')
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const changeMode = (next: ViewMode) => {
    setMode(next);
    // Volta pro modo "um a um" no case que estava no centro do carrossel.
    if (next === "slides") {
      scrollerRef.current
        ?.querySelector(`[data-index="${current}"]`)
        ?.scrollIntoView({ behavior: "instant" });
    }
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
  }, [sites.length, posts.length]);

  return (
    <div className="penne fixed inset-0 bg-night text-cream">
      <div
        ref={scrollerRef}
        inert={mode !== "slides"}
        className={`penne-scroller h-full snap-y snap-mandatory overflow-y-auto ${
          mode === "slides" ? "" : "invisible"
        }`}
      >
        <Intro active={current === -1} hasSites={sites.length > 0} onStart={goToFirstSite} />
        {sites.map((site, index) => (
          <SiteSlide
            key={site.id}
            site={site}
            index={index}
            active={index === current}
            near={Math.abs(index - current) === 1}
          />
        ))}
        {posts.length > 0 && (
          <BlogSlide posts={posts} index={blogIndex} active={current === blogIndex} />
        )}
      </div>

      {mode === "carousel" && (
        <div className="penne-fade-in fixed inset-0 z-10 bg-night">
          <CarouselView sites={sites} initialIndex={current} onChange={setCurrent} />
        </div>
      )}

      {/* Aparece só nos cases (nem na abertura, nem na tela do blog) */}
      <ViewMenu mode={mode} visible={onCase || mode === "carousel"} onChange={changeMode} />

      <header className="pointer-events-none fixed inset-x-0 top-0 z-20 flex items-start justify-between p-6 sm:p-10">
        {/* Espaço reservado pro logo */}
        <div aria-hidden className="h-[30px] w-24" />
        <div className="flex flex-col items-end gap-3">
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener"
            className="penne-roll pointer-events-auto font-display text-base uppercase leading-none text-[#dba58c] sm:text-xl"
          >
            <RollText text="Orçamento no WhatsApp ↗" />
          </a>
          {/* Blog e contador na mesma linha: no celular o menu de modos fica logo abaixo */}
          <div className="flex items-center gap-4 font-mono text-xs leading-none">
            {sites.length > 0 && (
              <span
                className={`tabular-nums text-cream/70 transition-opacity duration-500 ${onCase || mode === "carousel" ? "" : "opacity-0"}`}
              >
                {pad(Math.min(Math.max(current, 0), sites.length - 1) + 1)} / {pad(sites.length)}
              </span>
            )}
            {posts.length > 0 && (
              <Link
                href="/blog"
                className="penne-roll pointer-events-auto uppercase text-cream/70 [text-shadow:0_0_12px_rgb(0_0_0/0.6)] hover:text-cream"
              >
                <RollText text="Blog" />
              </Link>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}
