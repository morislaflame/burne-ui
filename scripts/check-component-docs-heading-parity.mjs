#!/usr/bin/env node
// P2-10: site component-docs en/ru must have the same heading count (## / ### / …).
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const docsRoot = path.resolve(root, "../burne-ui-site/content/component-docs");

const HEADING_RE = /^(#{1,6})\s+\S/;

function headings(md) {
  return md.split("\n").filter((line) => HEADING_RE.test(line));
}

const dirs = (await readdir(docsRoot, { withFileTypes: true }))
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort();

const mismatches = [];

for (const id of dirs) {
  const enPath = path.join(docsRoot, id, "en.md");
  const ruPath = path.join(docsRoot, id, "ru.md");
  let en;
  let ru;
  try {
    en = await readFile(enPath, "utf8");
    ru = await readFile(ruPath, "utf8");
  } catch {
    continue;
  }
  const enH = headings(en);
  const ruH = headings(ru);
  if (enH.length === ruH.length) continue;
  mismatches.push({
    id,
    en: enH.length,
    ru: ruH.length,
    enList: enH,
    ruList: ruH,
  });
}

if (mismatches.length === 0) {
  process.exit(0);
}

console.error(
  `component-docs heading count mismatch (${mismatches.length} of ${dirs.length}):\n`,
);
for (const row of mismatches) {
  console.error(`  ${row.id}: ru ${row.ru} ≠ en ${row.en} (ru−en ${row.ru - row.en})`);
  const max = Math.max(row.enList.length, row.ruList.length);
  for (let i = 0; i < max; i++) {
    const a = row.ruList[i] ?? "<missing>";
    const b = row.enList[i] ?? "<missing>";
    if (a.replace(/^#+\s+/, "") === b.replace(/^#+\s+/, "")) continue;
    // Print only index gaps / extras, not translation pairs.
    if (!row.ruList[i] || !row.enList[i]) {
      console.error(`    [${i}] ru: ${a}`);
      console.error(`         en: ${b}`);
    }
  }
}

process.exit(1);
