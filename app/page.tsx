import { getSites } from "@/lib/sites";
import { withLocalPreviews } from "@/lib/local-previews";
import Home from "@/components/home/Home";

export const dynamic = "force-dynamic";

export default async function Page() {
  const sites = withLocalPreviews(await getSites());

  return <Home sites={sites} />;
}
