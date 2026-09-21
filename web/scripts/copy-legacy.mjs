/** Copy live HTML tools into public/ so Vercel can serve them next to the OS. */
import { cpSync, mkdirSync, readdirSync, statSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, "../..");
const publicDir = path.join(__dirname, "../public");

const SKIP_DIRS = new Set(["web", "member-hub", "node_modules", ".git", ".github", ".vercel"]);
const SKIP_FILES = new Set([
  "index.html",
  "you.html",
  "workshop.html",
  "studio.html",
  "treasury.html",
  "commons.html",
  "galaxy.html",
  "soul-map.html",
  "auth-callback.html",
  "CNAME",
  ".gitignore",
  "README.md",
  "CLAUDE.md",
  "SITE_CONSTITUTION.md",
]);

function copyEntry(from, to, name) {
  if (SKIP_DIRS.has(name) || SKIP_FILES.has(name)) return;
  const src = path.join(from, name);
  const dest = path.join(to, name);
  const st = statSync(src);
  if (st.isDirectory()) {
    mkdirSync(dest, { recursive: true });
    for (const child of readdirSync(src)) copyEntry(src, dest, child);
    return;
  }
  cpSync(src, dest);
}

mkdirSync(publicDir, { recursive: true });
let n = 0;
for (const name of readdirSync(repoRoot)) {
  if (SKIP_DIRS.has(name) || SKIP_FILES.has(name)) continue;
  copyEntry(repoRoot, publicDir, name);
  n += 1;
}
console.log(`Copied ${n} legacy root entries → web/public`);
