#!/usr/bin/env node
import { createRequire } from "node:module";
import { runInit } from "./init.js";
import { runSkinAdd } from "./skin-add.mjs";
import { runSkinBuild } from "./skin-build.mjs";
import { runSkinValidate } from "./skin-validate.mjs";

const require = createRequire(import.meta.url);
const { version } = require("../package.json");

const argv = process.argv.slice(2);
const cmd = argv[0];

function printHelp() {
  console.log(`
burne-ui  v${version}

Add Burne UI to an existing project, or see create-burne-app for a new one.

Usage:
  npx burne-ui@latest init [options]
  npx burne-ui@latest skin add <name> [--tier 1|2|3]
  npx burne-ui@latest skin validate [dir]
  npx burne-ui@latest skin build [dir]
  pnpm dlx burne-ui init
  bunx burne-ui init

Commands:
  init            Patch CSS, install deps, add BurneUIProvider
  skin add        Scaffold burne-ui-skin-<name> (tier 1 tokens, tier 2 classes, tier 3 layers)
  skin validate   Check tokens, contrast, slots, layers, and recipe names
  skin build      Write dist/styles.css from src/skin.json

Options (init):
  --yes, -y          skip prompts (arrow menus)
  --pm               npm | pnpm | bun | yarn
  --theme            system | dark | light   (default: system)
  --no-toast         do not wrap Toast.Provider
  --skip-install     do not install packages
  --css <path>       global CSS file to patch
  --help, -h
  --version, -v

New project:
  npm create burne-app@latest
`);
}

if (!cmd || cmd === "--help" || cmd === "-h" || cmd === "help") {
  printHelp();
  process.exit(0);
}

if (cmd === "--version" || cmd === "-v") {
  console.log(version);
  process.exit(0);
}

if (cmd === "init") {
  runInit(argv.slice(1), version).catch((err) => {
    console.error(err instanceof Error ? err.message : err);
    process.exit(1);
  });
} else if (cmd === "skin") {
  const sub = argv[1];
  if (sub === "add") runSkinAdd(argv.slice(2));
  else if (sub === "validate") runSkinValidate(argv.slice(2));
  else if (sub === "build") runSkinBuild(argv.slice(2));
  else {
    console.error("Usage: burne-ui skin add <name> [--tier 1|2|3] | burne-ui skin validate [dir] [--slot name] | burne-ui skin build [dir] [--slot name]");
    process.exit(1);
  }
} else {
  console.error(`Unknown command: ${cmd}\n\nRun: burne-ui init`);
  process.exit(1);
}
