/**
 * Serializable skin file for the editor and `skin validate`.
 * `layers` (render functions) are not part of the document.
 */
import { MOTION_PHASE_NAMES } from "@/components/core/utils/slotMotion/slotMotionTypes";
import { isForbiddenSkinToken, SKIN_SLOTS, type SkinDeclarativeLayers, type SkinDeclarativeNode, type SkinDefinition, type SkinMeta, type SkinSlot } from "@/skins/skinTypes";

export type SkinDocument = Omit<SkinDefinition, "layers">;

const DOCUMENT_KEYS = new Set([
  "name",
  "meta",
  "tokens",
  "tokensLight",
  "tokensDark",
  "targets",
  "motion",
  "layersDeclarative",
  "baseVariant",
  "styleUrl",
]);

const META_KEYS = new Set(["title", "author", "version", "description"]);
const BASE_VARIANTS = new Set(["default", "outline", "secondary"]);
const PHASES = new Set<string>(MOTION_PHASE_NAMES);
const SLOTS = new Set<string>(SKIN_SLOTS);
const AA_CONTRAST = 4.5;

const SHADOW_TOKEN = /^--shadow-(?:small|base|mid|large|xlarge|lift)(?:-hover|-press)?$/;

/** Kit shadows are two layers. A comma inside color-mix() is not a layer. */
export function shadowLayerCount(value: string): number {
  const text = value.trim();
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

export function parseCssColor(value: string): [number, number, number] | null {
  const text = value.trim();
  const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(text);
  if (hex) {
    let body = hex[1] ?? "";
    if (body.length === 3) body = body.split("").map((ch) => ch + ch).join("");
    return [
      Number.parseInt(body.slice(0, 2), 16),
      Number.parseInt(body.slice(2, 4), 16),
      Number.parseInt(body.slice(4, 6), 16),
    ];
  }
  const rgb = /^rgba?\(\s*(\d{1,3})\s*[, ]\s*(\d{1,3})\s*[, ]\s*(\d{1,3})(?:\s*[,/]\s*([0-9.]+%?))?\s*\)$/i.exec(text);
  if (!rgb) return null;
  const channels = [Number(rgb[1]), Number(rgb[2]), Number(rgb[3])];
  if (channels.some((channel) => channel > 255)) return null;
  const alpha = rgb[4];
  if (alpha != null && alpha !== "1" && alpha !== "100%") return null;
  return channels as [number, number, number];
}

function channelLinear(channel: number): number {
  const value = channel / 255;
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

function contrastRatio(foreground: [number, number, number], background: [number, number, number]): number {
  const luminance = (color: [number, number, number]) =>
    0.2126 * channelLinear(color[0]) + 0.7152 * channelLinear(color[1]) + 0.0722 * channelLinear(color[2]);
  const lighter = Math.max(luminance(foreground), luminance(background));
  const darker = Math.min(luminance(foreground), luminance(background));
  return (lighter + 0.05) / (darker + 0.05);
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
    if (typeof token === "string" && SHADOW_TOKEN.test(key) && shadowLayerCount(token) !== 2) {
      errors.push(`${key} has ${shadowLayerCount(token)} shadow layer(s); the kit uses 2`);
    }
  }
  return map;
}

function checkContrast(label: string, map: Record<string, string>, errors: string[]) {
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
    errors.push(`${label}: --color-foreground and --color-surface must be hex or rgb`);
    return;
  }
  const ratio = contrastRatio(foregroundColor, surfaceColor);
  if (ratio < AA_CONTRAST) {
    errors.push(`${label}: contrast ${ratio.toFixed(2)} is below WCAG AA ${AA_CONTRAST}`);
  }
}

function readSlots(value: unknown, label: string, errors: string[]): Record<string, string> | undefined {
  if (value == null) return undefined;
  if (!isRecord(value)) {
    errors.push(`${label} must be an object`);
    return undefined;
  }
  const map: Record<string, string> = {};
  for (const [slot, className] of Object.entries(value)) {
    if (!SLOTS.has(slot)) errors.push(`${label} slot ${slot} is not a SkinSlot`);
    if (typeof className !== "string") errors.push(`${label}.${slot} must be a string`);
    else map[slot] = className;
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
    if (!SLOTS.has(slot)) errors.push(`layersDeclarative slot ${slot} is not a SkinSlot`);
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
    if (SLOTS.has(slot)) layers[slot as SkinSlot] = next;
  }
  return layers;
}

function readMotion(value: unknown, errors: string[]): SkinDocument["motion"] {
  if (value == null) return undefined;
  if (!isRecord(value)) {
    errors.push("motion must be an object");
    return undefined;
  }
  const motion: NonNullable<SkinDocument["motion"]> = {};
  for (const [slot, phases] of Object.entries(value)) {
    if (!SLOTS.has(slot)) errors.push(`motion slot ${slot} is not a SkinSlot`);
    if (!isRecord(phases)) {
      errors.push(`motion.${slot} must be an object`);
      continue;
    }
    const next: Partial<Record<(typeof MOTION_PHASE_NAMES)[number], string>> = {};
    for (const [phase, recipe] of Object.entries(phases)) {
      if (!PHASES.has(phase)) errors.push(`motion ${slot}.${phase} is not a kit phase`);
      if (typeof recipe !== "string") errors.push(`motion.${slot}.${phase} must be a string`);
      else if (PHASES.has(phase)) next[phase as (typeof MOTION_PHASE_NAMES)[number]] = recipe;
    }
    if (SLOTS.has(slot)) motion[slot as SkinSlot] = next;
  }
  return motion;
}

export type SkinParseResult = { ok: true; skin: SkinDocument } | { ok: false; errors: string[] };

/** Closed document. Unknown keys, forbidden tokens, bad slots, and thin shadows fail. */
export function parseSkinDocument(input: unknown): SkinParseResult {
  const errors: string[] = [];
  if (!isRecord(input)) return { ok: false, errors: ["skin must be an object"] };
  for (const key of Object.keys(input)) {
    if (!DOCUMENT_KEYS.has(key)) errors.push(`unknown field ${key}`);
  }
  if (typeof input.name !== "string" || input.name.trim() === "") errors.push("name is required");

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
  const motion = readMotion(input.motion, errors);
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

  if (errors.length > 0 || typeof input.name !== "string") return { ok: false, errors };

  const skin: SkinDocument = { name: input.name.trim() };
  if (meta && Object.keys(meta).length > 0) skin.meta = meta;
  if (tokens && Object.keys(tokens).length > 0) skin.tokens = tokens;
  if (tokensLight && Object.keys(tokensLight).length > 0) skin.tokensLight = tokensLight;
  if (tokensDark && Object.keys(tokensDark).length > 0) skin.tokensDark = tokensDark;
  if (targets && Object.keys(targets).length > 0) skin.targets = targets as SkinDocument["targets"];
  if (motion && Object.keys(motion).length > 0) skin.motion = motion;
  if (layersDeclarative && Object.keys(layersDeclarative).length > 0) skin.layersDeclarative = layersDeclarative;
  if (baseVariant) skin.baseVariant = baseVariant;
  if (styleUrl) skin.styleUrl = styleUrl;
  return { ok: true, skin };
}

export function skinToJson(skin: SkinDocument): string {
  return `${JSON.stringify(skin, null, 2)}\n`;
}

function cssBlock(selector: string, tokens: Record<string, string> | undefined): string {
  if (!tokens || Object.keys(tokens).length === 0) return "";
  const body = Object.entries(tokens).map(([key, value]) => `  ${key}: ${value};`).join("\n");
  return `${selector} {\n${body}\n}\n`;
}

/** Stylesheet the app imports. Reset writes `initial` for every declared key. */
export function renderSkinStylesheet(skin: SkinDocument): string {
  const name = skin.name.replace(/"/g, "");
  const reset = Object.fromEntries(
    [skin.tokens, skin.tokensLight, skin.tokensDark].flatMap((map) => Object.keys(map ?? {}).map((key) => [key, "initial"])),
  );
  return [
    `/* ${name} */`,
    cssBlock(`[data-skin="${name}"]`, skin.tokens).trimEnd(),
    cssBlock(`[data-skin="${name}"][data-theme="light"]`, skin.tokensLight).trimEnd(),
    cssBlock(`[data-skin="${name}"][data-theme="dark"]`, skin.tokensDark).trimEnd(),
    cssBlock(`[data-skin="none"]`, reset).trimEnd(),
    "",
  ]
    .filter((part) => part !== "")
    .join("\n\n");
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

/** Files for «copy as package». Peer stays `^1.8.8` until the kit release. */
export function renderSkinPackage(skin: SkinDocument): string {
  const ident = skinExportName(skin.name);
  const pkg = {
    name: `burne-ui-skin-${skin.name}`,
    version: "0.1.0",
    type: "module",
    sideEffects: ["**/*.css"],
    exports: {
      ".": { types: "./dist/index.d.ts", import: "./dist/index.js" },
      "./styles.css": "./src/skin.css",
    },
    peerDependencies: { "burne-ui": "^1.8.8" },
  };
  const index = `import { registerSkin, type SkinDefinition } from "burne-ui";
import skinJson from "./skin.json" with { type: "json" };

export const ${ident} = skinJson as SkinDefinition;

registerSkin(${ident});
`;
  return [
    "<!-- package.json -->",
    JSON.stringify(pkg, null, 2),
    "",
    "<!-- src/skin.json -->",
    skinToJson(skin).trimEnd(),
    "",
    "<!-- src/skin.css -->",
    renderSkinStylesheet(skin).trimEnd(),
    "",
    "<!-- src/index.ts -->",
    index.trimEnd(),
    "",
  ].join("\n");
}

/** JSON Schema of the skin file. The parser is the checker; this is the contract. */
export const SKIN_DOCUMENT_SCHEMA = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "SkinDocument",
  type: "object",
  additionalProperties: false,
  required: ["name"],
  properties: {
    name: { type: "string", minLength: 1 },
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
    targets: { type: "object", additionalProperties: { type: "string" } },
    motion: { type: "object", additionalProperties: { type: "object", additionalProperties: { type: "string" } } },
    layersDeclarative: { type: "object" },
    baseVariant: { enum: ["default", "outline", "secondary"] },
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
