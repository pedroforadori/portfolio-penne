"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { Device, Site } from "@/lib/types";

// Velocidade com que o fundo percorre a página inteira depois de revelado.
const PAN_SPEED_PX_S = 140;

// Uma camada por faixa de tela (breakpoints sm/lg do Tailwind), cada uma com a
// captura feita no dispositivo correspondente. Camadas escondidas não baixam a
// imagem (lazy loading ignora elementos com display: none).
const LAYERS: { device: Device; className: string; width: number; height: number }[] = [
  { device: "mobile", className: "sm:hidden", width: 390, height: 844 },
  { device: "tablet", className: "hidden sm:block lg:hidden", width: 834, height: 1194 },
  { device: "desktop", className: "hidden lg:block", width: 1440, height: 900 },
];

export default function SiteBackground({ site }: { site: Site }) {
  return LAYERS.map(({ device, className, width, height }) => {
    const src = site.fullPage?.[device];
    if (src) {
      return (
        <PanningPage key={device} src={src} width={width} height={height} className={className} />
      );
    }
    // Sem captura desse dispositivo: screenshot vertical da home, parado.
    if (!site.imageUrl) return null;
    return (
      <div key={device} className={`penne-bg absolute inset-0 ${className}`}>
        <Image src={site.imageUrl} alt="" fill sizes="100vw" className="object-cover object-top" />
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
}: {
  src: string;
  width: number;
  height: number;
  className: string;
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
        onLoad={measure}
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
