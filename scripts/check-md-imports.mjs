#!/usr/bin/env node
/**
 * Names imported from burne-ui entrypoints in markdown examples must exist on that entry.
 * Component docs and the site share this check. `burne-ui/internal` is allowed when the name is exported there.
 */
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const siteRoot = path.resolve(root, "../burne-ui-site/content");

const ENTRIES = {
  "burne-ui": "dist/index.d.ts",
  "burne-ui/internal": "dist/internal.d.ts",
  "burne-ui/skin": "dist/skin.d.ts",
  "burne-ui/studio": "dist/studio.d.ts",
  "burne-ui/authoring": "dist/authoring.d.ts",
};

function exportedNames(source) {
  const names = new Set();
  const clauses = source.matchAll(/export\s+(?:type\s+)?\{([^}]+)\}/g);
  for (const clause of clauses) {
    for (const part of clause[1].split(",")) {
      const cleaned = part.replace(/\/\*[\s\S]*?\*\//g, "").trim().replace(/^type\s+/, "");
      if (!cleaned) continue;
      const pieces = cleaned.split(/\s+as\s+/);
      const name = pieces[pieces.length - 1].trim();
      if (/^[$A-Za-z_][\w$]*$/.test(name)) names.add(name);
    }
  }
  for (const match of source.matchAll(/export\s+(?:declare\s+)?(?:function|const|class|interface|type|enum)\s+([$A-Za-z_][\w$]*)/g)) {
    names.add(match[1]);
  }
  return names;
}

function importedNames(clause) {
  const names = [];
  for (const part of clause.split(",")) {
    const cleaned = part.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "").trim();
    if (!cleaned) continue;
    const withoutType = cleaned.replace(/^type\s+/, "");
    const exported = withoutType.split(/\s+as\s+/)[0].trim();
    if (/^[$A-Za-z_][\w$]*$/.test(exported)) names.push(exported);
  }
  return names;
}

async function markdownFiles(dir) {
  const found = [];
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return found;
  }
  for (const entry of entries) {
    if (entry.name === "node_modules" || entry.name === "dist") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) found.push(...(await markdownFiles(full)));
    else if (entry.name.endsWith(".md")) found.push(full);
  }
  return found;
}

const catalogs = new Map();
for (const [specifier, file] of Object.entries(ENTRIES)) {
  catalogs.set(specifier, exportedNames(await readFile(path.join(root, file), "utf8")));
}

const importRe = /import\s+(?:type\s+)?\{([^}]+)\}\s*from\s+["'](burne-ui(?:\/[\w-]+)?)["']/g;
const problems = [];
const files = [
  ...(await markdownFiles(path.join(root, "src"))),
  ...(await markdownFiles(path.join(root, "docs"))),
  ...(await markdownFiles(siteRoot)),
];

for (const file of files) {
  const text = await readFile(file, "utf8");
  for (const match of text.matchAll(importRe)) {
    const specifier = match[2];
    const catalog = catalogs.get(specifier);
    if (!catalog) continue;
    for (const name of importedNames(match[1])) {
      if (catalog.has(name)) continue;
      problems.push(`${path.relative(root, file)}: \`${name}\` is not exported from ${specifier}`);
    }
  }
}

if (problems.length > 0) {
  console.error(`check-md-imports: ${problems.length} problem(s)\n${problems.join("\n")}`);
  process.exit(1);
}

console.log(`check-md-imports: OK (${files.length} markdown files)`);
