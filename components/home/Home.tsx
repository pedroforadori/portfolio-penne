"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { PostMeta, Site } from "@/lib/types";
import { whatsappUrl } from "@/lib/site-config";
import BlogSlide from "./BlogSlide";
import CarouselView from "./CarouselView";
import Intro from "./Intro";
import RollText from "./RollText";
import PrevButton from "./PrevButton";
import SideNav from "./SideNav";
import SiteSlide from "./SiteSlide";
import TestimonialsSlide, { type HomeTestimonial } from "./TestimonialsSlide";
import ViewMenu, { type ViewMode } from "./ViewMenu";
import { PenneLogo } from "@/components/PenneLogo";

const pad = (n: number) => String(n).padStart(2, "0");

export default function Home({
  sites,
  posts,
  testimonials,
}: {
  sites: Site[];
  posts: PostMeta[];
  testimonials: HomeTestimonial[];
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  // -1 é a abertura; daí em diante, o índice do case na tela. Depois do
  // último case vêm a tela das avaliações e a do blog.
  const [current, setCurrent] = useState(-1);
  const testimonialsIndex = sites.length;
  const blogIndex = sites.length + (testimonials.length > 0 ? 1 : 0);
  const onCase = current >= 0 && current < sites.length;
  const [mode, setMode] = useState<ViewMode>("slides");
  // Menus flutuantes (modos à direita, Avaliações/Blog à esquerda): só nos
  // cases e no carrossel, não na abertura nem nas telas do fim.
  const floatingMenus = onCase || mode === "carousel";
  // Avaliações/Blog à esquerda (SideNav): em tudo depois da abertura — cases,
  // carrossel e as telas das avaliações e do blog, que seguem o layout dos
  // cases.
  const sideNavVisible = floatingMenus || current >= sites.length;

  // Do logo no header: já estamos em "/", então só sobe pra abertura.
  const goToIntro = () => {
    setMode("slides");
    scrollerRef.current
      ?.querySelector('[data-index="-1"]')
      ?.scrollIntoView({ behavior: "smooth" });
  };

  // Seta "↑": volta uma tela (do primeiro case, pra abertura).
  const goToPrevious = () => {
    scrollerRef.current
      ?.querySelector(`[data-index="${current - 1}"]`)
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const goToFirstSite = () => {
    scrollerRef.current
      ?.querySelector('[data-index="0"]')
      ?.scrollIntoView({ behavior: "smooth" });
  };

  // Do header (e de /#avaliacoes): sai do carrossel, se for o caso, e desce
  // até a tela das avaliações.
  const scrollToTestimonials = (behavior: ScrollBehavior) => {
    scrollerRef.current
      ?.querySelector(`[data-index="${testimonialsIndex}"]`)
      ?.scrollIntoView({ behavior });
  };
  const goToTestimonials = () => {
    setMode("slides");
    scrollToTestimonials("smooth");
  };

  // A âncora fica dentro do scroller fixo, então o navegador não chega nela
  // sozinho quando alguém abre /#avaliacoes vindo de outra página.
  useEffect(() => {
    if (window.location.hash === "#avaliacoes") scrollToTestimonials("instant");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
  }, [sites.length, posts.length, testimonials.length]);

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
        {testimonials.length > 0 && (
          <TestimonialsSlide
            testimonials={testimonials}
            index={testimonialsIndex}
            active={current === testimonialsIndex}
          />
        )}
        {posts.length > 0 && (
          <BlogSlide posts={posts} index={blogIndex} active={current === blogIndex} />
        )}
      </div>

      {mode === "carousel" && (
        <div className="penne-fade-in fixed inset-0 z-10 bg-night">
          <CarouselView sites={sites} initialIndex={current} onChange={setCurrent} />
        </div>
      )}

      {/* Aparece só nos cases (nem na abertura, nem nas telas do fim) */}
      <ViewMenu mode={mode} visible={floatingMenus} onChange={changeMode} />
      <PrevButton
        canGoBack={mode === "slides" && current >= 0}
        onBack={goToPrevious}
        onHome={goToIntro}
      />
      <SideNav
        visible={sideNavVisible}
        showTestimonials={testimonials.length > 0}
        showBlog={posts.length > 0}
        onTestimonials={goToTestimonials}
      />

      <header className="pointer-events-none fixed inset-x-0 top-0 z-20 flex items-start justify-between p-6 sm:p-10">
        {/* Na abertura o selo grande já está na tela; ao rolar, ficam só as
            alianças no header, paradas, como âncora de volta pro início. Em
            celular baixo o selo não cabe na abertura, então elas já aparecem. */}
        <div
          className={`transition-[opacity,visibility] duration-500 ${current === -1 && mode !== "carousel" ? "invisible opacity-0 [@media(max-width:639.98px)_and_(max-height:680px)]:visible [@media(max-width:639.98px)_and_(max-height:680px)]:opacity-100" : ""}`}
        >
          <PenneLogo
            variant="mark"
            className="pointer-events-auto"
            onClick={(event) => {
              event.preventDefault();
              goToIntro();
            }}
          />
        </div>
        <div className="flex flex-col items-end gap-3">
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener"
            className="penne-roll pointer-events-auto font-display text-base uppercase leading-none text-[#dba58c] sm:text-xl"
          >
            <RollText text="Orçamento no WhatsApp ↗" />
          </a>
          {/* Contador e links na mesma linha: no celular o menu de modos fica
              logo abaixo. Na abertura, do lg pra cima, os links vão pro centro do header. */}
          <div className="flex items-center gap-4 font-mono text-xs leading-[1.3]">
            {sites.length > 0 && (
              <span
                className={`tabular-nums text-cream/70 transition-opacity duration-500 ${onCase || mode === "carousel" ? "" : "opacity-0"}`}
              >
                {pad(Math.min(Math.max(current, 0), sites.length - 1) + 1)} / {pad(sites.length)}
              </span>
            )}
            {/* Só na abertura: depois dela os links vão pro SideNav, e o
                centro do header fica pras setas de voltar. */}
            <nav
              aria-label="Menu"
              className={`items-center gap-4 lg:absolute lg:left-1/2 lg:top-[42px] lg:-translate-x-1/2 lg:gap-8 ${
                sideNavVisible ? "hidden" : "flex"
              }`}
            >
              {testimonials.length > 0 && (
                <a
                  href="#avaliacoes"
                  onClick={(event) => {
                    event.preventDefault();
                    goToTestimonials();
                  }}
                  className="penne-roll pointer-events-auto uppercase text-cream/70 [text-shadow:0_0_12px_rgb(0_0_0/0.6)] hover:text-cream"
                >
                  <RollText text="Avaliações" />
                </a>
              )}
              {posts.length > 0 && (
                <Link
                  href="/blog"
                  className="penne-roll pointer-events-auto uppercase text-cream/70 [text-shadow:0_0_12px_rgb(0_0_0/0.6)] hover:text-cream"
                >
                  <RollText text="Blog" />
                </Link>
              )}
            </nav>
          </div>
        </div>
      </header>
    </div>
  );
}
