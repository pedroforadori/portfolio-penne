"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { addSite, deleteSite, getSites, reorderSites, updateSite } from "@/lib/sites";
import { uploadSiteImage } from "@/lib/blob";
import { SESSION_COOKIE } from "@/lib/auth";

function adminHome() {
  return `/${process.env.ADMIN_PATH}`;
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  redirect(`${adminHome()}/login`);
}

export async function createSiteAction(formData: FormData) {
  const couple = String(formData.get("couple") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  const liveUrl = String(formData.get("liveUrl") ?? "").trim();
  const githubUrl = String(formData.get("githubUrl") ?? "").trim();
  const color = String(formData.get("color") ?? "").trim();
  const image = formData.get("image");

  if (!couple || !slug || !liveUrl || !color) return;

  const imageUrl = image instanceof File ? await uploadSiteImage(image) : null;

  await addSite({
    couple,
    slug,
    liveUrl,
    githubUrl: githubUrl || undefined,
    color,
    imageUrl: imageUrl ?? undefined,
  });

  revalidatePath("/");
  revalidatePath(adminHome());
  redirect(adminHome());
}

export async function updateSiteAction(id: string, formData: FormData) {
  const couple = String(formData.get("couple") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  const liveUrl = String(formData.get("liveUrl") ?? "").trim();
  const githubUrl = String(formData.get("githubUrl") ?? "").trim();
  const color = String(formData.get("color") ?? "").trim();
  const image = formData.get("image");

  if (!couple || !slug || !liveUrl || !color) return;

  const uploadedUrl = image instanceof File ? await uploadSiteImage(image) : null;

  await updateSite(id, {
    couple,
    slug,
    liveUrl,
    githubUrl: githubUrl || undefined,
    color,
    ...(uploadedUrl ? { imageUrl: uploadedUrl } : {}),
  });

  revalidatePath("/");
  revalidatePath(adminHome());
  redirect(adminHome());
}

export async function deleteSiteAction(id: string) {
  await deleteSite(id);
  revalidatePath("/");
  revalidatePath(adminHome());
}

export async function moveSiteAction(id: string, direction: "up" | "down") {
  const sites = await getSites();
  const index = sites.findIndex((s) => s.id === id);
  if (index === -1) return;

  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (swapWith < 0 || swapWith >= sites.length) return;

  const orderedIds = sites.map((s) => s.id);
  [orderedIds[index], orderedIds[swapWith]] = [orderedIds[swapWith], orderedIds[index]];

  await reorderSites(orderedIds);
  revalidatePath("/");
  revalidatePath(adminHome());
}
