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

function shadowMixAmount(opacity) {
  if (opacity === 0) return "0%";
  return `calc(${formatOpacity(opacity)} * 100% * var(--shadow-opacity))`;
}

function shadowColor(opacity, colorVar) {
  return `color-mix(in oklab, var(${colorVar}) ${shadowMixAmount(opacity)}, transparent)`;
}

function shadowNoneLayer() {
  // Two collapsed layers (key + ambient) so GSAP can morph from/to sized shadows.
  return [
    `    0px 0px 0px 0px`,
    `      color-mix(in oklab, var(--color-shadow) 0%, transparent),`,
    `    0px 0px 0px 0px`,
    `      color-mix(in oklab, var(--color-shadow-secondary) 0%, transparent);`,
  ].join("\n");
}

function ambientGeom(geom) {
  const [ox, oy, blur, spread] = geom;
  return [ox, oy + Math.max(1, Math.round(oy * 0.5)), Math.max(blur + 2, Math.round(blur * 2)), spread];
}

function shadowLayerLine(geom, opacity, colorVar) {
  const [ox, oy, blur, spread] = geom;
  return [
    `    calc(${ox}px + var(--shadow-offset-x)) calc(${oy}px + var(--shadow-offset-y))`,
    `      calc(${blur}px * var(--shadow-blur)) calc(${spread}px * var(--shadow-spread))`,
    `      ${shadowColor(opacity, colorVar)}`,
  ].join("\n");
}

/** Key layer (`--color-shadow`) + softer ambient (`--color-shadow-secondary`). */
function shadowLayer(geom, opacity) {
  const ambientOpacity = Math.round(opacity * 0.45 * 1000) / 1000;
  return [
    `${shadowLayerLine(geom, opacity, "--color-shadow")},`,
    shadowLayerLine(ambientGeom(geom), ambientOpacity, "--color-shadow-secondary") + ";",
  ].join("\n");
}

const SHADOW_LEVELS = ["small", "base", "mid", "large"];

function shadowBlock(theme) {
  const opacity = primitives.shadowOpacity[theme];
  const geom = primitives.shadowGeom;
  const lines = [];
  if (theme === "dark") {
    lines.push(`  --shadow-opacity: 1;`);
    lines.push(`  --shadow-blur: 1;`);
    lines.push(`  --shadow-spread: 1;`);
    lines.push(`  --shadow-offset-x: 0px;`);
    lines.push(`  --shadow-offset-y: 0px;`);
  }
  lines.push(`  --shadow-none:`, shadowNoneLayer());

  for (const level of SHADOW_LEVELS) {
    lines.push(`  --shadow-${level}:`, shadowLayer(geom[level].rest, opacity[level].rest));
    lines.push(
      `  --shadow-${level}-hover:`,
      shadowLayer(geom[level].hover, opacity[level].hover),
    );
    lines.push(
      `  --shadow-${level}-press:`,
      shadowLayer(geom[level].press, opacity[level].press),
    );
  }

  // First-level appear (Button): none → lift on hover; press back to none.
  lines.push(`  --shadow-lift:`, shadowLayer(geom.lift.hover, opacity.lift.hover));

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
