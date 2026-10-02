"use client";

import Image, { getImageProps } from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { Device, Site } from "@/lib/types";

// Velocidade com que o fundo percorre a página inteira depois de revelado.
const PAN_SPEED_PX_S = 140;

// Uma camada por faixa de tela (breakpoints sm/lg do Tailwind), cada uma com a
// captura feita no dispositivo correspondente. Camadas escondidas não baixam a
// imagem (lazy loading ignora elementos com display: none); `media` repete as faixas das classes, pra pré-carregar só a camada visível.
const LAYERS: {
  device: Device;
  className: string;
  media: string;
  width: number;
  height: number;
}[] = [
  { device: "mobile", className: "sm:hidden", media: "(max-width: 639.98px)", width: 390, height: 844 },
  {
    device: "tablet",
    className: "hidden sm:block lg:hidden",
    media: "(min-width: 640px) and (max-width: 1023.98px)",
    width: 834,
    height: 1194,
  },
  { device: "desktop", className: "hidden lg:block", media: "(min-width: 1024px)", width: 1440, height: 900 },
];

// Mesmas props que o <Image> da camada recebe, pra que o pré-carregamento
// escolha exatamente o arquivo que ele vai pedir depois.
function imageProps(site: Site, layer: (typeof LAYERS)[number]) {
  const src = site.fullPage?.[layer.device];
  if (src) return { src, width: layer.width, height: layer.height, sizes: "100vw", alt: "" };
  // Sem captura desse dispositivo: screenshot vertical da home, parado.
  if (site.imageUrl) return { src: site.imageUrl, fill: true, sizes: "100vw", alt: "" };
  return null;
}

export default function SiteBackground({
  site,
  preload,
  onLoad,
}: {
  site: Site;
  // Case vizinho do que está na tela: já começa a baixar o fundo, que o lazy
  // loading só pediria quando o case entrasse na tela.
  preload: boolean;
  onLoad: () => void;
}) {
  useEffect(() => {
    if (!preload) return;
    const layer = LAYERS.find(({ media }) => window.matchMedia(media).matches);
    const props = layer && imageProps(site, layer);
    if (!props) return;
    const { srcSet, sizes, src } = getImageProps(props).props;
    const img = new window.Image();
    if (sizes) img.sizes = sizes;
    if (srcSet) img.srcset = srcSet;
    img.src = src;
  }, [preload, site]);

  return LAYERS.map((layer) => {
    const src = site.fullPage?.[layer.device];
    if (src) {
      return (
        <PanningPage
          key={layer.device}
          src={src}
          width={layer.width}
          height={layer.height}
          className={layer.className}
          onLoad={onLoad}
        />
      );
    }
    const props = imageProps(site, layer);
    if (!props) return null;
    return (
      <div key={layer.device} className={`penne-bg absolute inset-0 ${layer.className}`}>
        <Image {...props} alt="" onLoad={onLoad} className="object-cover object-top" />
      </div>
    );
  });
}

// A página inteira, que começa no topo do site e desce devagar quando revelada.
function PanningPage({
  src,
  width,
  height,
  className,
  onLoad,
}: {
  src: string;
  width: number;
  height: number;
  className: string;
  onLoad: () => void;
}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [pan, setPan] = useState(0);

  // Quanto a imagem precisa subir pra mostrar o fim do site. Recalcula ao
  // redimensionar (ex.: tablet girando).
  const measure = () => {
    const viewport = viewportRef.current;
    const image = imageRef.current;
    if (!viewport || !image) return;
    setPan(Math.min(0, viewport.clientHeight - image.offsetHeight));
  };

  useEffect(() => {
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <div ref={viewportRef} className={`penne-bg absolute inset-0 ${className}`}>
      <Image
        ref={imageRef}
        src={src}
        alt=""
        width={width}
        height={height}
        sizes="100vw"
        onLoad={() => {
          measure();
          onLoad();
        }}
        className="penne-page h-auto w-full"
        style={
          {
            "--pan": `${pan}px`,
            "--pan-duration": `${Math.abs(pan) / PAN_SPEED_PX_S}s`,
          } as CSSProperties
        }
      />
    </div>
  );
}
