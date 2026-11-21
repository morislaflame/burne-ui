#!/usr/bin/env node
// Every string target in package.json `exports` must exist on disk after build.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pkg = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"));

/** @param {unknown} value @param {string[]} out */
function collectTargets(value, out = []) {
  if (typeof value === "string") out.push(value);
  else if (value && typeof value === "object") {
    for (const nested of Object.values(value)) collectTargets(nested, out);
  }
  return out;
}

const targets = [...new Set(collectTargets(pkg.exports))];
const missing = [];

for (const target of targets) {
  if (target.startsWith("node:") || /^[a-z]+:/.test(target)) continue;
  const file = path.resolve(root, target);
  if (!existsSync(file)) missing.push(target);
}

function walkCjs(dir, found = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkCjs(full, found);
    else if (entry.name.endsWith(".cjs")) found.push(path.relative(root, full));
  }
  return found;
}

const leftoverCjs = existsSync(path.join(root, "dist"))
  ? walkCjs(path.join(root, "dist"))
  : [];

if (missing.length > 0 || leftoverCjs.length > 0) {
  if (missing.length > 0) {
    console.error(
      `check-dist-exports: missing ${missing.length} export target(s):\n${missing
        .map((file) => `  ${file}`)
        .join("\n")}`,
    );
  }
  if (leftoverCjs.length > 0) {
    console.error(
      `check-dist-exports: ESM-only — leftover .cjs (${leftoverCjs.length}):\n${leftoverCjs
        .map((file) => `  ${file}`)
        .join("\n")}`,
    );
  }
  process.exit(1);
}

console.log(`check-dist-exports: OK — ${targets.length} export target(s), no .cjs`);
