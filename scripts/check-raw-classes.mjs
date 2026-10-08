#!/usr/bin/env node
// Raw Tailwind strings stay in *Styles.ts.
// *Parts.tsx and PascalCase component files: no className="…" and no class-list literals.
// *Styles.ts: no #hex, bg-white, text-black, border-white.
// Hex on a picker-physics line (or the two lines above it) is a color-channel gradient.
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(root, "src", "components");

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
    else files.push(full);
  }
  return files;
}

function isComponentFile(file) {
  const base = path.basename(file);
  if (!base.endsWith(".tsx")) return false;
  if (/\.(stories|test)\.tsx$/.test(base)) return false;
  return /Parts\.tsx$/.test(base) || /^[A-Z]/.test(base);
}

const CLASS_TOKEN = /^(?:[a-z][\w-]*:)*[a-z][\w[\]/.%-]*$/;
const EXACT_UTILITY =
  /^(?:relative|absolute|contents|flex|grid|hidden|block|inline|inline-flex|inline-block|shrink-0|truncate|sr-only|uppercase|lowercase)$/;
const PREFIX_UTILITY =
  /^(?:overflow|inline|border|text|bg|ring|outline|cursor|opacity|rounded|h|w|p|m|gap|z|origin|select|touch|pointer|min|max|font)-/;

function isUtilityToken(token) {
  const bare = token.split(":").pop() ?? token;
  return EXACT_UTILITY.test(bare) || PREFIX_UTILITY.test(bare);
}

function isClassLiteral(value) {
  const tokens = value.trim().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return false;
  if (!tokens.every((token) => CLASS_TOKEN.test(token))) return false;
  return tokens.some((token) => isUtilityToken(token));
}

function usedAsClass(text, index) {
  const before = text.slice(Math.max(0, index - 240), index);
  const cnAt = before.lastIndexOf("cn(");
  if (cnAt !== -1 && !before.slice(cnAt).includes(")")) return true;
  return /className=\{[^}"'`]*$/.test(before);
}

function classLiterals(text) {
  const found = [];
  const pattern = /(["'`])((?:\\.|(?!\1)[\s\S])*?)\1/g;
  for (const match of text.matchAll(pattern)) {
    if (match[1] === "`" && match[2].includes("${")) continue;
    if (!usedAsClass(text, match.index ?? 0)) continue;
    const value = match[2].replace(/\\(["'`])/g, "$1");
    if (isClassLiteral(value)) found.push(value);
  }
  return found;
}

const errors = [];
const files = await walk(src);

for (const file of files) {
  const rel = path.relative(root, file);
  const raw = await readFile(file, "utf8");

  if (file.endsWith("Styles.ts")) {
    const lines = raw.split("\n");
    lines.forEach((line, index) => {
      const window = lines.slice(Math.max(0, index - 2), index + 1).join("\n");
      const code = stripComments(line);
      if (/\b(?:bg-white|text-black|border-white)\b/.test(code)) {
        errors.push(`${rel}:${index + 1} off-token color class`);
      }
      if (!/picker-physics/.test(window) && /#[0-9a-fA-F]{3,8}\b/.test(stripComments(window))) {
        if (/#[0-9a-fA-F]{3,8}\b/.test(code)) {
          errors.push(`${rel}:${index + 1} hex color in styles`);
        }
      }
    });
    continue;
  }

  if (!isComponentFile(file)) continue;
  const text = stripComments(raw);
  if (/className=["']/.test(text)) {
    errors.push(`${rel} has className="…"`);
  }
  for (const value of classLiterals(text)) {
    errors.push(`${rel} class literal "${value}"`);
  }
}

if (errors.length > 0) {
  console.error(`check-raw-classes:\n${errors.map((error) => `  ${error}`).join("\n")}`);
  process.exit(1);
}

console.log("check-raw-classes: OK — class strings live in *Styles.ts; no off-token colors there.");
