import {
  AA_CONTRAST,
  contrastRatio,
  parseCssColor,
  SKIN_CONTRAST_PAIRS,
} from "../../cli/skin-color.mjs";
import { renderSkinStylesheet } from "../../cli/skin-stylesheet.mjs";
import { bindSkinRuleClasses, parseSkinDocument, SKIN_NAME_PATTERN } from "@/skins/skinDocument";
import type { SkinDocument } from "@/skins/skinDocument";
import type { MotionConfig } from "@/components/core/utils/motionConfig";
import {
  COLOR_CSS_VAR,
  createDefaultThemeState,
  exportThemeCss,
  motionConfigFromThemeState,
  type ThemeColorKey,
  type ThemeColors,
  type ThemeTokenState,
} from "@/theme/themeDefaults";

import { THEME_TOKEN_SCHEMA, type ThemeTokenSchemaEntry } from "./themeTokenSchema";

export { contrastRatio, parseCssColor };

export const DESIGN_DOCUMENT_VERSION = 1 as const;

export type DesignTheme = Omit<ThemeTokenState, "theme" | "colors" | "modePalettes"> & {
  colors: { dark: ThemeColors; light: ThemeColors };
};

export type DesignMeta = {
  title?: string;
  author?: string;
  description?: string;
};

/** One studio file: theme snapshot plus an optional skin document. */
export type DesignDocument = {
  version: typeof DESIGN_DOCUMENT_VERSION;
  name: string;
  meta?: DesignMeta;
  theme: DesignTheme;
  skin?: SkinDocument;
};

export type DesignParseResult =
  | { ok: true; design: DesignDocument; warnings: string[] }
  | { ok: false; errors: string[]; warnings: string[] };

export type DesignValidation = {
  ok: boolean;
  errors: string[];
  warnings: string[];
};

const META_KEYS = new Set(["title", "author", "description"]);
const DOCUMENT_KEYS = new Set(["version", "name", "meta", "theme", "skin"]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === "object" && !Array.isArray(value);
}

function designThemeFromState(state: ThemeTokenState): DesignTheme {
  const { theme: _theme, colors: _colors, modePalettes, ...rest } = state;
  return {
    ...rest,
    colors: {
      dark: { ...modePalettes.dark },
      light: { ...modePalettes.light },
    },
  };
}

export function designThemeToState(theme: DesignTheme, mode: "dark" | "light" = "dark"): ThemeTokenState {
  return {
    ...theme,
    theme: mode,
    colors: { ...theme.colors[mode] },
    modePalettes: {
      dark: { ...theme.colors.dark },
      light: { ...theme.colors.light },
    },
  };
}

function readPalette(
  value: unknown,
  label: string,
  defaults: ThemeColors,
  errors: string[],
  warnings: string[],
): ThemeColors {
  const palette: ThemeColors = { ...defaults };
  if (value == null) {
    warnings.push(`${label} filled from the kit`);
    return palette;
  }
  if (!isRecord(value)) {
    errors.push(`${label} must be an object`);
    return palette;
  }
  for (const key of Object.keys(value)) {
    if (!(key in COLOR_CSS_VAR)) errors.push(`${label}.${key} is not a theme color`);
  }
  for (const key of Object.keys(COLOR_CSS_VAR) as ThemeColorKey[]) {
    const item = value[key];
    if (item == null) {
      warnings.push(`${label}.${key} filled from the kit`);
      continue;
    }
    if (typeof item !== "string") errors.push(`${label}.${key} must be a string`);
    else palette[key] = item;
  }
  return palette;
}

function readTheme(value: unknown, errors: string[], warnings: string[]): DesignTheme {
  const darkDefaults = createDefaultThemeState("dark");
  const lightDefaults = createDefaultThemeState("light");
  const base = designThemeFromState(darkDefaults);
  if (!isRecord(value)) {
    errors.push("theme must be an object");
    return base;
  }
  const theme: DesignTheme = { ...base, colors: { ...base.colors } };
  for (const entry of THEME_TOKEN_SCHEMA) {
    if (entry.type === "color" || entry.group === "color") continue;
    if (value[entry.key] == null) {
      warnings.push(`theme.${entry.key} filled from the kit`);
      continue;
    }
    const item = value[entry.key];
    if (entry.type === "flag") {
      if (typeof item !== "boolean") errors.push(`theme.${entry.key} must be a boolean`);
      else (theme as Record<string, unknown>)[entry.key] = item;
      continue;
    }
    if (entry.type === "font" || entry.type === "ease") {
      if (typeof item !== "string") errors.push(`theme.${entry.key} must be a string`);
      else (theme as Record<string, unknown>)[entry.key] = item;
      continue;
    }
    if (typeof item !== "number" || !Number.isFinite(item)) {
      errors.push(`theme.${entry.key} must be a finite number`);
      continue;
    }
    (theme as Record<string, unknown>)[entry.key] = item;
  }
  if (isRecord(value.fontWeights)) {
    theme.fontWeights = { ...base.fontWeights };
    for (const [key, weight] of Object.entries(value.fontWeights)) {
      if (!(key in base.fontWeights)) errors.push(`theme.fontWeights.${key} is not a scale step`);
      else if (typeof weight !== "number" || !Number.isFinite(weight)) {
        errors.push(`theme.fontWeights.${key} must be a finite number`);
      } else theme.fontWeights[key as keyof DesignTheme["fontWeights"]] = weight;
    }
  }
  const colors = isRecord(value.colors) ? value.colors : {};
  theme.colors = {
    dark: readPalette(colors.dark, "theme.colors.dark", darkDefaults.colors, errors, warnings),
    light: readPalette(colors.light, "theme.colors.light", lightDefaults.colors, errors, warnings),
  };
  return theme;
}

/** Closed document. `version` is 1; a future file migrates before this check. */
export function parseDesignDocument(input: unknown): DesignParseResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  if (!isRecord(input)) return { ok: false, errors: ["design must be an object"], warnings };
  for (const key of Object.keys(input)) {
    if (!DOCUMENT_KEYS.has(key)) errors.push(`unknown field ${key}`);
  }
  if (input.version !== DESIGN_DOCUMENT_VERSION) {
    errors.push(`version ${String(input.version)} is not supported`);
  }
  if (typeof input.name !== "string" || !SKIN_NAME_PATTERN.test(input.name)) {
    errors.push("name must be kebab-case");
  }
  let meta: DesignMeta | undefined;
  if (input.meta != null) {
    if (!isRecord(input.meta)) errors.push("meta must be an object");
    else {
      meta = {};
      for (const [key, value] of Object.entries(input.meta)) {
        if (!META_KEYS.has(key)) errors.push(`unknown meta.${key}`);
        else if (typeof value !== "string") errors.push(`meta.${key} must be a string`);
        else meta[key as keyof DesignMeta] = value;
      }
    }
  }
  const theme = readTheme(input.theme, errors, warnings);
  let skin: SkinDocument | undefined;
  if (input.skin != null) {
    const parsed = parseSkinDocument(input.skin);
    if (!parsed.ok) errors.push(...parsed.errors.map((error) => `skin: ${error}`));
    else skin = parsed.skin;
  }
  if (errors.length > 0 || typeof input.name !== "string") return { ok: false, errors, warnings };
  const design: DesignDocument = { version: DESIGN_DOCUMENT_VERSION, name: input.name, theme };
  if (meta && Object.keys(meta).length > 0) design.meta = meta;
  if (skin) design.skin = skin;
  return { ok: true, design, warnings };
}

function outOfRange(entry: ThemeTokenSchemaEntry, value: number): string | null {
  if (entry.min != null && value < entry.min) return `theme.${entry.key} is below ${entry.min}`;
  if (entry.max != null && value > entry.max) return `theme.${entry.key} is above ${entry.max}`;
  return null;
}

function checkPaletteContrast(label: string, colors: ThemeColors, errors: string[], warnings: string[]) {
  const tokens: Record<string, string> = {};
  for (const [key, cssVar] of Object.entries(COLOR_CSS_VAR) as [ThemeColorKey, string][]) {
    tokens[cssVar] = colors[key];
  }
  for (const [foreground, background] of SKIN_CONTRAST_PAIRS) {
    const fg = parseCssColor(tokens[foreground]);
    const bg = parseCssColor(tokens[background]);
    if (!fg || !bg) {
      warnings.push(`${label} ${foreground} / ${background} is not a measurable color`);
      continue;
    }
    const ratio = contrastRatio(fg, bg);
    if (ratio < AA_CONTRAST) {
      errors.push(`${label} ${foreground} on ${background} is ${ratio.toFixed(2)}:1, below WCAG AA ${AA_CONTRAST}:1`);
    }
  }
}

/** One checker for the studio and for export. Errors block export; warnings do not. */
export function validateDesign(doc: DesignDocument): DesignValidation {
  const errors: string[] = [];
  const warnings: string[] = [];
  if (doc.version !== DESIGN_DOCUMENT_VERSION) errors.push(`version ${doc.version} is not supported`);
  if (!SKIN_NAME_PATTERN.test(doc.name)) errors.push("name must be kebab-case");
  if (doc.theme.focusRingWidth === 0) errors.push("theme.focusRingWidth must stay visible");
  for (const entry of THEME_TOKEN_SCHEMA) {
    if (entry.min == null && entry.max == null) continue;
    const value = (doc.theme as Record<string, unknown>)[entry.key];
    if (typeof value !== "number") continue;
    const problem = outOfRange(entry, value);
    if (problem) errors.push(problem);
  }
  checkPaletteContrast("dark", doc.theme.colors.dark, errors, warnings);
  checkPaletteContrast("light", doc.theme.colors.light, errors, warnings);
  if (doc.skin) {
    const parsed = parseSkinDocument(doc.skin);
    if (!parsed.ok) errors.push(...parsed.errors.map((error) => `skin: ${error}`));
  }
  return { ok: errors.length === 0, errors, warnings };
}

function paletteDiff(colors: ThemeColors, defaults: ThemeColors): Record<string, string> {
  const tokens: Record<string, string> = {};
  for (const key of Object.keys(COLOR_CSS_VAR) as ThemeColorKey[]) {
    if (colors[key] !== defaults[key]) tokens[COLOR_CSS_VAR[key]] = colors[key];
  }
  return tokens;
}

function sameMotionValue(left: unknown, right: unknown): boolean {
  if (Array.isArray(left) && Array.isArray(right)) {
    return left.length === right.length && left.every((item, index) => item === right[index]);
  }
  return Object.is(left, right);
}

function motionDiff(state: ThemeTokenState): Partial<MotionConfig> {
  const current = motionConfigFromThemeState(state);
  const defaults = motionConfigFromThemeState(createDefaultThemeState("dark"));
  const diff: Partial<MotionConfig> = {};
  for (const key of Object.keys(current) as (keyof MotionConfig)[]) {
    if (!sameMotionValue(current[key], defaults[key])) {
      (diff as Record<string, unknown>)[key] = current[key];
    }
  }
  return diff;
}

function designSkinName(name: string): string {
  const slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return slug || "design";
}

/**
 * Design snapshot → skin document. Only colors and motion that differ from the kit
 * are written, so a later kit palette is not frozen into the skin.
 * An existing skin `tokens` / `motion.config` overlays that diff.
 */
export function designToSkin(design: DesignDocument): SkinDocument {
  const state = designThemeToState(design.theme);
  const skin = design.skin;
  const darkDefaults = createDefaultThemeState("dark").colors;
  const lightDefaults = createDefaultThemeState("light").colors;
  const tokens = { ...paletteDiff(design.theme.colors.dark, darkDefaults), ...skin?.tokens };
  const tokensLight = { ...paletteDiff(design.theme.colors.light, lightDefaults), ...skin?.tokensLight };
  const config = { ...motionDiff(state), ...skin?.motion?.config };
  const motion = skin?.motion != null || Object.keys(config).length > 0
    ? { ...skin?.motion, ...(Object.keys(config).length > 0 ? { config } : {}) }
    : undefined;
  return {
    ...skin,
    name: skin?.name ?? designSkinName(design.name),
    ...(Object.keys(tokens).length > 0 ? { tokens } : {}),
    ...(Object.keys(tokensLight).length > 0 ? { tokensLight } : {}),
    ...(motion ? { motion } : {}),
  };
}

/** Theme CSS for both modes, then the skin sheet with rule classes bound onto targets. */
export function renderDesignCss(doc: DesignDocument): string {
  const themeCss = exportThemeCss(designThemeToState(doc.theme));
  if (!doc.skin) return themeCss;
  return `${themeCss}\n\n${renderSkinStylesheet(bindSkinRuleClasses(doc.skin))}`;
}

export const DESIGN_DOCUMENT_SCHEMA = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "DesignDocument",
  type: "object",
  additionalProperties: false,
  required: ["version", "name", "theme"],
  properties: {
    version: { const: DESIGN_DOCUMENT_VERSION },
    name: { type: "string", pattern: SKIN_NAME_PATTERN.source },
    meta: { type: "object" },
    theme: { type: "object" },
    skin: { type: "object" },
  },
} as const;
