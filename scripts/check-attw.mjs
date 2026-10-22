#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const attw = path.join(
  path.dirname(require.resolve("@arethetypeswrong/cli/package.json")),
  "dist/index.js",
);

const result = spawnSync(
  process.execPath,
  [
    attw,
    "--pack",
    ".",
    "--profile",
    "esm-only",
    "--no-summary",
    "--exclude-entrypoints",
    "styles.css",
    "tailwind.css",
  ],
  { cwd: root, stdio: "inherit" },
);

if (result.error) {
  console.error(result.error);
  process.exit(1);
}
process.exit(result.status ?? 1);
