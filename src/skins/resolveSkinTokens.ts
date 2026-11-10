import { isFocusRingColorToken, isForbiddenSkinToken, type SkinDefinition } from "./skinTypes";

export type SkinTokenMap = Record<string, string>;

export function isPaletteSkinToken(name: string): boolean {
  return name.startsWith("--color-") && !isFocusRingColorToken(name) && !isForbiddenSkinToken(name);
}

const FOCUS_RING_COLOR_TOKENS = [
  "--color-focus-ring",
  "--color-focus-ring-danger",
  "--color-focus-ring-success",
  "--color-focus-ring-info",
  "--color-focus-ring-warning",
] as const;

/** Solid foreground. A 60% primary mix fails 3:1 on pale skins. */
function focusRingFallback(): SkinTokenMap {
  const tokens: SkinTokenMap = {};
  for (const key of FOCUS_RING_COLOR_TOKENS) tokens[key] = "var(--color-foreground)";
  return tokens;
}

function warnForbidden(skinName: string, token: string) {
  if (process.env.NODE_ENV !== "production") {
    console.error(`[burne-ui] skin "${skinName}" cannot set ${token}`);
  }
}

/**
 * Palette plus a focus ring. Width and offset are dropped.
 * A ring the skin does not set is `var(--color-foreground)`.
 */
export function resolveSkinTokens(
  skin: SkinDefinition,
  mode: "light" | "dark" = "dark"): SkinTokenMap {
  const source = {
    ...skin.tokens,
    ...(mode === "light" ? skin.tokensLight : skin.tokensDark),
  };
  const tokens: SkinTokenMap = focusRingFallback();
  for (const [key, value] of Object.entries(source)) {
    if (isForbiddenSkinToken(key)) {
      warnForbidden(skin.name, key);
      continue;
    }
    tokens[key] = value;
  }
  return tokens;
}

/**
 * `variant="default"` keeps geometry tokens (they stay inherited) and paints
 * palette tokens back to the captured kit baseline. Other variants do not
 * touch tier-1 tokens.
 */
export function skinSurfaceStyle(
  tokens: SkinTokenMap,
  baseline: SkinTokenMap,
  variant?: string): SkinTokenMap {
  if (variant !== "default") return {};
  const style: SkinTokenMap = {};
  for (const key of Object.keys(tokens)) {
    if (!isPaletteSkinToken(key)) continue;
    const value = baseline[key];
    if (value) style[key] = value;
  }
  return style;
}

const managed = new WeakMap<HTMLElement, Map<string, string | null>>();

function previousInline(el: HTMLElement, key: string): string | null {
  const value = el.style.getPropertyValue(key).trim();
  return value ? value : null;
}

/** Write tokens without dropping inline values this call did not own. */
export function applySkinVars(el: HTMLElement, tokens: SkinTokenMap, skinName: string | null): void {
  const prev = managed.get(el) ?? new Map<string, string | null>();
  const nextKeys = new Set(Object.keys(tokens));
  for (const [key, previous] of prev) {
    if (nextKeys.has(key)) continue;
    if (previous === null) el.style.removeProperty(key);
    else el.style.setProperty(key, previous);
    prev.delete(key);
  }
  for (const [key, value] of Object.entries(tokens)) {
    if (!prev.has(key)) prev.set(key, previousInline(el, key));
    el.style.setProperty(key, value);
  }
  managed.set(el, prev);
  if (skinName) el.dataset.skin = skinName;
  else el.dataset.skin = "none";
}

export function releaseSkinVars(el: HTMLElement): void {
  const prev = managed.get(el);
  if (!prev) return;
  for (const [key, previous] of prev) {
    if (previous === null) el.style.removeProperty(key);
    else el.style.setProperty(key, previous);
  }
  managed.delete(el);
  delete el.dataset.skin;
}

export function sameTokenMap(a: SkinTokenMap, b: SkinTokenMap): boolean {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  for (const key of keys) {
    if ((a[key] ?? "") !== (b[key] ?? "")) return false;
  }
  return true;
}

/**
 * Kit values on `el`, ignoring inline vars this module wrote for a skin.
 * Passing the theme root (not `documentElement` blindly) keeps a nested
 * theme's palette. Call again when the mode changes — the previous snapshot
 * is not reused.
 */
export function captureKitTokens(el: HTMLElement, keys: string[]): SkinTokenMap {
  const prev = managed.get(el);
  const skinValues = new Map<string, string>();
  if (prev) {
    for (const key of keys) {
      if (!prev.has(key)) continue;
      skinValues.set(key, el.style.getPropertyValue(key));
      const previous = prev.get(key) ?? null;
      if (previous === null) el.style.removeProperty(key);
      else el.style.setProperty(key, previous);
    }
  }
  const computed = getComputedStyle(el);
  const next: SkinTokenMap = {};
  for (const key of keys) next[key] = computed.getPropertyValue(key).trim();
  for (const [key, value] of skinValues) {
    if (value) el.style.setProperty(key, value);
    else el.style.removeProperty(key);
  }
  return next;
}

/** Refresh `keys` from the theme root. Previously stored values for those keys are replaced. */
export function captureBaseline(keys: string[], existing: SkinTokenMap, el?: HTMLElement | null): SkinTokenMap {
  if (typeof document === "undefined") return existing;
  const fresh = captureKitTokens(el ?? document.documentElement, keys);
  return { ...existing, ...fresh };
}

/** CSS variables for a host `style`. Empty values are omitted. */
export function skinTokenStyle(tokens: SkinTokenMap): Record<string, string> {
  const style: Record<string, string> = {};
  for (const [key, value] of Object.entries(tokens)) {
    if (value) style[key] = value;
  }
  return style;
}

/**
 * Theme node whose palette the scope should read.
 * A `data-theme` island between the host and the theme root wins over `<html>`.
 */
export function skinThemeAnchor(start: Element | null, themeRoot: HTMLElement | null): HTMLElement | null {
  if (typeof document === "undefined") return null;
  const themed = start?.closest("[data-theme]");
  if (themed instanceof HTMLElement && themed !== document.documentElement && themed !== themeRoot) {
    return themed;
  }
  return themeRoot ?? document.documentElement;
}

/** Light island attribute, otherwise the caller's fallback (theme context or `<html>`). */
export function skinThemeMode(
  start: Element | null,
  themeRoot: HTMLElement | null,
  fallback: "light" | "dark",
): "light" | "dark" {
  if (typeof document === "undefined") return fallback;
  const themed = start?.closest("[data-theme]");
  if (themed instanceof HTMLElement && themed !== document.documentElement && themed !== themeRoot) {
    return themed.getAttribute("data-theme") === "light" ? "light" : "dark";
  }
  return fallback;
}

export function baselineFor(keys: string[], baseline: SkinTokenMap): SkinTokenMap {
  const tokens: SkinTokenMap = {};
  for (const key of keys) tokens[key] = baseline[key] ?? "";
  return tokens;
}
