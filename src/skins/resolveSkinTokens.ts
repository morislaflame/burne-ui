import { isForbiddenSkinToken, type SkinDefinition } from "./skinTypes";

export type SkinTokenMap = Record<string, string>;

export function isPaletteSkinToken(name: string): boolean {
  return name.startsWith("--color-") && !isForbiddenSkinToken(name);
}

function warnForbidden(skinName: string, token: string) {
  if (process.env.NODE_ENV !== "production") {
    console.error(`[burne-ui] skin "${skinName}" cannot set ${token}`);
  }
}

/** Drop focus-ring tokens. The rest is the reset key set. */
export function resolveSkinTokens(
  skin: SkinDefinition,
  mode: "light" | "dark" = "dark"): SkinTokenMap {
  const source = {
    ...skin.tokens,
    ...(mode === "light" ? skin.tokensLight : skin.tokensDark),
  };
  const tokens: SkinTokenMap = {};
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

export function captureBaseline(keys: string[], existing: SkinTokenMap): SkinTokenMap {
  if (typeof document === "undefined") return existing;
  const computed = getComputedStyle(document.documentElement);
  const next = { ...existing };
  for (const key of keys) {
    if (next[key] !== undefined) continue;
    next[key] = computed.getPropertyValue(key).trim();
  }
  return next;
}

export function baselineFor(keys: string[], baseline: SkinTokenMap): SkinTokenMap {
  const tokens: SkinTokenMap = {};
  for (const key of keys) tokens[key] = baseline[key] ?? "";
  return tokens;
}
