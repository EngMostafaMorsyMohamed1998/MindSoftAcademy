/**
 * Downloads the Ministry of Education textbooks into `public/books/`.
 *
 * The PDFs are ~93 MB in total and are not committed to git, so run
 * `npm run books:fetch` after cloning or before a deploy.
 */
import { mkdir, stat, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = join(ROOT, "public", "books");
const BLOB_BASE =
  "https://egyptianbaccalaureate.blob.core.windows.net/egyptianbaccalaureate";

const BOOKS = [
  ["Programming-ArtificialIntelligence-Ar-EB-part1.pdf", "programming-ai-ar-part1.pdf"],
  ["Programming-ArtificialIntelligence-En-EB-part1.pdf", "programming-ai-en-part1.pdf"],
  ["Programming-ArtificialIntelligence-Ar-EB-part2.pdf", "programming-ai-ar-part2.pdf"],
  ["Programming-ArtificialIntelligence-En-EB-part2.pdf", "programming-ai-en-part2.pdf"],
];

async function alreadyDownloaded(path) {
  try {
    const info = await stat(path);
    return info.size > 0;
  } catch {
    return false;
  }
}

await mkdir(OUT_DIR, { recursive: true });

for (const [remote, local] of BOOKS) {
  const target = join(OUT_DIR, local);

  if (await alreadyDownloaded(target)) {
    console.log(`skip   ${local} (already present)`);
    continue;
  }

  const response = await fetch(`${BLOB_BASE}/${remote}`);
  if (!response.ok) {
    throw new Error(`Failed to download ${remote}: HTTP ${response.status}`);
  }

  const bytes = Buffer.from(await response.arrayBuffer());
  await writeFile(target, bytes);
  console.log(`saved  ${local} (${(bytes.length / 1024 / 1024).toFixed(1)} MB)`);
}

console.log("Textbooks ready in public/books/");
