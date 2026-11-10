#!/usr/bin/env node
// Production component files must not statically import `react-icons`.
// Default glyphs live in src/components/core/utils/kitIcons.tsx (Э0.5).
// Stories, playground, and story helpers may still import react-icons.
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const componentsRoot = path.join(root, "src/components");
const IMPORT_RE = /from\s+["']react-icons(?:\/[^"']+)?["']/;

/** @param {string} dir
 *  @returns {Promise<string[]>} */
async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(full)));
      continue;
    }
    if (!/\.(ts|tsx)$/.test(entry.name)) continue;
    if (/\.stories\.(ts|tsx)$/.test(entry.name)) continue;
    files.push(full);
  }
  return files;
}

const files = await walk(componentsRoot);
const hits = [];

for (const file of files) {
  const source = await readFile(file, "utf8");
  if (IMPORT_RE.test(source)) {
    hits.push(path.relative(root, file));
  }
}

if (hits.length > 0) {
  console.error(
    "check-peer-imports: static `react-icons` import in production components:\n" +
      hits.map((file) => `  ${file}`).join("\n"),
  );
  process.exit(1);
}

console.log(
  `check-peer-imports: OK — no react-icons in ${files.length} production component file(s).`,
);
