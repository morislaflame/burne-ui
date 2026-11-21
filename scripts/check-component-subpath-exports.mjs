#!/usr/bin/env node
// Public component folders are importable as `burne-ui/Button`.
// `node scripts/check-component-subpath-exports.mjs --write` refreshes package.json exports.
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  RESERVED_PACKAGE_EXPORTS,
  componentSubpathExport,
  listComponentEntries,
} from "./componentEntries.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const packagePath = path.join(root, "package.json");

function componentExports() {
  /** @type {Map<string, { types: string, import: string, default: string }>} */
  const map = new Map();
  for (const item of listComponentEntries(root)) {
    map.set(item.exportKey, componentSubpathExport(item.group, item.name));
  }
  return map;
}

function sameEntry(actual, expected) {
  if (!actual) return false;
  const keys = new Set([...Object.keys(actual), ...Object.keys(expected)]);
  for (const key of keys) {
    if (actual[key] !== expected[key]) return false;
  }
  return true;
}

const expected = componentExports();
const pkg = JSON.parse(await readFile(packagePath, "utf8"));
const exportsField = pkg.exports ?? {};
const write = process.argv.includes("--write");

if (write) {
  const next = {};
  for (const key of RESERVED_PACKAGE_EXPORTS) {
    if (exportsField[key] != null) next[key] = exportsField[key];
  }
  for (const key of [...expected.keys()].sort((a, b) => a.localeCompare(b))) {
    next[key] = expected.get(key);
  }
  pkg.exports = next;
  await writeFile(packagePath, `${JSON.stringify(pkg, null, 2)}\n`);
  console.log(`check-component-subpath-exports: wrote ${expected.size} component paths`);
  process.exit(0);
}

const errors = [];
for (const [key, value] of expected) {
  if (!sameEntry(exportsField[key], value)) {
    errors.push(`${key} → ${value.import}`);
  }
}
for (const key of Object.keys(exportsField)) {
  if (RESERVED_PACKAGE_EXPORTS.has(key) || expected.has(key)) continue;
  errors.push(`extra export ${key}`);
}

if (errors.length > 0) {
  console.error(`check-component-subpath-exports:\n${errors.map((line) => `  ${line}`).join("\n")}`);
  process.exit(1);
}

console.log(`check-component-subpath-exports: OK — ${expected.size} paths`);
