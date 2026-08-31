import "server-only";
import { readRaw, writeRaw } from "./store";
import type { Site } from "./types";

export async function getSites(): Promise<Site[]> {
  const sites = await readRaw<Site[]>();
  return (sites ?? []).slice().sort((a, b) => a.order - b.order);
}

export async function getSite(id: string): Promise<Site | undefined> {
  const sites = await getSites();
  return sites.find((s) => s.id === id);
}

export async function addSite(
  input: Omit<Site, "id" | "createdAt" | "order">
): Promise<Site> {
  const sites = await getSites();
  const site: Site = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    order: sites.length,
  };
  await writeRaw([...sites, site]);
  return site;
}

export async function updateSite(
  id: string,
  patch: Partial<Omit<Site, "id">>
): Promise<void> {
  const sites = await getSites();
  const next = sites.map((s) => (s.id === id ? { ...s, ...patch } : s));
  await writeRaw(next);
}

export async function deleteSite(id: string): Promise<void> {
  const sites = await getSites();
  await writeRaw(sites.filter((s) => s.id !== id));
}

export async function reorderSites(orderedIds: string[]): Promise<void> {
  const sites = await getSites();
  const byId = new Map(sites.map((s) => [s.id, s]));
  const next = orderedIds
    .map((id, index) => {
      const site = byId.get(id);
      return site ? { ...site, order: index } : null;
    })
    .filter((s): s is Site => s !== null);
  await writeRaw(next);
}
