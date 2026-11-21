#!/usr/bin/env node
/**
 * TypeScript `nodenext` resolves `.d.ts` like ESM: relative specifiers need
 * `.js` (file) or `/index.js` (folder). vite-plugin-dts emits extensionless paths.
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");

const SPEC = /((?:export\s+\*\s+from|from|import)\s*\(?\s*)(['"])(\.[^'"]+)\2/g;
const HAS_EXT = /\.(?:js|mjs|cjs|json)$/;

/** Keep offsets; ignore specifiers inside JSDoc examples. */
function maskComments(source) {
  return source.replace(/\/\*[\s\S]*?\*\//g, (block) => block.replace(/[^\n]/g, " "));
}

function walkDts(dir, files = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkDts(full, files);
    else if (entry.name.endsWith(".d.ts")) files.push(full);
  }
  return files;
}

/** @param {string} fromFile @param {string} spec */
function resolveSpecifier(fromFile, spec) {
  if (HAS_EXT.test(spec)) return spec;
  const abs = path.resolve(path.dirname(fromFile), spec);
  if (existsSync(`${abs}.d.ts`)) return `${spec}.js`;
  if (existsSync(path.join(abs, "index.d.ts"))) {
    return spec.endsWith("/") ? `${spec}index.js` : `${spec}/index.js`;
  }
  return null;
}

if (!existsSync(dist)) {
  console.error("fix-dts-extensions: dist/ is missing — run vite build first");
  process.exit(1);
}

const unresolved = [];
let rewritten = 0;
let filesTouched = 0;

for (const file of walkDts(dist)) {
  const source = readFileSync(file, "utf8");
  const masked = maskComments(source);
  let next = source;
  let shifted = 0;
  for (const match of masked.matchAll(SPEC)) {
    const spec = match[3];
    const quote = match[2];
    const prefix = match[1];
    const resolved = resolveSpecifier(file, spec);
    if (!resolved) {
      unresolved.push(`${path.relative(dist, file)}: ${spec}`);
      continue;
    }
    if (resolved === spec) continue;
    const start = match.index + shifted;
    const end = start + match[0].length;
    const replacement = `${prefix}${quote}${resolved}${quote}`;
    next = next.slice(0, start) + replacement + next.slice(end);
    shifted += replacement.length - match[0].length;
    rewritten += 1;
  }
  if (next !== source) {
    writeFileSync(file, next);
    filesTouched += 1;
  }
}

const leftover = [];
for (const file of walkDts(dist)) {
  const masked = maskComments(readFileSync(file, "utf8"));
  for (const match of masked.matchAll(SPEC)) {
    const spec = match[3];
    if (!HAS_EXT.test(spec)) leftover.push(`${path.relative(dist, file)}: ${spec}`);
  }
}

if (unresolved.length > 0 || leftover.length > 0) {
  if (unresolved.length > 0) {
    console.error(
      `fix-dts-extensions: unresolved relative specifier(s):\n${unresolved
        .map((line) => `  ${line}`)
        .join("\n")}`,
    );
  }
  if (leftover.length > 0) {
    console.error(
      `fix-dts-extensions: relative specifier(s) still without extension:\n${leftover
        .map((line) => `  ${line}`)
        .join("\n")}`,
    );
  }
  process.exit(1);
}

console.log(
  `fix-dts-extensions: OK — ${rewritten} specifier(s) in ${filesTouched} file(s)`,
);
