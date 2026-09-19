import { copyFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const webRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = join(webRoot, "..");
const src = join(repoRoot, "tools-catalog.json");
const dest = join(webRoot, "data", "tools-catalog.json");

if (!existsSync(src)) {
  console.error("Missing tools-catalog.json at repo root.");
  process.exit(1);
}

copyFileSync(src, dest);
console.log("Synced tools-catalog.json → web/data/");
