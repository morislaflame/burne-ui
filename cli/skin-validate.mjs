/**
 * `burne-ui skin validate [dir]`
 *
 * Reads `src/skin.json` (or `skin.json`), `src/skin.css`, and `src/layers.tsx`.
 * Slot names come from `cli/skin-slots.json` (same list as `SkinSlot`).
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export const FORBIDDEN_SKIN_TOKENS = [
  "--color-focus-ring",
  "--color-focus-ring-danger",
  "--color-focus-ring-success",
  "--color-focus-ring-info",
  "--color-focus-ring-warning",
  "--focus-ring-width",
  "--focus-ring-offset",
];

/** Kit `--shadow-*` strings are two layers. GSAP cross-fade requires the same count. */
export const KIT_SHADOW_LAYER_COUNT = 2;

export const SHADOW_TOKEN =
  /^--shadow-(?:small|base|mid|large|xlarge|lift)(?:-hover|-press)?$/;

export const MOTION_PHASES = new Set([
  "hoverIn",
  "hoverOut",
  "pressIn",
  "pressOut",
  "mount",
  "enter",
  "leave",
  "check",
  "uncheck",
  "change",
]);

const AA_CONTRAST = 4.5;

export function shadowLayerCount(value) {
  const text = String(value ?? "").trim();
  if (!text) return 0;
  let depth = 0;
  let count = 1;
  for (const ch of text) {
    if (ch === "(") depth += 1;
    else if (ch === ")") depth = Math.max(0, depth - 1);
    else if (ch === "," && depth === 0) count += 1;
  }
  return count;
}

/** `#rgb`, `#rrggbb`, `rgb()`, `rgba()` with alpha 1. `null` when the color cannot be measured. */
export function parseCssColor(value) {
  const text = String(value).trim();
  const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(text);
  if (hex) {
    let body = hex[1];
    if (body.length === 3) body = body.split("").map((ch) => ch + ch).join("");
    return [
      Number.parseInt(body.slice(0, 2), 16),
      Number.parseInt(body.slice(2, 4), 16),
      Number.parseInt(body.slice(4, 6), 16),
    ];
  }
  const rgb = /^rgba?\(\s*(\d{1,3})\s*[, ]\s*(\d{1,3})\s*[, ]\s*(\d{1,3})(?:\s*[,/]\s*([0-9.]+%?))?\s*\)$/i.exec(
    text,
  );
  if (!rgb) return null;
  const channels = [rgb[1], rgb[2], rgb[3]].map(Number);
  if (channels.some((channel) => channel > 255)) return null;
  const alpha = rgb[4];
  if (alpha != null && alpha !== "1" && alpha !== "100%") return null;
  return channels;
}

function channelLinear(channel) {
  const value = channel / 255;
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

function relativeLuminance([red, green, blue]) {
  return (
    0.2126 * channelLinear(red) +
    0.7152 * channelLinear(green) +
    0.0722 * channelLinear(blue)
  );
}

export function contrastRatio(foreground, background) {
  const lighter = Math.max(relativeLuminance(foreground), relativeLuminance(background));
  const darker = Math.min(relativeLuminance(foreground), relativeLuminance(background));
  return (lighter + 0.05) / (darker + 0.05);
}

export function cssCustomProperties(css) {
  const stripped = css.replace(/\/\*[\s\S]*?\*\//g, "");
  return [...stripped.matchAll(/(--[A-Za-z0-9-]+)\s*:/g)].map((match) => match[1]);
}

export function cssTouchesForcedColors(css) {
  return /forced-colors/i.test(css.replace(/\/\*[\s\S]*?\*\//g, ""));
}

function tokenMaps(definition) {
  return [definition.tokens, definition.tokensLight, definition.tokensDark].filter(
    (map) => map && typeof map === "object",
  );
}

function declaredTokenNames(definition) {
  return new Set(tokenMaps(definition).flatMap((map) => Object.keys(map)));
}

function checkContrast(errors, label, map) {
  const foreground = map["--color-foreground"];
  const surface = map["--color-surface"];
  if (foreground == null && surface == null) return;
  if (foreground == null || surface == null) {
    errors.push(`${label}: set both --color-foreground and --color-surface`);
    return;
  }
  const foregroundColor = parseCssColor(foreground);
  const surfaceColor = parseCssColor(surface);
  if (!foregroundColor || !surfaceColor) {
    errors.push(
      `${label}: --color-foreground and --color-surface must be hex or rgb so contrast can be measured`,
    );
    return;
  }
  const ratio = contrastRatio(foregroundColor, surfaceColor);
  if (ratio < AA_CONTRAST) {
    errors.push(`${label}: contrast ${ratio.toFixed(2)} is below WCAG AA ${AA_CONTRAST}`);
  }
}

function slotMaps(definition) {
  return [
    ["targets", definition.targets],
    ["motion", definition.motion],
    ["layersDeclarative", definition.layersDeclarative],
    ["layers", definition.layers],
  ];
}

/**
 * @param {{ definition: object, css?: string, layersSource?: string, slots: Iterable<string> }} input
 * @returns {string[]}
 */
export function validateSkin({ definition, css = "", layersSource = "", slots }) {
  const errors = [];
  if (!definition || typeof definition !== "object" || typeof definition.name !== "string" || !definition.name) {
    return ["skin.json needs a string name"];
  }

  const slotSet = slots instanceof Set ? slots : new Set(slots);
  const declared = declaredTokenNames(definition);

  for (const map of tokenMaps(definition)) {
    for (const key of Object.keys(map)) {
      if (FORBIDDEN_SKIN_TOKENS.includes(key)) {
        errors.push(`forbidden token ${key}`);
      }
      if (SHADOW_TOKEN.test(key) && shadowLayerCount(map[key]) !== KIT_SHADOW_LAYER_COUNT) {
        errors.push(
          `${key} has ${shadowLayerCount(map[key])} shadow layer(s); the kit uses ${KIT_SHADOW_LAYER_COUNT}`,
        );
      }
    }
  }

  for (const token of cssCustomProperties(css)) {
    if (FORBIDDEN_SKIN_TOKENS.includes(token)) {
      errors.push(`forbidden token ${token}`);
      continue;
    }
    if (!declared.has(token)) {
      errors.push(`${token} is set in CSS but missing from tokens, tokensLight, and tokensDark`);
    }
  }

  if (cssTouchesForcedColors(css)) {
    errors.push("skin CSS must not override forced-colors");
  }

  const base = definition.tokens ?? {};
  checkContrast(errors, "tokens", base);
  if (definition.tokensLight) checkContrast(errors, "tokensLight", { ...base, ...definition.tokensLight });
  if (definition.tokensDark) checkContrast(errors, "tokensDark", { ...base, ...definition.tokensDark });

  for (const [label, map] of slotMaps(definition)) {
    if (!map || typeof map !== "object") continue;
    for (const slot of Object.keys(map)) {
      if (!slotSet.has(slot)) errors.push(`${label} slot ${slot} is not a SkinSlot`);
      if (label === "motion") {
        const phases = map[slot];
        if (!phases || typeof phases !== "object") continue;
        for (const phase of Object.keys(phases)) {
          if (!MOTION_PHASES.has(phase)) errors.push(`motion ${slot}.${phase} is not a kit phase`);
        }
      }
    }
  }

  if (layersSource.trim()) {
    const hasJsx = /<[A-Za-z]/.test(layersSource);
    const forwardsRef = /\{\.\.\.(?:props|rest)\}/.test(layersSource) || /ref=\{/.test(layersSource);
    if (hasJsx && !forwardsRef) {
      errors.push("layers must forward ref onto the DOM node ({...props} or ref={ref})");
    }
  }

  return errors;
}

export function readSkinSlots() {
  const path = join(dirname(fileURLToPath(import.meta.url)), "skin-slots.json");
  return JSON.parse(readFileSync(path, "utf8"));
}

function readOptional(path) {
  return existsSync(path) ? readFileSync(path, "utf8") : "";
}

export function loadSkinPackage(dir) {
  const jsonPath = existsSync(join(dir, "src/skin.json"))
    ? join(dir, "src/skin.json")
    : join(dir, "skin.json");
  if (!existsSync(jsonPath)) {
    throw new Error(`No src/skin.json or skin.json in ${dir}`);
  }
  let definition;
  try {
    definition = JSON.parse(readFileSync(jsonPath, "utf8"));
  } catch (error) {
    throw new Error(`Cannot parse ${jsonPath}: ${error instanceof Error ? error.message : error}`);
  }
  return {
    definition,
    css: readOptional(join(dir, "src/skin.css")) || readOptional(join(dir, "skin.css")),
    layersSource: readOptional(join(dir, "src/layers.tsx")),
  };
}

export function runSkinValidate(argv) {
  const dir = argv.find((arg) => !arg.startsWith("-")) ?? process.cwd();
  let loaded;
  try {
    loaded = loadSkinPackage(dir);
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
  const errors = validateSkin({ ...loaded, slots: readSkinSlots() });
  if (errors.length > 0) {
    for (const error of errors) console.error(error);
    process.exit(1);
  }
  console.log(`skin ok (${dir})`);
}
