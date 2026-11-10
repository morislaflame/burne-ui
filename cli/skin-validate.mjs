/**
 * `burne-ui skin validate [dir]`
 *
 * Reads `src/skin.json` (or `skin.json`), `src/skin.css`, and `src/layers.tsx`.
 * Slot names come from `cli/skin-slots.json` (same list as `SkinSlot`).
 * Live slots come from `cli/skin-live-slots.json`: a classNames key that no
 * component reads is a dead slot.
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  checkFocusRingContrast,
  contrastRatio,
  parseCssColor,
  shadowLayerCount,
} from "./skin-color.mjs";
import { parseSkinDocument } from "../dist/skins/skinDocument.js";
import { registerSkinSlots as registerDocumentSlots } from "../dist/skins/skinSlotRegistry.js";

export { checkFocusRingContrast, contrastRatio, parseCssColor, shadowLayerCount };

/** Width and offset stay on the kit. Color is allowed when contrast holds. */
export const FORBIDDEN_SKIN_TOKENS = ["--focus-ring-width", "--focus-ring-offset"];

/** Informational. The validator accepts any number of `--shadow-*` layers. */
export const KIT_SHADOW_LAYER_COUNT = 2;

/** Kit tokens a skin stylesheet may set without listing them in `tokens`. */
const KIT_CSS_PREFIXES = [
  "--color-",
  "--radius",
  "--border-",
  "--shadow-",
  "--motion-",
  "--font-",
  "--space-",
  "--size-",
  "--text-",
  "--letter-",
  "--icon-",
  "--z-",
  "--control-",
];

const RING_ASSIGN =
  /--(?:color-focus-ring(?:-danger|-success|-info|-warning)?|focus-ring-width|focus-ring-offset)\s*:/;

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

export function cssCustomProperties(css) {
  const stripped = css.replace(/\/\*[\s\S]*?\*\//g, "");
  return [...stripped.matchAll(/(--[A-Za-z0-9-]+)\s*:/g)].map((match) => match[1]);
}

export function cssTouchesForcedColors(css) {
  return forcedColorBlocks(css).length > 0;
}

/** `--name-*` and CSS-private `--_*` belong to the skin, not to `tokens`. */
export function isSkinOwnedCustomProperty(token, skinName) {
  return token.startsWith(`--${skinName}-`) || token.startsWith("--_");
}

export function isKitCssToken(token) {
  if (token.startsWith("--color-focus-ring")) return false;
  return KIT_CSS_PREFIXES.some((prefix) => token.startsWith(prefix));
}

export function forcedColorBlocks(css) {
  const stripped = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const blocks = [];
  const re = /@media\b[^{]*forced-colors[^{]*\{/gi;
  let match = re.exec(stripped);
  while (match) {
    let depth = 1;
    let index = match.index + match[0].length;
    const start = index;
    while (index < stripped.length && depth > 0) {
      if (stripped[index] === "{") depth += 1;
      else if (stripped[index] === "}") depth -= 1;
      index += 1;
    }
    blocks.push(stripped.slice(start, index - 1));
    match = re.exec(stripped);
  }
  return blocks;
}

export function cssForcedColorsTouchesRing(css) {
  return forcedColorBlocks(css).some(
    (block) => RING_ASSIGN.test(block) || /\.focus-ring\b[\s\S]*?outline\s*:/.test(block),
  );
}

function tokenMaps(definition) {
  return [definition.tokens, definition.tokensLight, definition.tokensDark].filter(
    (map) => map && typeof map === "object",
  );
}

function declaredTokenNames(definition) {
  return new Set(tokenMaps(definition).flatMap((map) => Object.keys(map)));
}

const extraSlots = new Set();

/** Same contract as `registerSkinSlots` from `burne-ui/skin`, for this CLI process. */
export function registerSkinSlots(slots) {
  const names = [];
  for (const slot of slots) {
    if (typeof slot !== "string") continue;
    const name = slot.trim();
    if (!name) continue;
    extraSlots.add(name);
    names.push(name);
  }
  if (names.length > 0) registerDocumentSlots(names);
}

/** Test-only. */
export function resetRegisteredSkinSlots() {
  extraSlots.clear();
  registerDocumentSlots([], "replace");
}

/** Custom properties a skin declares on a rule or `@property`, not in `tokens`. */
function declaredRuleProperties(definition) {
  const names = new Set();
  const rules = definition?.rules;
  if (rules && typeof rules === "object") {
    for (const spec of Object.values(rules)) {
      collectCustomProperties(spec, names);
    }
  }
  const properties = definition?.properties;
  if (properties && typeof properties === "object") {
    for (const name of Object.keys(properties)) {
      if (name.startsWith("--")) names.add(name);
    }
  }
  return names;
}

function collectCustomProperties(value, names) {
  if (!value || typeof value !== "object") return;
  for (const [key, item] of Object.entries(value)) {
    if (key.startsWith("--")) names.add(key);
    else collectCustomProperties(item, names);
  }
}

function mergeRegistered(slots) {
  const set = slots instanceof Set ? new Set(slots) : new Set(slots);
  for (const slot of extraSlots) set.add(slot);
  return set;
}

/**
 * @param {string[]} argv
 * @returns {{ dir: string, error?: string }}
 */
export function consumeSkinCliArgs(argv) {
  const positional = [];
  const slots = [];
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--slot") {
      const name = argv[i + 1];
      if (!name || name.startsWith("-")) return { dir: process.cwd(), error: "--slot needs a slot name" };
      slots.push(name);
      i += 1;
      continue;
    }
    positional.push(argv[i]);
  }
  registerSkinSlots(slots);
  const dir = positional.find((arg) => !arg.startsWith("-")) ?? process.cwd();
  return { dir };
}

/**
 * Document checks come from `parseSkinDocument` (same checker as `validateDesign`).
 * `slots` and `live` stay on the signature for callers; the catalog is the generated
 * slot list plus `registerSkinSlots`.
 * CSS forced-colors and `layers.tsx` stay here.
 *
 * @param {{ definition: object, css?: string, layersSource?: string, slots: Iterable<string>, live?: { targets: Iterable<string>, motion: Iterable<string>, layers: Iterable<string> } }} input
 * @returns {string[]}
 */
export function validateSkin({ definition, css = "", layersSource = "" }) {
  const errors = [];
  const parsed = parseSkinDocument(definition);
  if (!parsed.ok) errors.push(...parsed.errors);

  const name = definition && typeof definition === "object" ? definition.name : "";
  const declared = declaredTokenNames(definition ?? {});
  const ruleProperties = declaredRuleProperties(definition);

  for (const token of cssCustomProperties(css)) {
    if (FORBIDDEN_SKIN_TOKENS.includes(token)) {
      errors.push(`forbidden token ${token}`);
      continue;
    }
    if (declared.has(token)) continue;
    if (ruleProperties.has(token)) continue;
    if (typeof name === "string" && isSkinOwnedCustomProperty(token, name)) continue;
    if (isKitCssToken(token)) continue;
    errors.push(`${token} is set in CSS but missing from tokens, tokensLight, and tokensDark`);
  }

  if (cssForcedColorsTouchesRing(css)) {
    errors.push("forced-colors block must not set the focus ring");
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
  return [...mergeRegistered(JSON.parse(readFileSync(path, "utf8")))];
}

export function readSkinLiveSlots() {
  const path = join(dirname(fileURLToPath(import.meta.url)), "skin-live-slots.json");
  const live = JSON.parse(readFileSync(path, "utf8"));
  return {
    targets: [...mergeRegistered(live.targets)],
    motion: [...mergeRegistered(live.motion)],
    layers: [...mergeRegistered(live.layers)],
  };
}

function readOptional(path) {
  return existsSync(path) ? readFileSync(path, "utf8") : "";
}

function inlineCssImports(file, seen) {
  if (!file || seen.has(file) || !existsSync(file)) return "";
  seen.add(file);
  const css = readFileSync(file, "utf8");
  return css.replace(/@import\s+["'](\.[^"']+)["']\s*;?/g, (_, relative) =>
    inlineCssImports(join(dirname(file), relative), seen),
  );
}

function readCssBundle(dir) {
  const entry = existsSync(join(dir, "src/skin.css"))
    ? join(dir, "src/skin.css")
    : join(dir, "skin.css");
  if (!existsSync(entry)) return "";
  return inlineCssImports(entry, new Set());
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
    css: readCssBundle(dir),
    layersSource: readOptional(join(dir, "src/layers.tsx")),
  };
}

export function runSkinValidate(argv) {
  const parsed = consumeSkinCliArgs(argv);
  if (parsed.error) {
    console.error(parsed.error);
    process.exit(1);
  }
  const dir = parsed.dir;
  let loaded;
  try {
    loaded = loadSkinPackage(dir);
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
  const errors = validateSkin({ ...loaded, slots: readSkinSlots(), live: readSkinLiveSlots() });
  if (errors.length > 0) {
    for (const error of errors) console.error(error);
    process.exit(1);
  }
  console.log(`skin ok (${dir})`);
}
