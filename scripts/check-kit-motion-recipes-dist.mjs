#!/usr/bin/env node
// Fail the library build if kit recipe registration was tree-shaken out of dist.
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const recipesDir = path.join(root, "dist/components/core/utils/slotMotion/recipes");

const MARKERS = [
  "switchThumb",
  "switchFill",
  "hoverLiftSecondLevel",
  "modalPanelEnter",
  "enableSwitchThumb",
  "progressFill",
];

async function readJsFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const chunks = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      chunks.push(await readJsFiles(full));
      continue;
    }
    if (entry.name.endsWith(".js")) chunks.push(await readFile(full, "utf8"));
  }
  return chunks.join("\n");
}

async function main() {
  const source = await readJsFiles(recipesDir);
  const missing = MARKERS.filter((marker) => !source.includes(marker));
  if (missing.length > 0) {
    console.error(
      `check-kit-motion-recipes-dist: missing in recipes/:\n${missing.map((m) => `  - ${m}`).join("\n")}`,
    );
    process.exit(1);
  }
  console.log(
    `check-kit-motion-recipes-dist: OK — kit recipe markers present in recipes/`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
