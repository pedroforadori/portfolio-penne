import { getSites } from "@/lib/sites";
import SiteGrid from "@/components/SiteGrid";

export const dynamic = "force-dynamic";

export default async function Home() {
  const sites = await getSites();

  return (
    <div className="min-h-screen bg-[#171412]">
      <header className="flex items-center justify-between px-6 py-6 sm:px-10">
        <span className="font-serif text-xl tracking-wide text-[#f4ede6]">Penne</span>
        <p className="text-xs uppercase tracking-widest text-[#a89a8c]">
          Sites de casamento
        </p>
      </header>

      <SiteGrid sites={sites} />

      <footer className="px-6 py-10 text-center text-xs text-[#6b5f54] sm:px-10">
        Penne — desenvolvimento de sites de casamento.
      </footer>
    </div>
  );
}
