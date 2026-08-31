import Link from "next/link";
import { getSites } from "@/lib/sites";
import { isUsingMemoryFallback } from "@/lib/store";
import { createSiteAction, deleteSiteAction, logoutAction, moveSiteAction } from "./actions";
import SiteForm from "./SiteForm";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const sites = await getSites();
  const adminHome = `/${process.env.ADMIN_PATH}`;

  return (
    <main className="min-h-screen bg-[#171412] px-6 py-10 text-[#f4ede6]">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-xl font-medium">Cases do portfólio</h1>
          <form action={logoutAction}>
            <button className="text-sm text-[#a89a8c] hover:text-[#f4ede6]">Sair</button>
          </form>
        </div>

        {isUsingMemoryFallback && (
          <p className="mb-6 rounded-lg border border-[#3a332c] bg-[#241f1a] px-4 py-3 text-sm text-[#dc8e6e]">
            KV_REST_API_URL/TOKEN não configurados — usando armazenamento em
            memória (dados somem ao reiniciar). Configure a integração Redis na
            Vercel para persistência real.
          </p>
        )}

        <ul className="mb-10 divide-y divide-[#2a241f] rounded-xl border border-[#2a241f]">
          {sites.length === 0 && (
            <li className="px-4 py-6 text-sm text-[#a89a8c]">Nenhum case cadastrado ainda.</li>
          )}
          {sites.map((site, index) => (
            <li key={site.id} className="flex items-center gap-4 px-4 py-3">
              <span
                className="h-8 w-8 shrink-0 rounded-full"
                style={{ backgroundColor: site.color }}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{site.couple}</p>
                <p className="truncate text-sm text-[#a89a8c]">{site.liveUrl}</p>
              </div>

              <form action={moveSiteAction.bind(null, site.id, "up")}>
                <button
                  disabled={index === 0}
                  className="rounded-md px-2 py-1 text-[#a89a8c] hover:bg-[#241f1a] disabled:opacity-30"
                  aria-label="Mover para cima"
                >
                  ↑
                </button>
              </form>
              <form action={moveSiteAction.bind(null, site.id, "down")}>
                <button
                  disabled={index === sites.length - 1}
                  className="rounded-md px-2 py-1 text-[#a89a8c] hover:bg-[#241f1a] disabled:opacity-30"
                  aria-label="Mover para baixo"
                >
                  ↓
                </button>
              </form>

              <Link
                href={`${adminHome}/${site.id}/edit`}
                className="rounded-md px-3 py-1 text-sm text-[#a89a8c] hover:bg-[#241f1a] hover:text-[#f4ede6]"
              >
                Editar
              </Link>

              <form action={deleteSiteAction.bind(null, site.id)}>
                <button className="rounded-md px-3 py-1 text-sm text-[#e08a6d] hover:bg-[#241f1a]">
                  Excluir
                </button>
              </form>
            </li>
          ))}
        </ul>

        <h2 className="mb-4 text-lg font-medium">Novo case</h2>
        <SiteForm action={createSiteAction} submitLabel="Adicionar" />
      </div>
    </main>
  );
}
