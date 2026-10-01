import "server-only";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// As mesmas fontes da home, em .woff (o ImageResponse não lê woff2).
const files = join(process.cwd(), "node_modules/@fontsource");

export async function brandFonts() {
  const [anton, cormorant] = await Promise.all([
    readFile(join(files, "anton/files/anton-latin-400-normal.woff")),
    readFile(join(files, "cormorant-garamond/files/cormorant-garamond-latin-500-italic.woff")),
  ]);
  return [
    { name: "Anton", data: anton, weight: 400 as const, style: "normal" as const },
    { name: "Cormorant", data: cormorant, weight: 500 as const, style: "italic" as const },
  ];
}
