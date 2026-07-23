/**
 * Sync generated CSS regions in `src/tokens/styles.css` from `tokenPrimitives.json`.
 * Source of truth: JSON → CSS markers + TS imports the same JSON.
 *
 * Usage: `node scripts/sync-generated-tokens.mjs`
 * Also runs from `npm run lint` / `prebuild` check mode.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const primitivesPath = join(root, "src/tokens/tokenPrimitives.json");
const cssPath = join(root, "src/tokens/styles.css");

const primitives = JSON.parse(readFileSync(primitivesPath, "utf8"));

function formatRem(n) {
  return `${n}rem`;
}

function textScaleBlock() {
  const lines = [];
  for (const [key, { size, line }] of Object.entries(primitives.textScale)) {
    lines.push(`  --text-scale-${key}: ${formatRem(size)};`);
    lines.push(
      `  --text-scale-${key}--line-height: calc(${formatRem(line)} / ${formatRem(size)});`,
    );
    lines.push("");
  }
  // drop trailing blank
  if (lines.at(-1) === "") lines.pop();
  return lines.join("\n");
}

function formatOpacity(opacity) {
  if (opacity === 0) return "0";
  // Keep historical two-digit form for 0.20
  if (Object.is(opacity, 0.2)) return "0.20";
  return String(opacity);
}

function shadowLayer(geom, opacity) {
  const [, oy, blur, spread] = geom;
  return [
    `    0 calc(${oy}px * var(--shadow-size)) calc(${blur}px * var(--shadow-size))`,
    `      calc(${spread}px * var(--shadow-size)) rgb(0 0 0 / ${formatOpacity(opacity)});`,
  ].join("\n");
}

function shadowBlock(theme) {
  const opacity = primitives.shadowOpacity[theme];
  const geom = primitives.shadowGeom;
  const lines = [];
  if (theme === "dark") {
    lines.push(`  --shadow-size: ${primitives.shadowSize};`);
  }
  lines.push(`  --shadow-none:`, shadowLayer(geom.base, 0));
  lines.push(`  --shadow-base:`, shadowLayer(geom.base, opacity.base));
  lines.push(`  --shadow-mid:`, shadowLayer(geom.mid, opacity.mid));
  lines.push(`  --shadow-large:`, shadowLayer(geom.large, opacity.large));
  return lines.join("\n");
}

function fontBlock() {
  return [
    `  --font-family-sans: ${primitives.fontFamilySans};`,
    `  --font-family-mono: ${primitives.fontFamilyMono};`,
  ].join("\n");
}

function replaceMarked(css, id, body) {
  const startRe = new RegExp(`^([ \\t]*)/\\* BEGIN GENERATED:${id} \\*/\\r?\\n`, "m");
  const endRe = new RegExp(`^([ \\t]*)/\\* END GENERATED:${id} \\*/`, "m");
  const startMatch = startRe.exec(css);
  const endMatch = endRe.exec(css);
  if (!startMatch || !endMatch || endMatch.index < startMatch.index) {
    throw new Error(`Missing markers for ${id} in ${cssPath}`);
  }
  const indent = startMatch[1] || "  ";
  const before = css.slice(0, startMatch.index + startMatch[0].length);
  const after = css.slice(endMatch.index + endMatch[0].length);
  return `${before}${body}\n${indent}/* END GENERATED:${id} */${after}`;
}

const checkOnly = process.argv.includes("--check");

let css = readFileSync(cssPath, "utf8");
const next = replaceMarked(
  replaceMarked(replaceMarked(css, "fonts", fontBlock()), "text-scale", textScaleBlock()),
  "shadows-dark",
  shadowBlock("dark"),
);
const next2 = replaceMarked(next, "shadows-light", shadowBlock("light"));

if (next2 === css) {
  console.log("token CSS already in sync with tokenPrimitives.json");
  process.exit(0);
}

if (checkOnly) {
  console.error("token CSS out of sync with tokenPrimitives.json — run: node scripts/sync-generated-tokens.mjs");
  process.exit(1);
}

writeFileSync(cssPath, next2);
console.log("updated generated regions in src/tokens/styles.css");
