#!/usr/bin/env node
// gsap.to / from / fromTo / set / timeline stay in recipes, slotMotion, and gsapMotion.
// Everything else in src/components needs an allowlist entry until it moves.
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const components = path.join(root, "src", "components");

/** Still raw on purpose. Drawer / Disclosure drag, Pagination FLIP, SelectionIndicator, and shared engines. */
const ALLOW = new Set([
  "core/utils/useChevronRotation.ts",
  "core/utils/hoverInteractiveLift.ts",
  "core/utils/useShadowMotion.ts",
  "core/utils/shadowFade.ts",
  "core/utils/useCollapsibleHeight.ts",
  "core/utils/pressRipple.tsx",
  "core/utils/searchInputExpandMotion.ts",
  "core/Button/buttonAnimations.ts",
  "core/ToggleButton/toggleButtonAnimations.ts",
  "core/ToggleButton/useToggleButtonFillAnimation.ts",
  "core/Checkbox/checkboxAnimations.ts",
  "core/Radio/radioAnimations.ts",
  "core/Pagination/paginationAnimations.ts",
  "core/SelectionIndicator/selectionIndicatorAnimations.ts",
  "core/Drawer/drawerAnimations.ts",
  "core/Drawer/useDrawerHandleDrag.ts",
  "core/Disclosure/useDisclosureContentDrag.ts",
]);

const CALL = /gsap\.(?:to|from|fromTo|set|timeline)\s*\(/;

function stripComments(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, (block) => block.replace(/[^\n]/g, " "))
    .replace(/(^|[^:])\/\/.*$/gm, "$1");
}

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else if (/\.(ts|tsx)$/.test(entry.name)) files.push(full);
  }
  return files;
}

function skipped(rel) {
  if (rel.includes(`${path.sep}slotMotion${path.sep}`)) return true;
  if (rel.endsWith(`${path.sep}gsapMotion.ts`)) return true;
  if (/\.(stories|test)\.tsx?$/.test(rel)) return true;
  return false;
}

const errors = [];
for (const file of await walk(components)) {
  const rel = path.relative(components, file);
  if (skipped(file)) continue;
  if (ALLOW.has(rel.split(path.sep).join("/"))) continue;
  const source = stripComments(await readFile(file, "utf8"));
  if (CALL.test(source)) errors.push(rel.split(path.sep).join("/"));
}

if (errors.length > 0) {
  console.error(
    "check-raw-gsap: raw gsap outside recipes/slotMotion:\n" +
      errors.map((line) => `- ${line}`).join("\n"),
  );
  process.exit(1);
}

console.log("check-raw-gsap: OK");
