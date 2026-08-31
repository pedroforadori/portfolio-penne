import { notFound } from "next/navigation";
import { getSite } from "@/lib/sites";
import { updateSiteAction } from "../../actions";
import SiteForm from "../../SiteForm";

export const dynamic = "force-dynamic";

export default async function EditSitePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const site = await getSite(id);
  if (!site) notFound();

  return (
    <main className="min-h-screen bg-[#171412] px-6 py-10 text-[#f4ede6]">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-xl font-medium">Editar {site.couple}</h1>
        <SiteForm
          action={updateSiteAction.bind(null, site.id)}
          initial={site}
          submitLabel="Salvar"
        />
      </div>
    </main>
  );
}
