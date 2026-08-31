import type { Site } from "@/lib/types";
import SiteCard from "./SiteCard";

export default function SiteGrid({ sites }: { sites: Site[] }) {
  if (sites.length === 0) {
    return (
      <p className="px-6 py-24 text-center text-[#a89a8c]">
        Nenhum case publicado ainda.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {sites.map((site) => (
        <SiteCard key={site.id} site={site} />
      ))}
    </div>
  );
}
