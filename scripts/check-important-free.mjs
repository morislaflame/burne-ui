#!/usr/bin/env node
// Э3.3: no `!important` outside the allowlist.
// Allowlist: iOS zoom-guard, reduced-motion skeleton, forced-colors selection marks.
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(root, "src");

function stripComments(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, (block) => block.replace(/[^\n]/g, " "))
    .replace(/(^|[^:])\/\/.*$/gm, "$1");
}

function blockBody(css, start) {
  const open = css.indexOf("{", start);
  if (open === -1) return "";
  let depth = 0;
  for (let i = open; i < css.length; i++) {
    const ch = css[i];
    if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) return css.slice(open, i + 1);
    }
  }
  return "";
}

function collectBodies(css, marker) {
  const bodies = [];
  let from = 0;
  while (from < css.length) {
    const at = css.indexOf(marker, from);
    if (at === -1) break;
    bodies.push(blockBody(css, at));
    from = at + marker.length;
  }
  return bodies;
}

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else if (/\.(css|ts|tsx)$/.test(full) && !/\.(test|stories)\.(ts|tsx)$/.test(full)) {
      files.push(full);
    }
  }
  return files;
}

const errors = [];
const files = await walk(src);

for (const file of files) {
  const raw = await readFile(file, "utf8");
  const text = stripComments(raw);
  if (!text.includes("!important")) continue;

  if (path.basename(file) !== "styles.css" || !file.endsWith(`${path.sep}src${path.sep}styles.css`)) {
    errors.push(`${path.relative(root, file)} contains !important`);
    continue;
  }

  const allowed = [
    ...collectBodies(text, "@utility field-control-mobile-no-zoom"),
    ...collectBodies(text, "@media (prefers-reduced-motion: reduce)"),
    ...collectBodies(text, "@media (forced-colors: active)"),
  ].join("\n");

  const declarations = [...text.matchAll(/[^{};]*!important/g)].map((match) => match[0].trim());
  for (const declaration of declarations) {
    if (!allowed.includes(declaration)) {
      errors.push(`styles.css !important outside the allowlist: ${declaration.slice(0, 120)}`);
    }
  }

  const zoom = collectBodies(text, "@utility field-control-mobile-no-zoom").join("\n");
  if (!/font-size:\s*16px\s*!important/.test(zoom)) {
    errors.push("zoom-guard field-control-mobile-no-zoom lost font-size: 16px !important");
  }
}

if (errors.length > 0) {
  console.error(`check-important-free:\n${errors.map((error) => `  ${error}`).join("\n")}`);
  process.exit(1);
}

console.log(
  "check-important-free: OK — !important only in the zoom-guard, reduced-motion skeleton, and forced-colors marks.",
);
