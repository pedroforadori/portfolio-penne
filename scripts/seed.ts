import { put } from "@vercel/blob";
import { seedSites as sites } from "../lib/seed-data";

if (!process.env.BLOB_READ_WRITE_TOKEN) {
  console.error(
    "BLOB_READ_WRITE_TOKEN não configurado. Rode com " +
      "`npm run env:pull`, " +
      "ou cadastre os cases direto pelo admin em produção."
  );
  process.exit(1);
}

async function main() {
  await put("data/sites.json", JSON.stringify(sites), {
    access: "public",
    contentType: "application/json",
    allowOverwrite: true,
    addRandomSuffix: false,
  });
  console.log(`Seeded ${sites.length} sites.`);
}

main();
