#!/usr/bin/env node
// Ensures every type exported from component index barrels
// (src/components/core|composite/<Name>/index.ts) is re-exported from src/index.ts.
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const packageIndexPath = path.join(root, "src/index.ts");
const componentRoots = [
  path.join(root, "src/components/core"),
  path.join(root, "src/components/composite"),
];

// Strip line and block comments so they do not produce false export matches.
function stripComments(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:])\/\/.*$/gm, "$1");
}

/**
 * Collect exported type names from a TypeScript barrel.
 * Handles:
 * - export type { A, B as C }
 * - export { foo, type A, type B as C }
 * - export type Foo =
 * - export type Foo<T> =
 * - export interface Foo
 * - export interface Foo<T>
 */
function extractExportedTypeNames(source) {
  const text = stripComments(source);
  const names = new Set();

  const typeOnlyBlocks = text.matchAll(
    /\bexport\s+type\s*\{([^}]+)\}/g,
  );
  for (const match of typeOnlyBlocks) {
    collectSpecifiers(match[1], names);
  }

  const valueBlocks = text.matchAll(
    /\bexport\s*\{([^}]+)\}/g,
  );
  for (const match of valueBlocks) {
    // Skip blocks already handled as `export type { ... }`
    const start = match.index ?? 0;
    const ahead = text.slice(Math.max(0, start - 12), start);
    if (/\bexport\s+type\s*$/.test(ahead)) continue;
    collectSpecifiers(match[1], names, { typesOnly: true });
  }

  const typeAliases = text.matchAll(
    /\bexport\s+type\s+([A-Za-z_][\w]*)\s*(?:<[^>]*>)?\s*=/g,
  );
  for (const match of typeAliases) {
    names.add(match[1]);
  }

  const interfaces = text.matchAll(
    /\bexport\s+interface\s+([A-Za-z_][\w]*)\b/g,
  );
  for (const match of interfaces) {
    names.add(match[1]);
  }

  return names;
}

/**
 * Parse export brace contents into type names.
 * @param {string} body
 * @param {Set<string>} names
 * @param {{ typesOnly?: boolean }} [opts]
 */
function collectSpecifiers(body, names, opts = {}) {
  const parts = body.split(",");
  for (const raw of parts) {
    let part = raw.trim();
    if (!part) continue;
    // Drop `from` remnants if a multiline export was split oddly
    part = part.replace(/\bfrom\b[\s\S]*$/, "").trim();
    if (!part) continue;

    const isType = /^\btype\b\s+/.test(part);
    if (opts.typesOnly && !isType) continue;

    part = part.replace(/^\btype\b\s+/, "").trim();
    if (!part) continue;

    // `Foo as Bar` → export name is Bar
    const asMatch = part.match(
      /^([A-Za-z_][\w]*)\s+as\s+([A-Za-z_][\w]*)$/,
    );
    if (asMatch) {
      names.add(asMatch[2]);
      continue;
    }

    const ident = part.match(/^([A-Za-z_][\w]*)$/);
    if (ident) names.add(ident[1]);
  }
}

async function listComponentIndexFiles() {
  const files = [];
  for (const dir of componentRoots) {
    let entries;
    try {
      entries = await readdir(dir, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      files.push({
        component: entry.name,
        path: path.join(dir, entry.name, "index.ts"),
      });
    }
  }
  return files;
}

async function main() {
  const packageSource = await readFile(packageIndexPath, "utf8");
  const packageTypes = extractExportedTypeNames(packageSource);

  const missing = [];
  let componentTypeCount = 0;
  let componentFileCount = 0;

  for (const { component, path: indexPath } of await listComponentIndexFiles()) {
    let source;
    try {
      source = await readFile(indexPath, "utf8");
    } catch {
      continue;
    }
    componentFileCount += 1;
    const types = extractExportedTypeNames(source);
    componentTypeCount += types.size;
    for (const typeName of [...types].sort()) {
      if (!packageTypes.has(typeName)) {
        missing.push(`${component}: ${typeName}`);
      }
    }
  }

  if (missing.length > 0) {
    console.error(
      `check-package-export-parity: ${missing.length} type(s) missing from src/index.ts:\n`,
    );
    for (const line of missing) {
      console.error(`  - ${line}`);
    }
    process.exit(1);
  }

  console.log(
    `check-package-export-parity: OK — ${componentTypeCount} type export(s) across ${componentFileCount} component index file(s); ${packageTypes.size} type(s) in package index.`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
