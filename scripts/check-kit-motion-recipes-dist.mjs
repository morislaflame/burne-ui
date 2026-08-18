#!/usr/bin/env node
// Fail the library build if kit recipe registration was tree-shaken out of dist.
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distPath = path.join(root, "dist/index.js");

const MARKERS = [
  "switchThumb",
  "switchFill",
  "hoverLiftSecondLevel",
  "modalPanelEnter",
  "enableSwitchThumb",
  "progressFill",
];

async function main() {
  const source = await readFile(distPath, "utf8");
  const missing = MARKERS.filter((marker) => !source.includes(marker));
  if (missing.length > 0) {
    console.error(
      `check-kit-motion-recipes-dist: missing in dist/index.js:\n${missing.map((m) => `  - ${m}`).join("\n")}`,
    );
    process.exit(1);
  }
  console.log(
    `check-kit-motion-recipes-dist: OK — kit recipe markers present in dist/index.js`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
