/**
 * Serializable skin file for the editor and `skin validate`.
 * `layers` (render functions) are not part of the document.
 */
import { MOTION_PHASE_NAMES } from "@/components/core/utils/slotMotion/slotMotionTypes";
import {
  checkContrastPairs,
  checkFocusRingContrast,
  parseCssColor,
  shadowLayerCount,
} from "../../cli/skin-color.mjs";
import { skinMotionRecipeError } from "../../cli/skin-recipe.mjs";
import { renderSkinStylesheet } from "../../cli/skin-stylesheet.mjs";

export { parseCssColor, renderSkinStylesheet, shadowLayerCount };
import { isAcceptedSkinSlot, skinSlotIssue } from "@/skins/skinSlotRegistry";
import { isForbiddenSkinToken, SKIN_LAYER_SLOTS, SKIN_MOTION_SLOTS, SKIN_SLOTS, SKIN_TARGET_SLOTS, type SkinDeclarativeLayers, type SkinDeclarativeNode, type SkinDefinition, type SkinElevation, type SkinFontFace, type SkinLayerSlot, type SkinMeta, type SkinMotionPhaseValue, type SkinMotionSlot, type SkinPropertyDefinition, type SkinRuleDeclarations, type SkinSlotRules, type SkinTargetSlot, type SkinTargetSpec } from "@/skins/skinTypes";

export type SkinDocument = Omit<SkinDefinition, "layers">;

const DOCUMENT_KEYS = new Set([
  "name",
  "extends",
  "meta",
  "tokens",
  "tokensLight",
  "tokensDark",
  "targets",
  "rules",
  "properties",
  "fonts",
  "motion",
  "layersDeclarative",
  "baseVariant",
  "styleUrl",
  "elevation",
]);

/** `paper` and `soft-paper`. Used as the npm package suffix. */
export const SKIN_NAME_PATTERN = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;

const RULE_DECLARATION_KEYS = new Set([
  "style",
  "light",
  "dark",
  "hover",
  "focus-visible",
  "::before",
  "::after",
]);

const DATA_STATE = new Set([
  "open",
  "closed",
  "checked",
  "unchecked",
  "indeterminate",
  "active",
  "inactive",
  "selected",
  "expanded",
  "collapsed",
  "on",
  "off",
  "loading",
  "idle",
  "success",
  "error",
]);

const DATA_STATUS = new Set(["default", "danger", "success", "info", "warning"]);

const MOTION_VAR_KEYS = new Set([
  "x",
  "y",
  "scale",
  "scaleX",
  "scaleY",
  "rotation",
  "opacity",
  "autoAlpha",
  "duration",
  "ease",
  "yoyo",
  "repeat",
  "delay",
  "replay",
  "firstPaint",
  "recipe",
  "params",
]);

const META_KEYS = new Set(["title", "author", "version", "description"]);
const BASE_VARIANTS = new Set(["default", "outline", "secondary"]);
const ELEVATIONS = new Set<SkinElevation>(["kit", "skin", "none"]);
const PHASES = new Set<string>(MOTION_PHASE_NAMES);
const SLOTS = new Set<string>(SKIN_SLOTS);
const TARGET_SLOTS = new Set<string>(SKIN_TARGET_SLOTS);
const MOTION_SLOTS = new Set<string>(SKIN_MOTION_SLOTS);
const LAYER_SLOTS = new Set<string>(SKIN_LAYER_SLOTS);

function slotError(label: string, slot: string, live: Set<string>): string | null {
  const issue = skinSlotIssue(slot, SLOTS, live);
  if (issue === "empty") return `${label} slot is empty`;
  if (issue === "unknown") return `${label} slot ${slot} is not a SkinSlot`;
  if (issue === "dead") return `${label} slot ${slot} is dead`;
  return null;
}
function isRecord(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === "object" && !Array.isArray(value);
}

function readTokenMap(value: unknown, label: string, errors: string[]): Record<string, string> | undefined {
  if (value == null) return undefined;
  if (!isRecord(value)) {
    errors.push(`${label} must be an object of CSS variables`);
    return undefined;
  }
  const map: Record<string, string> = {};
  for (const [key, token] of Object.entries(value)) {
    if (!key.startsWith("--")) errors.push(`${label}.${key} must be a CSS variable`);
    if (typeof token !== "string") errors.push(`${label}.${key} must be a string`);
    else map[key] = token;
    if (isForbiddenSkinToken(key)) errors.push(`forbidden token ${key}`);
  }
  return map;
}

function checkContrast(label: string, map: Record<string, string>, errors: string[]) {
  errors.push(...checkContrastPairs(label, map));
  errors.push(...checkFocusRingContrast(label, map));
}

function readTargetSpec(value: unknown, label: string, errors: string[]): SkinTargetSpec | undefined {
  if (typeof value === "string") return value;
  if (!isRecord(value)) {
    errors.push(`${label} must be a string or { replace } or { extend }`);
    return undefined;
  }
  const replace = value.replace;
  const extend = value.extend;
  const extra = Object.keys(value).filter((key) => key !== "replace" && key !== "extend");
  if (extra.length > 0 || (replace != null && extend != null) || (replace == null && extend == null)) {
    errors.push(`${label} must be a string or { replace } or { extend }`);
    return undefined;
  }
  if (typeof replace === "string") return { replace };
  if (typeof extend === "string") return { extend };
  errors.push(`${label} must be a string or { replace } or { extend }`);
  return undefined;
}

function readSlots(value: unknown, label: string, errors: string[]): Record<string, SkinTargetSpec> | undefined {
  if (value == null) return undefined;
  if (!isRecord(value)) {
    errors.push(`${label} must be an object`);
    return undefined;
  }
  const map: Record<string, SkinTargetSpec> = {};
  for (const [slot, className] of Object.entries(value)) {
    const slotProblem = slotError(label, slot, TARGET_SLOTS);
    if (slotProblem) errors.push(slotProblem);
    const spec = readTargetSpec(className, `${label}.${slot}`, errors);
    if (spec !== undefined && isAcceptedSkinSlot(slot, TARGET_SLOTS)) map[slot] = spec;
  }
  return map;
}

function readNode(value: unknown, label: string, errors: string[]): SkinDeclarativeNode | undefined {
  if (!isRecord(value)) {
    errors.push(`${label} must be an object`);
    return undefined;
  }
  const node: SkinDeclarativeNode = {};
  if (value.className != null) {
    if (typeof value.className !== "string") errors.push(`${label}.className must be a string`);
    else node.className = value.className;
  }
  if (value.style != null) {
    if (!isRecord(value.style)) errors.push(`${label}.style must be an object`);
    else {
      const style: Record<string, string> = {};
      for (const [key, styleValue] of Object.entries(value.style)) {
        if (typeof styleValue !== "string") errors.push(`${label}.style.${key} must be a string`);
        else style[key] = styleValue;
      }
      node.style = style;
    }
  }
  return node;
}

function readLayers(value: unknown, errors: string[]): SkinDocument["layersDeclarative"] {
  if (value == null) return undefined;
  if (!isRecord(value)) {
    errors.push("layersDeclarative must be an object");
    return undefined;
  }
  const layers: NonNullable<SkinDocument["layersDeclarative"]> = {};
  for (const [slot, spec] of Object.entries(value)) {
    const slotProblem = slotError("layersDeclarative", slot, LAYER_SLOTS);
    if (slotProblem) errors.push(slotProblem);
    if (!isRecord(spec)) {
      errors.push(`layersDeclarative.${slot} must be an object`);
      continue;
    }
    const next: SkinDeclarativeLayers = {};
    for (const place of ["before", "after"] as const) {
      const list = spec[place];
      if (list == null) continue;
      if (!Array.isArray(list)) {
        errors.push(`layersDeclarative.${slot}.${place} must be an array`);
        continue;
      }
      next[place] = list.map((node, index) => readNode(node, `layersDeclarative.${slot}.${place}[${index}]`, errors) ?? {});
    }
    for (const place of ["content", "wrapper"] as const) {
      if (spec[place] == null) continue;
      const node = readNode(spec[place], `layersDeclarative.${slot}.${place}`, errors);
      if (node) next[place] = node;
    }
    if (isAcceptedSkinSlot(slot, LAYER_SLOTS)) layers[slot as SkinLayerSlot] = next;
  }
  return layers;
}

function readDeclarations(
  value: unknown,
  label: string,
  errors: string[],
): SkinRuleDeclarations | undefined {
  if (!isRecord(value)) {
    errors.push(`${label} must be an object of CSS declarations`);
    return undefined;
  }
  const style: SkinRuleDeclarations = {};
  for (const [key, item] of Object.entries(value)) {
    if (!/^(?:--)?[a-zA-Z_][\w-]*$/.test(key)) errors.push(`${label} property ${key} is not a CSS property`);
    if (typeof item !== "string" || /[{};]/.test(item)) errors.push(`${label}.${key} has an unsafe value`);
    else style[key] = item;
  }
  return style;
}

function readMotionPhase(
  value: unknown,
  label: string,
  skinName: string,
  errors: string[],
): SkinMotionPhaseValue | undefined {
  if (typeof value === "string") {
    const recipeProblem = skinName ? skinMotionRecipeError(skinName, value) : null;
    if (recipeProblem) errors.push(`${label} ${recipeProblem}`);
    else return value;
    return undefined;
  }
  if (!isRecord(value)) {
    errors.push(`${label} must be a recipe name or motion vars`);
    return undefined;
  }
  for (const key of Object.keys(value)) {
    if (/^(?:width|height|top|left|margin)/.test(key)) {
      errors.push(`${label} layout key ${key} is not a public var`);
    } else if (!MOTION_VAR_KEYS.has(key)) errors.push(`${label} unknown motion key ${key}`);
  }
  if (value.recipe != null) {
    if (typeof value.recipe !== "string") errors.push(`${label}.recipe must be a string`);
    else {
      const recipeProblem = skinName ? skinMotionRecipeError(skinName, value.recipe) : null;
      if (recipeProblem) errors.push(`${label}.recipe ${recipeProblem}`);
    }
  }
  if (value.params != null && !isRecord(value.params)) errors.push(`${label}.params must be an object`);
  return value as SkinMotionPhaseValue;
}

function readRules(value: unknown, errors: string[]): SkinDocument["rules"] {
  if (value == null) return undefined;
  if (!isRecord(value)) {
    errors.push("rules must be an object");
    return undefined;
  }
  const rules: NonNullable<SkinDocument["rules"]> = {};
  for (const [slot, spec] of Object.entries(value)) {
    const slotProblem = slotError("rules", slot, TARGET_SLOTS);
    if (slotProblem) errors.push(slotProblem);
    if (!isRecord(spec)) {
      errors.push(`rules.${slot} must be an object`);
      continue;
    }
    const next: SkinSlotRules = {};
    for (const key of Object.keys(spec)) {
      if (key === "state" || key === "status") continue;
      if (!RULE_DECLARATION_KEYS.has(key)) errors.push(`rules.${slot}.${key} is not a rule branch`);
    }
    for (const key of RULE_DECLARATION_KEYS) {
      if (spec[key] == null) continue;
      const style = readDeclarations(spec[key], `rules.${slot}.${key}`, errors);
      if (style) next[key as "style"] = style;
    }
    for (const [branch, allowed] of [
      ["state", DATA_STATE],
      ["status", DATA_STATUS],
    ] as const) {
      if (spec[branch] == null) continue;
      if (!isRecord(spec[branch])) {
        errors.push(`rules.${slot}.${branch} must be an object`);
        continue;
      }
      const map: Record<string, SkinRuleDeclarations> = {};
      for (const [flag, style] of Object.entries(spec[branch])) {
        if (!allowed.has(flag)) errors.push(`rules.${slot}.${branch}.${flag} is not a kit value`);
        const declarations = readDeclarations(style, `rules.${slot}.${branch}.${flag}`, errors);
        if (declarations && allowed.has(flag)) map[flag] = declarations;
      }
      next[branch] = map;
    }
    if (isAcceptedSkinSlot(slot, TARGET_SLOTS)) rules[slot as SkinTargetSlot] = next;
  }
  return rules;
}

function readProperties(value: unknown, errors: string[]): SkinDocument["properties"] {
  if (value == null) return undefined;
  if (!isRecord(value)) {
    errors.push("properties must be an object");
    return undefined;
  }
  const properties: Record<string, SkinPropertyDefinition> = {};
  for (const [name, spec] of Object.entries(value)) {
    if (!name.startsWith("--")) errors.push(`properties.${name} must be a CSS variable`);
    if (!isRecord(spec)) {
      errors.push(`properties.${name} must be an object`);
      continue;
    }
    if (typeof spec.syntax !== "string" || spec.syntax.trim() === "") {
      errors.push(`properties.${name}.syntax must be a string`);
    }
    if (typeof spec.inherits !== "boolean") errors.push(`properties.${name}.inherits must be a boolean`);
    if (typeof spec.initialValue !== "string") errors.push(`properties.${name}.initialValue must be a string`);
    if (typeof spec.syntax === "string" && typeof spec.inherits === "boolean" && typeof spec.initialValue === "string") {
      properties[name] = { syntax: spec.syntax, inherits: spec.inherits, initialValue: spec.initialValue };
    }
  }
  return properties;
}

function readFonts(value: unknown, errors: string[]): SkinFontFace[] | undefined {
  if (value == null) return undefined;
  if (!Array.isArray(value)) {
    errors.push("fonts must be an array");
    return undefined;
  }
  const fonts: SkinFontFace[] = [];
  value.forEach((item, index) => {
    if (!isRecord(item) || typeof item.family !== "string" || item.family.trim() === "") {
      errors.push(`fonts[${index}].family is required`);
      return;
    }
    const font: SkinFontFace = { family: item.family };
    if (item.src != null) {
      if (typeof item.src !== "string") errors.push(`fonts[${index}].src must be a string`);
      else font.src = item.src;
    }
    if (item.href != null) {
      if (typeof item.href !== "string") errors.push(`fonts[${index}].href must be a string`);
      else font.href = item.href;
    }
    if (font.src == null && font.href == null) errors.push(`fonts[${index}] needs src or href`);
    if (item.weight != null) {
      if (typeof item.weight !== "string") errors.push(`fonts[${index}].weight must be a string`);
      else font.weight = item.weight;
    }
    if (item.style != null) {
      if (typeof item.style !== "string") errors.push(`fonts[${index}].style must be a string`);
      else font.style = item.style;
    }
    fonts.push(font);
  });
  return fonts;
}

function readMotion(value: unknown, errors: string[], skinName: string): SkinDocument["motion"] {
  if (value == null) return undefined;
  if (!isRecord(value)) {
    errors.push("motion must be an object");
    return undefined;
  }
  const motion: NonNullable<SkinDocument["motion"]> = {};
  for (const [slot, phases] of Object.entries(value)) {
    if (slot === "config") {
      if (!isRecord(phases)) {
        errors.push("motion.config must be an object");
        continue;
      }
      const config: Record<string, string | number | boolean | (string | number | boolean)[]> = {};
      for (const [key, item] of Object.entries(phases)) {
        if (typeof item === "string" || typeof item === "number" || typeof item === "boolean") {
          config[key] = item;
          continue;
        }
        if (Array.isArray(item) && item.every((entry) => (
          typeof entry === "string" || typeof entry === "number" || typeof entry === "boolean"
        ))) {
          config[key] = item;
          continue;
        }
        errors.push(`motion.config.${key} must be a string, number, boolean, or an array of those`);
      }
      motion.config = config;
      continue;
    }
    const slotProblem = slotError("motion", slot, MOTION_SLOTS);
    if (slotProblem) errors.push(slotProblem);
    if (!isRecord(phases)) {
      errors.push(`motion.${slot} must be an object`);
      continue;
    }
    const next: Partial<Record<(typeof MOTION_PHASE_NAMES)[number], SkinMotionPhaseValue>> = {};
    for (const [phase, recipe] of Object.entries(phases)) {
      if (!PHASES.has(phase)) errors.push(`motion ${slot}.${phase} is not a kit phase`);
      const value = readMotionPhase(recipe, `motion.${slot}.${phase}`, skinName, errors);
      if (value !== undefined && PHASES.has(phase)) {
        next[phase as (typeof MOTION_PHASE_NAMES)[number]] = value;
      }
    }
    if (isAcceptedSkinSlot(slot, MOTION_SLOTS)) motion[slot as SkinMotionSlot] = next;
  }
  return motion;
}

export type SkinParseResult = { ok: true; skin: SkinDocument } | { ok: false; errors: string[] };

/** Closed document. Unknown keys, forbidden tokens, and bad slots fail. */
export function parseSkinDocument(input: unknown): SkinParseResult {
  const errors: string[] = [];
  if (!isRecord(input)) return { ok: false, errors: ["skin must be an object"] };
  for (const key of Object.keys(input)) {
    if (!DOCUMENT_KEYS.has(key)) errors.push(`unknown field ${key}`);
  }
  if (typeof input.name !== "string" || input.name.trim() === "") errors.push("name is required");
  else if (!SKIN_NAME_PATTERN.test(input.name.trim())) errors.push("name must be kebab-case");

  let parent: string | undefined;
  if (input.extends != null) {
    if (typeof input.extends !== "string" || !SKIN_NAME_PATTERN.test(input.extends)) {
      errors.push("extends must be a kebab-case skin name");
    } else if (typeof input.name === "string" && input.extends === input.name.trim()) {
      errors.push("extends must name a different skin");
    } else parent = input.extends;
  }

  let meta: SkinMeta | undefined;
  if (input.meta != null) {
    if (!isRecord(input.meta)) errors.push("meta must be an object");
    else {
      meta = {};
      for (const [key, value] of Object.entries(input.meta)) {
        if (!META_KEYS.has(key)) errors.push(`unknown meta.${key}`);
        else if (typeof value !== "string") errors.push(`meta.${key} must be a string`);
        else meta[key as keyof SkinMeta] = value;
      }
    }
  }

  const tokens = readTokenMap(input.tokens, "tokens", errors);
  const tokensLight = readTokenMap(input.tokensLight, "tokensLight", errors);
  const tokensDark = readTokenMap(input.tokensDark, "tokensDark", errors);
  if (tokens) checkContrast("tokens", tokens, errors);
  if (tokensLight) checkContrast("tokensLight", { ...tokens, ...tokensLight }, errors);
  if (tokensDark) checkContrast("tokensDark", { ...tokens, ...tokensDark }, errors);

  const targets = readSlots(input.targets, "targets", errors);
  const rules = readRules(input.rules, errors);
  const properties = readProperties(input.properties, errors);
  const fonts = readFonts(input.fonts, errors);
  const motion = readMotion(input.motion, errors, typeof input.name === "string" ? input.name.trim() : "");
  const layersDeclarative = readLayers(input.layersDeclarative, errors);

  let baseVariant: SkinDocument["baseVariant"];
  if (input.baseVariant != null) {
    if (typeof input.baseVariant !== "string" || !BASE_VARIANTS.has(input.baseVariant)) {
      errors.push("baseVariant must be default, outline, or secondary");
    } else baseVariant = input.baseVariant as SkinDocument["baseVariant"];
  }

  let styleUrl: string | undefined;
  if (input.styleUrl != null) {
    if (typeof input.styleUrl !== "string") errors.push("styleUrl must be a string");
    else styleUrl = input.styleUrl;
  }

  let elevation: SkinElevation | undefined;
  if (input.elevation != null) {
    if (typeof input.elevation !== "string" || !ELEVATIONS.has(input.elevation as SkinElevation)) {
      errors.push("elevation must be kit, skin, or none");
    } else elevation = input.elevation as SkinElevation;
  }

  if (errors.length > 0 || typeof input.name !== "string") return { ok: false, errors };

  const skin: SkinDocument = { name: input.name.trim() };
  if (parent) skin.extends = parent;
  if (meta && Object.keys(meta).length > 0) skin.meta = meta;
  if (tokens && Object.keys(tokens).length > 0) skin.tokens = tokens;
  if (tokensLight && Object.keys(tokensLight).length > 0) skin.tokensLight = tokensLight;
  if (tokensDark && Object.keys(tokensDark).length > 0) skin.tokensDark = tokensDark;
  if (targets && Object.keys(targets).length > 0) skin.targets = targets as SkinDocument["targets"];
  if (rules && Object.keys(rules).length > 0) skin.rules = rules;
  if (properties && Object.keys(properties).length > 0) skin.properties = properties;
  if (fonts && fonts.length > 0) skin.fonts = fonts;
  if (motion && Object.keys(motion).length > 0) skin.motion = motion;
  if (layersDeclarative && Object.keys(layersDeclarative).length > 0) skin.layersDeclarative = layersDeclarative;
  if (baseVariant) skin.baseVariant = baseVariant;
  if (styleUrl) skin.styleUrl = styleUrl;
  if (elevation) skin.elevation = elevation;
  return { ok: true, skin };
}

export function skinToJson(skin: SkinDocument): string {
  return `${JSON.stringify(skin, null, 2)}\n`;
}

/** CamelCase export. `soft-paper` → `softPaper`. */
export function skinExportName(name: string): string {
  const camel = name
    .trim()
    .replace(/[^a-zA-Z0-9]+([a-zA-Z0-9])/g, (_, ch: string) => ch.toUpperCase())
    .replace(/[^a-zA-Z0-9]/g, "");
  const safe = /^[0-9]/.test(camel) ? `skin${camel}` : camel;
  return safe || "skin";
}

/** Peer written into a copied skin package. Matches the published kit major. */
export const SKIN_PACKAGE_PEER = "^2.0.0";

/** Class written for `rules[slot]`. Stable across export. */
export function skinRuleClass(name: string, slot: string): string {
  return `skin-${name}-${slot.replaceAll(".", "-")}`;
}

function appendClass(current: string, extra: string): string {
  return current.split(/\s+/).includes(extra) ? current : `${current} ${extra}`.trim();
}

/** Copy the generated rule class onto `targets` so the CSS matches a node. */
export function bindSkinRuleClasses(skin: SkinDocument): SkinDocument {
  if (!skin.rules || Object.keys(skin.rules).length === 0) return skin;
  const targets: NonNullable<SkinDocument["targets"]> = { ...skin.targets };
  for (const slot of Object.keys(skin.rules) as SkinTargetSlot[]) {
    const extra = skinRuleClass(skin.name, slot);
    const current = targets[slot];
    if (current == null) targets[slot] = { extend: extra };
    else if (typeof current === "string") targets[slot] = appendClass(current, extra);
    else if ("extend" in current) targets[slot] = { extend: appendClass(current.extend, extra) };
    else targets[slot] = { replace: appendClass(current.replace, extra) };
  }
  return { ...skin, targets };
}

export type SkinPackageFileName =
  | "package.json"
  | "README.md"
  | "LICENSE"
  | "tsconfig.json"
  | "tsconfig.build.json"
  | "src/index.ts"
  | "src/skin.json"
  | "src/skin.css";

export type SkinPackageFiles = Record<SkinPackageFileName, string>;

const SKIN_PACKAGE_LICENSE = `MIT License

Copyright (c) 2026 __AUTHOR__

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
`;

const SKIN_PACKAGE_TSCONFIG = `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "resolveJsonModule": true,
    "strict": true,
    "skipLibCheck": true,
    "noEmit": true,
    "isolatedModules": true,
    "verbatimModuleSyntax": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  },
  "include": ["src"]
}
`;

const SKIN_PACKAGE_TSCONFIG_BUILD = `{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "noEmit": false,
    "outDir": "dist",
    "declaration": true,
    "declarationMap": false
  },
  "include": ["src/index.ts", "src/skin.json"]
}
`;

const SKIN_PACKAGE_README = `# burne-ui-skin-__SKIN_NAME__

Ярус 1. Токены — \`src/skin.json\`. CSS — \`src/skin.css\`. Импорт пакета вызывает \`defineSkin\`.

\`\`\`css
@import "burne-ui/styles.css";
@import "burne-ui-skin-__SKIN_NAME__/styles.css";
\`\`\`

Классы из CSS пакета приезжают с \`styles.css\`. Утилиты Tailwind в \`targets\` — через \`@source "../node_modules/burne-ui-skin-__SKIN_NAME__";\`.

\`\`\`tsx
import { __SKIN_IDENT__ } from "burne-ui-skin-__SKIN_NAME__";

<BurneUIProvider skin="__SKIN_NAME__" skins={[__SKIN_IDENT__]}>
  …
</BurneUIProvider>
\`\`\`

Проверка: \`npx burne-ui skin validate\`. Сборка токенов: \`npx burne-ui skin build\`.

Слои (\`src/layers.tsx\`) прокидывают \`ref\` на DOM-узел (\`{...props}\` или \`ref={ref}\`). \`--shadow-*\` — любое число слоёв. Ширина и отступ кольца не задаются. Блок \`forced-colors\` допустим, если он не красит кольцо фокуса. Цвет \`--color-focus-ring*\` допустим при контрасте ≥3:1; без него кольцо берётся из \`foreground\`. \`--color-foreground\` на \`--color-surface\` — контраст WCAG AA (4.5:1). Свои переменные — с префиксом \`--__SKIN_NAME__-\`.
`;

function skinPackageLicense(author: string | undefined): string {
  const name = author?.trim() || "<author>";
  return SKIN_PACKAGE_LICENSE.replaceAll("__AUTHOR__", name);
}

/** Files for «copy as package». Same shape as `cli/templates/skin`. */
export function renderSkinPackage(skin: SkinDocument): SkinPackageFiles {
  const bound = bindSkinRuleClasses(skin);
  const ident = skinExportName(bound.name);
  const pkg = {
    name: `burne-ui-skin-${bound.name}`,
    version: "0.1.0",
    description: `${bound.name} skin for Burne UI`,
    license: "MIT",
    type: "module",
    sideEffects: ["**/*.css", "./dist/index.js"],
    files: ["dist", "src/skin.css", "README.md"],
    types: "./dist/index.d.ts",
    module: "./dist/index.js",
    exports: {
      ".": {
        types: "./dist/index.d.ts",
        import: "./dist/index.js",
        default: "./dist/index.js",
      },
      "./styles.css": "./dist/styles.css",
      "./skin.json": "./dist/skin.json",
      "./package.json": "./package.json",
    },
    scripts: {
      build: "tsc -p tsconfig.build.json && cp src/skin.css dist/styles.css && cp src/skin.json dist/skin.json && rm -f dist/*.map",
      lint: "tsc -p tsconfig.json --noEmit",
    },
    peerDependencies: { "burne-ui": SKIN_PACKAGE_PEER },
    devDependencies: { typescript: "^5.8.3" },
  };
  const index = `import { defineSkin, type SkinDefinition } from "burne-ui/skin";
import skinJson from "./skin.json" with { type: "json" };

export const ${ident} = defineSkin(skinJson as SkinDefinition);
`;
  const readme = SKIN_PACKAGE_README
    .replaceAll("__SKIN_NAME__", bound.name)
    .replaceAll("__SKIN_IDENT__", ident);
  return {
    "package.json": `${JSON.stringify(pkg, null, 2)}\n`,
    "README.md": readme,
    LICENSE: skinPackageLicense(bound.meta?.author),
    "tsconfig.json": SKIN_PACKAGE_TSCONFIG,
    "tsconfig.build.json": SKIN_PACKAGE_TSCONFIG_BUILD,
    "src/index.ts": index,
    "src/skin.json": skinToJson(bound),
    "src/skin.css": `${renderSkinStylesheet(bound).trimEnd()}\n`,
  };
}

/** One text block for the editor copy button. */
export function formatSkinPackage(files: SkinPackageFiles): string {
  return (Object.entries(files) as [SkinPackageFileName, string][])
    .map(([name, body]) => `<!-- ${name} -->\n${body.trimEnd()}`)
    .join("\n\n");
}

function slotMapSchema(slots: readonly string[], item: object) {
  return {
    type: "object" as const,
    additionalProperties: false,
    properties: Object.fromEntries(slots.map((slot) => [slot, item])),
  };
}

/** JSON Schema of the skin file. The parser is the checker; this is the kit contract. `registerSkinSlots` adds names the parser and CLI accept beyond this list. */
export const SKIN_DOCUMENT_SCHEMA = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "SkinDocument",
  type: "object",
  additionalProperties: false,
  required: ["name"],
  properties: {
    name: { type: "string", pattern: SKIN_NAME_PATTERN.source },
    extends: { type: "string", pattern: SKIN_NAME_PATTERN.source },
    meta: {
      type: "object",
      additionalProperties: false,
      properties: {
        title: { type: "string" },
        author: { type: "string" },
        version: { type: "string" },
        description: { type: "string" },
      },
    },
    tokens: { type: "object", additionalProperties: { type: "string" } },
    tokensLight: { type: "object", additionalProperties: { type: "string" } },
    tokensDark: { type: "object", additionalProperties: { type: "string" } },
    targets: slotMapSchema(SKIN_TARGET_SLOTS, {
      oneOf: [
        { type: "string" },
        {
          type: "object",
          additionalProperties: false,
          properties: { replace: { type: "string" }, extend: { type: "string" } },
        },
      ],
    }),
    rules: slotMapSchema(SKIN_TARGET_SLOTS, { type: "object" }),
    properties: { type: "object", additionalProperties: { type: "object" } },
    fonts: { type: "array", items: { type: "object" } },
    motion: {
      ...slotMapSchema(SKIN_MOTION_SLOTS, { type: "object" }),
      properties: {
        ...slotMapSchema(SKIN_MOTION_SLOTS, { type: "object" }).properties,
        config: { type: "object" },
      },
    },
    layersDeclarative: slotMapSchema(SKIN_LAYER_SLOTS, { type: "object" }),
    baseVariant: { enum: ["default", "outline", "secondary"] },
    elevation: { enum: ["kit", "skin", "none"] },
    styleUrl: { type: "string" },
  },
} as const;

export const SKIN_EDITOR_EXAMPLE: SkinDocument = {
  name: "paper",
  meta: { title: "Paper", description: "Hard offset and a flat surface." },
  baseVariant: "outline",
  tokens: {
    "--radius": "0px",
    "--border-width": "3px",
    "--color-surface": "#fffdf5",
    "--color-foreground": "#111111",
    "--color-primary": "#ffe14a",
    "--color-primary-foreground": "#111111",
    "--shadow-base": "4px 4px 0 0 #111111, 4px 4px 0 0 #111111",
    "--shadow-base-hover": "5px 5px 0 0 #111111, 5px 5px 0 0 #111111",
    "--shadow-base-press": "2px 2px 0 0 #111111, 2px 2px 0 0 #111111",
  },
  targets: {
    "button.root": "uppercase",
    "card.root": "bg-surface",
  },
  layersDeclarative: {
    "card.root": {
      before: [{ className: "pointer-events-none absolute inset-0 border-2 border-foreground" }],
    },
  },
  styleUrl: "burne-ui-skin-paper/styles.css",
};
