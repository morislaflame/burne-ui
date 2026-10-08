#!/usr/bin/env node
// Public component folders are importable as `burne-ui/Button`.
// `node scripts/check-component-subpath-exports.mjs --write` refreshes package.json exports.
import { access, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const packagePath = path.join(root, "package.json");
const groups = ["core", "composite"];
const reserved = new Set([".", "./internal", "./styles.css", "./theme-bridge.css", "./package.json"]);

function entry(group, name) {
  const base = `./dist/components/${group}/${name}/index`;
  return {
    types: `${base}.d.ts`,
    import: `${base}.js`,
    require: `${base}.cjs`,
    default: `${base}.js`,
  };
}

async function componentExports() {
  /** @type {Map<string, { types: string, import: string, require: string, default: string }>} */
  const map = new Map();
  for (const group of groups) {
    const dir = path.join(root, "src/components", group);
    const entries = await readdir(dir, { withFileTypes: true });
    for (const item of entries) {
      if (!item.isDirectory()) continue;
      try {
        await access(path.join(dir, item.name, "index.ts"));
      } catch {
        continue;
      }
      const key = `./${item.name}`;
      if (map.has(key)) {
        throw new Error(`check-component-subpath-exports: duplicate ${key}`);
      }
      map.set(key, entry(group, item.name));
    }
  }
  return map;
}

function sameEntry(actual, expected) {
  return (
    actual &&
    actual.types === expected.types &&
    actual.import === expected.import &&
    actual.require === expected.require &&
    actual.default === expected.default
  );
}

const expected = await componentExports();
const pkg = JSON.parse(await readFile(packagePath, "utf8"));
const exportsField = pkg.exports ?? {};
const write = process.argv.includes("--write");

if (write) {
  const next = {};
  for (const key of reserved) {
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
  if (reserved.has(key) || expected.has(key)) continue;
  errors.push(`extra export ${key}`);
}

if (errors.length > 0) {
  console.error(`check-component-subpath-exports:\n${errors.map((line) => `  ${line}`).join("\n")}`);
  process.exit(1);
}

console.log(`check-component-subpath-exports: OK — ${expected.size} paths`);
