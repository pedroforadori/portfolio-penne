import Image from "next/image";
import type { Site } from "@/lib/types";

export default function SiteCard({ site }: { site: Site }) {
  return (
    <a
      href={site.liveUrl}
      target="_blank"
      rel="noreferrer noopener"
      className="group relative block aspect-square overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
      style={site.imageUrl ? undefined : { backgroundColor: site.color }}
    >
      {site.imageUrl && (
        <Image
          src={site.imageUrl}
          alt={`Site do casamento de ${site.couple}`}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      )}

      <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-black/0 to-black/0 p-5 opacity-100 transition duration-300 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100">
        <div>
          <p className="font-serif text-lg text-white sm:text-xl">{site.couple}</p>
          <span className="mt-1 inline-block text-xs uppercase tracking-widest text-white/80">
            Visitar site →
          </span>
        </div>
      </div>
    </a>
  );
}
