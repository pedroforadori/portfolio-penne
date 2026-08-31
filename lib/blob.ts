import "server-only";
import { put } from "@vercel/blob";

const hasBlobConfig = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

export async function uploadSiteImage(file: File): Promise<string | null> {
  if (!hasBlobConfig || file.size === 0) return null;
  const blob = await put(`sites/${crypto.randomUUID()}-${file.name}`, file, {
    access: "public",
  });
  return blob.url;
}
