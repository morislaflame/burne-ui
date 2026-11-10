#!/usr/bin/env node
// Э1.3: `box-shadow` has one owner (GSAP). CSS utilities must not transition it,
// and `focus-ring*` must not paint the ring via `box-shadow`.
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cssPath = path.join(root, "src/styles.css");
const FOCUS_UTILS = ["focus-ring", "focus-within-ring", "focus-ring-inset", "has-focus-ring"];

function stripComments(source) {
  return source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/.*$/gm, "$1");
}

function transitionValues(css) {
  const values = [];
  const re = /transition\s*:/gi;
  let match;
  while ((match = re.exec(css))) {
    const start = match.index + match[0].length;
    const end = css.indexOf(";", start);
    if (end === -1) continue;
    values.push({ start, value: css.slice(start, end) });
  }
  return values;
}

function utilityBody(css, name) {
  const marker = `@utility ${name}`;
  const at = css.indexOf(marker);
  if (at === -1) return null;
  const open = css.indexOf("{", at);
  if (open === -1) return null;
  let depth = 0;
  for (let i = open; i < css.length; i++) {
    const ch = css[i];
    if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) return css.slice(open + 1, i);
    }
  }
  return null;
}

const css = stripComments(await readFile(cssPath, "utf8"));
const errors = [];

for (const { value } of transitionValues(css)) {
  if (/(^|,)\s*box-shadow\b/i.test(value)) {
    errors.push(`box-shadow inside transition: ${value.trim().replace(/\s+/g, " ").slice(0, 120)}`);
  }
}

for (const name of FOCUS_UTILS) {
  const body = utilityBody(css, name);
  if (body == null) {
    errors.push(`missing @utility ${name}`);
    continue;
  }
  if (/(?:^|[;{}])\s*box-shadow\s*:/m.test(body)) {
    errors.push(`@utility ${name} paints with box-shadow`);
  }
}

const inset = utilityBody(css, "focus-ring-inset") ?? "";
if (!/outline-offset:\s*calc\(\s*-1\s*\*\s*var\(--focus-ring-width/.test(inset)) {
  errors.push("focus-ring-inset must use inward outline-offset: calc(-1 * var(--focus-ring-width…))");
}

if (errors.length > 0) {
  console.error(`check-shadow-single-owner: ${cssPath}\n${errors.map((e) => `  ${e}`).join("\n")}`);
  process.exit(1);
}

console.log("check-shadow-single-owner: OK — no box-shadow in CSS transitions; focus-ring* uses outline.");
