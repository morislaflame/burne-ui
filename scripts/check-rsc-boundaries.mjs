#!/usr/bin/env node
import { readdirSync, readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  hasUseClientDirective,
  isServerSafeDistFile,
  needsUseClient,
} from "./rscBoundaries.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");

function walkJs(dir, files = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkJs(full, files);
      continue;
    }
    if (entry.name.endsWith(".js") || entry.name.endsWith(".cjs")) files.push(full);
  }
  return files;
}

if (!existsSync(dist)) {
  console.error("check-rsc-boundaries: dist/ is missing — run vite build first");
  process.exit(1);
}

const missing = [];
const forbidden = [];
let clientModules = 0;
let serverSafe = 0;

for (const file of walkJs(dist)) {
  const rel = path.relative(dist, file).replace(/\\/g, "/");
  const code = readFileSync(file, "utf8");
  const safe = isServerSafeDistFile(rel);
  const has = hasUseClientDirective(code);

  if (safe) {
    serverSafe += 1;
    if (has) forbidden.push(rel);
    continue;
  }

  if (needsUseClient(code)) {
    if (has) clientModules += 1;
    else missing.push(rel);
  } else if (has) {
    forbidden.push(rel);
  }
}

if (missing.length > 0 || forbidden.length > 0) {
  if (missing.length > 0) {
    console.error(
      `check-rsc-boundaries: missing "use client" (${missing.length}):\n${missing
        .map((file) => `  - ${file}`)
        .join("\n")}`,
    );
  }
  if (forbidden.length > 0) {
    console.error(
      `check-rsc-boundaries: unexpected "use client" (${forbidden.length}):\n${forbidden
        .map((file) => `  - ${file}`)
        .join("\n")}`,
    );
  }
  process.exit(1);
}

console.log(
  `check-rsc-boundaries: OK — ${clientModules} client module(s), ${serverSafe} server-safe`,
);
