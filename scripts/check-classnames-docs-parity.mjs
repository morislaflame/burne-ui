#!/usr/bin/env node
// XxxClassNames keys must match every documented slot list
// (kit Component.md and burne-ui-site component-docs ru/en).
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  extractSlotKeys,
  loadClassNamesTypes,
  siteSlug,
} from "./classNamesInventory.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const srcRoot = path.join(root, "src/components");
const siteRoot = path.resolve(root, "../burne-ui-site/content/component-docs");

function headingRe(typeName) {
  return new RegExp(`^### .*?\`${typeName}\`(?: slots)?\\s*$`, "m");
}

function sections(md, typeName) {
  const re = headingRe(typeName);
  const found = [];
  let from = 0;
  while (from < md.length) {
    const match = re.exec(md.slice(from));
    if (!match) break;
    const headingAt = from + match.index;
    const bodyFrom = headingAt + match[0].length;
    const rest = md.slice(bodyFrom);
    const next = rest.search(/\n#{1,3} /);
    const body = next === -1 ? rest : rest.slice(0, next);
    found.push({ heading: match[0].trim(), body });
    from = bodyFrom + (next === -1 ? rest.length : next);
  }
  return found;
}

function keysFromFence(body, typeName) {
  const fenceRe = /```[^\n]*\n([\s\S]*?)```/g;
  let fence = fenceRe.exec(body);
  while (fence) {
    const code = fence[1];
    if (code.includes(`type ${typeName}`)) {
      const inner = code.match(/\{([\s\S]*)\}/);
      if (inner) return extractSlotKeys(inner[1]);
    }
    fence = fenceRe.exec(body);
  }
  return null;
}

function keysFromTable(body) {
  const keys = [];
  let inSlotTable = false;
  for (const line of body.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("|")) {
      if (inSlotTable && keys.length > 0) break;
      continue;
    }
    const cells = trimmed.split("|").slice(1, -1).map((cell) => cell.trim());
    const head = cells[0] ?? "";
    if (/^[-:\s|]+$/.test(head)) continue;
    if (!inSlotTable) {
      if (/^(слот|slot)$/i.test(head.replace(/`/g, ""))) inSlotTable = true;
      continue;
    }
    if (/^(prop|свойство)$/i.test(head.replace(/`/g, ""))) break;
    for (const id of head.matchAll(/`([A-Za-z]\w*)`/g)) keys.push(id[1]);
  }
  return keys.length > 0 ? keys : null;
}

function keysFromList(body) {
  const noFence = body.replace(/```[\s\S]*?```/g, "");
  for (const line of noFence.split("\n")) {
    const trimmed = line.trim();
    if (!/^`[A-Za-z]\w*`(?:\s*,\s*`[A-Za-z]\w*`)*\.?\s*$/.test(trimmed)) continue;
    return [...trimmed.matchAll(/`([A-Za-z]\w*)`/g)].map((match) => match[1]);
  }
  return null;
}

function keysFromSection(section, typeName) {
  const fence = keysFromFence(section.body, typeName);
  if (fence) return fence;
  const table = keysFromTable(section.body);
  if (table) return table;
  return keysFromList(section.body);
}

function diff(expected, actual) {
  const exp = new Set(expected);
  const act = new Set(actual);
  return {
    missing: [...exp].filter((key) => !act.has(key)),
    extra: [...act].filter((key) => !exp.has(key)),
  };
}

const { types } = loadClassNamesTypes(srcRoot);

/** @type {{ file: string, md: string }[]} */
const kitDocs = [];
async function collectMd(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await collectMd(full);
    else if (entry.name.endsWith(".md")) {
      kitDocs.push({ file: full, md: await readFile(full, "utf8") });
    }
  }
}
await collectMd(srcRoot);

let siteDirs = [];
try {
  siteDirs = (await readdir(siteRoot, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
} catch {
  siteDirs = [];
}

const problems = [];

function rel(file) {
  return path.relative(path.resolve(root, ".."), file);
}

for (const [name, keys] of [...types.entries()].sort(([a], [b]) => a.localeCompare(b))) {
  const kitHits = [];
  for (const doc of kitDocs) {
    for (const section of sections(doc.md, name)) {
      kitHits.push({ file: doc.file, section });
    }
  }

  if (kitHits.length === 0) {
    problems.push(`${name}: no slot list in kit docs`);
  }

  for (const hit of kitHits) {
    const documented = keysFromSection(hit.section, name);
    if (!documented) {
      problems.push(`${name}: empty slot list in ${rel(hit.file)} (${hit.section.heading})`);
      continue;
    }
    const { missing, extra } = diff(keys, documented);
    if (missing.length === 0 && extra.length === 0) continue;
    problems.push(
      `${name} in ${rel(hit.file)} (${hit.section.heading}): missing [${missing.join(", ")}] extra [${extra.join(", ")}]`,
    );
  }

  const slug = siteSlug(name);
  if (!siteDirs.includes(slug)) continue;
  for (const lang of ["ru", "en"]) {
    const file = path.join(siteRoot, slug, `${lang}.md`);
    let md;
    try {
      md = await readFile(file, "utf8");
    } catch {
      problems.push(`${name}: missing ${rel(file)}`);
      continue;
    }
    const hits = sections(md, name);
    if (hits.length === 0) {
      problems.push(`${name}: no slot list in ${rel(file)}`);
      continue;
    }
    for (const section of hits) {
      const documented = keysFromSection(section, name);
      if (!documented) {
        problems.push(`${name}: empty slot list in ${rel(file)} (${section.heading})`);
        continue;
      }
      const { missing, extra } = diff(keys, documented);
      if (missing.length === 0 && extra.length === 0) continue;
      problems.push(
        `${name} in ${rel(file)} (${section.heading}): missing [${missing.join(", ")}] extra [${extra.join(", ")}]`,
      );
    }
  }
}

if (problems.length === 0) {
  console.log(`check-classnames-docs-parity: OK (${types.size} types)`);
  process.exit(0);
}

console.error(`check-classnames-docs-parity: ${problems.length} problem(s)\n`);
for (const line of problems) console.error(`  ${line}`);
process.exit(1);
