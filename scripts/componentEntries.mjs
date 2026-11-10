/**
 * Public component folders (`src/components/{core,composite}/<Name>/index.ts`)
 * become `burne-ui/<Name>` and Vite lib entries so Rollup emits the facade.
 */
import { existsSync, readdirSync } from "node:fs";
import path from "node:path";

export const COMPONENT_GROUPS = ["core", "composite"];

export const RESERVED_PACKAGE_EXPORTS = new Set([
  ".",
  "./internal",
  "./skin",
  "./styles.css",
  "./tailwind.css",
  "./studio",
  "./authoring",
  "./package.json",
]);

/**
 * @param {string} root package root (`burne-ui/`)
 * @returns {{ name: string, group: string, src: string, exportKey: string, entryName: string }[]}
 */
export function listComponentEntries(root) {
  /** @type {{ name: string, group: string, src: string, exportKey: string, entryName: string }[]} */
  const list = [];
  const seen = new Map();

  for (const group of COMPONENT_GROUPS) {
    const dir = path.join(root, "src/components", group);
    for (const item of readdirSync(dir, { withFileTypes: true })) {
      if (!item.isDirectory()) continue;
      const src = path.join(dir, item.name, "index.ts");
      if (!existsSync(src)) continue;
      if (seen.has(item.name)) {
        throw new Error(
          `duplicate component ${item.name} (${seen.get(item.name)} and ${group})`,
        );
      }
      seen.set(item.name, group);
      list.push({
        name: item.name,
        group,
        src,
        exportKey: `./${item.name}`,
        entryName: `components/${group}/${item.name}/index`,
      });
    }
  }

  return list.sort((a, b) => a.name.localeCompare(b.name));
}

/** @param {string} group @param {string} name */
export function componentSubpathExport(group, name) {
  const base = `./dist/components/${group}/${name}/index`;
  return {
    types: `${base}.d.ts`,
    import: `${base}.js`,
    default: `${base}.js`,
  };
}

/**
 * Extra `build.lib.entry` keys. Paths match `preserveModulesRoot: src`,
 * so Rollup emits `dist/components/<group>/<Name>/index.js`.
 *
 * @param {string} root
 * @returns {Record<string, string>}
 */
export function componentLibEntries(root) {
  /** @type {Record<string, string>} */
  const entries = {};
  for (const item of listComponentEntries(root)) {
    entries[item.entryName] = item.src;
  }
  return entries;
}
