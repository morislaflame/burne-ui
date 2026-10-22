/**
 * Shared color and contrast checks for `parseSkinDocument` and `burne-ui skin validate`.
 * Hex, rgb, and oklch are measured. `var()` and `color-mix()` are not.
 */

export const AA_CONTRAST = 4.5;

/** Non-text focus ring against the page and the surface (WCAG 1.4.11). */
export const FOCUS_RING_CONTRAST = 3;

export const FOCUS_RING_COLOR_TOKENS = [
  "--color-focus-ring",
  "--color-focus-ring-danger",
  "--color-focus-ring-success",
  "--color-focus-ring-info",
  "--color-focus-ring-warning",
];

const FOCUS_RING_SURFACES = ["--color-background", "--color-surface"];

/** Foreground/background pairs a skin palette should keep at WCAG AA. */
export const SKIN_CONTRAST_PAIRS = [
  ["--color-foreground", "--color-surface"],
  ["--color-foreground", "--color-background"],
  ["--color-primary-foreground", "--color-primary"],
  ["--color-secondary-foreground", "--color-secondary"],
  ["--color-danger-foreground", "--color-danger"],
  ["--color-success-foreground", "--color-success"],
  ["--color-warning-foreground", "--color-warning"],
  ["--color-info-foreground", "--color-info"],
  ["--color-muted-foreground", "--color-muted"],
];

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

function channelByte(value) {
  const clamped = Math.min(1, Math.max(0, value));
  const encoded = clamped <= 0.0031308 ? 12.92 * clamped : 1.055 * clamped ** (1 / 2.4) - 0.055;
  return Math.round(Math.min(1, Math.max(0, encoded)) * 255);
}

/** OKLCH → sRGB. `L` is 0–1 or a percentage. Hue is degrees. */
function oklchToRgb(lightness, chroma, hue) {
  const l = lightness > 1 ? lightness / 100 : lightness;
  const h = (hue * Math.PI) / 180;
  const a = chroma * Math.cos(h);
  const b = chroma * Math.sin(h);
  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.291485548 * b;
  const l3 = l_ ** 3;
  const m3 = m_ ** 3;
  const s3 = s_ ** 3;
  return [
    channelByte(4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3),
    channelByte(-1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3),
    channelByte(-0.0041960863 * l3 - 0.7034186147 * m3 + 1.707614701 * s3),
  ];
}

function alphaIsOpaque(alpha) {
  if (alpha == null) return true;
  const text = String(alpha).trim();
  return text === "1" || text === "100%" || text === "1.0" || text === "255" || text === "ff";
}

/** `50%` → 0.5. A bare `1` stays 1 (OKLCH lightness is 0–1). */
function unitLightness(token) {
  const text = String(token).trim();
  const value = Number.parseFloat(text);
  return text.endsWith("%") ? value / 100 : value;
}

function srgbChannel(token) {
  const text = String(token).trim();
  const value = Number.parseFloat(text);
  if (text.endsWith("%")) return Math.round((value / 100) * 255);
  return Math.round(value * 255);
}

function hslToRgb(hue, saturation, lightness) {
  const h = ((hue % 360) + 360) % 360;
  const c = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const hp = h / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  let red = 0;
  let green = 0;
  let blue = 0;
  if (hp < 1) [red, green, blue] = [c, x, 0];
  else if (hp < 2) [red, green, blue] = [x, c, 0];
  else if (hp < 3) [red, green, blue] = [0, c, x];
  else if (hp < 4) [red, green, blue] = [0, x, c];
  else if (hp < 5) [red, green, blue] = [x, 0, c];
  else [red, green, blue] = [c, 0, x];
  const match = lightness - c / 2;
  return [red, green, blue].map((channel) => Math.round((channel + match) * 255));
}

/** sRGB bytes → OKLCH. `l` is 0–1. */
export function rgbToOklch(red, green, blue) {
  const linear = (channel) => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  };
  const r = linear(red);
  const g = linear(green);
  const b = linear(blue);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  const chroma = Math.hypot(A, B);
  let hue = (Math.atan2(B, A) * 180) / Math.PI;
  if (hue < 0) hue += 360;
  return { l: L, c: chroma, h: hue };
}

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
  if (rgb) {
    const channels = [rgb[1], rgb[2], rgb[3]].map(Number);
    if (channels.some((channel) => channel > 255)) return null;
    if (!alphaIsOpaque(rgb[4])) return null;
    return channels;
  }
  const hexAlpha = /^#([0-9a-f]{4}|[0-9a-f]{8})$/i.exec(text);
  if (hexAlpha) {
    let body = hexAlpha[1];
    if (body.length === 4) body = body.split("").map((ch) => ch + ch).join("");
    if (!alphaIsOpaque(body.slice(6, 8).toLowerCase())) return null;
    return [
      Number.parseInt(body.slice(0, 2), 16),
      Number.parseInt(body.slice(2, 4), 16),
      Number.parseInt(body.slice(4, 6), 16),
    ];
  }
  const hsl = /^hsla?\(\s*(-?[0-9.]+)\s*[, ]\s*([0-9.]+)%\s*[, ]\s*([0-9.]+)%(?:\s*[,/]\s*([0-9.]+%?))?\s*\)$/i.exec(
    text,
  );
  if (hsl) {
    if (!alphaIsOpaque(hsl[4])) return null;
    return hslToRgb(Number.parseFloat(hsl[1]), Number.parseFloat(hsl[2]) / 100, Number.parseFloat(hsl[3]) / 100);
  }
  const oklab = /^oklab\(\s*([0-9.]+%?)\s+(-?[0-9.]+)\s+(-?[0-9.]+)(?:\s*\/\s*([0-9.]+%?))?\s*\)$/i.exec(
    text,
  );
  if (oklab) {
    if (!alphaIsOpaque(oklab[4])) return null;
    const lightness = unitLightness(oklab[1]);
    const a = Number.parseFloat(oklab[2]);
    const b = Number.parseFloat(oklab[3]);
    if (![lightness, a, b].every(Number.isFinite)) return null;
    return oklabToRgb(lightness, a, b);
  }
  const srgb = /^color\(\s*srgb\s+([0-9.]+%?)\s+([0-9.]+%?)\s+([0-9.]+%?)(?:\s*\/\s*([0-9.]+%?))?\s*\)$/i.exec(
    text,
  );
  if (srgb) {
    if (!alphaIsOpaque(srgb[4])) return null;
    return [srgbChannel(srgb[1]), srgbChannel(srgb[2]), srgbChannel(srgb[3])];
  }
  const oklch = /^oklch\(\s*([0-9.]+%?)\s+([0-9.]+)\s+(-?[0-9.]+)(?:deg)?(?:\s*\/\s*([0-9.]+%?))?\s*\)$/i.exec(
    text,
  );
  if (!oklch) return null;
  if (!alphaIsOpaque(oklch[4])) return null;
  const lightness = unitLightness(oklch[1]);
  const chroma = Number.parseFloat(oklch[2]);
  const hue = Number.parseFloat(oklch[3]);
  if (![lightness, chroma, hue].every(Number.isFinite)) return null;
  return oklchToRgb(lightness, chroma, hue);
}

function oklabToRgb(lightness, a, b) {
  const l_ = lightness + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = lightness - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = lightness - 0.0894841775 * a - 1.291485548 * b;
  const l3 = l_ ** 3;
  const m3 = m_ ** 3;
  const s3 = s_ ** 3;
  return [
    channelByte(4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3),
    channelByte(-1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3),
    channelByte(-0.0041960863 * l3 - 0.7034186147 * m3 + 1.707614701 * s3),
  ];
}

function channelLinear(channel) {
  const value = channel / 255;
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

function relativeLuminance([red, green, blue]) {
  return 0.2126 * channelLinear(red) + 0.7152 * channelLinear(green) + 0.0722 * channelLinear(blue);
}

export function contrastRatio(foreground, background) {
  const lighter = Math.max(relativeLuminance(foreground), relativeLuminance(background));
  const darker = Math.min(relativeLuminance(foreground), relativeLuminance(background));
  return (lighter + 0.05) / (darker + 0.05);
}

function unmeasurable(value) {
  return /var\(|color-mix\(/i.test(value);
}

/** `color-mix()`, `var()`, or a variable that points at either. Contrast is skipped. */
function chainUnmeasurable(value, map, depth = 0) {
  if (value == null || depth > 6) return true;
  const text = String(value).trim();
  if (unmeasurable(text)) return true;
  const variable = /^var\(\s*(--[A-Za-z0-9-]+)\s*\)$/.exec(text);
  if (!variable) return false;
  return chainUnmeasurable(map?.[variable[1]], map, depth + 1);
}

/** Hex, rgb, oklch, or `var(--token)` that resolves to one of those in `map`. */
export function resolveMeasurableColor(value, map, depth = 0) {
  if (value == null || depth > 6) return null;
  const text = String(value).trim();
  const variable = /^var\(\s*(--[A-Za-z0-9-]+)\s*\)$/.exec(text);
  if (variable) return resolveMeasurableColor(map?.[variable[1]], map, depth + 1);
  if (unmeasurable(text)) return null;
  return parseCssColor(text);
}

/**
 * Each focus-ring color against `background` and `surface`.
 * A missing ring uses `--color-foreground`.
 * @param {string} label
 * @param {Record<string, string>} map
 * @returns {string[]}
 */
export function checkFocusRingContrast(label, map) {
  const errors = [];
  for (const ringKey of FOCUS_RING_COLOR_TOKENS) {
    const source = map[ringKey] ?? map["--color-foreground"];
    if (source == null) continue;
    if (chainUnmeasurable(source, map)) continue;
    const ring = resolveMeasurableColor(source, map);
    for (const surfaceKey of FOCUS_RING_SURFACES) {
      const surfaceSource = map[surfaceKey];
      if (surfaceSource == null) continue;
      if (chainUnmeasurable(surfaceSource, map)) continue;
      const surface = resolveMeasurableColor(surfaceSource, map);
      if (!ring || !surface) {
        errors.push(
          `${label}: ${ringKey} on ${surfaceKey} must be hex, rgb, or oklch so contrast can be measured`,
        );
        continue;
      }
      const ratio = contrastRatio(ring, surface);
      if (ratio < FOCUS_RING_CONTRAST) {
        errors.push(
          `${label}: ${ringKey} on ${surfaceKey} contrast ${ratio.toFixed(2)} is below ${FOCUS_RING_CONTRAST}:1`,
        );
      }
    }
  }
  return errors;
}

/**
 * @param {string} label
 * @param {Record<string, string>} map
 * @returns {string[]}
 */
export function checkContrastPairs(label, map) {
  const errors = [];
  for (const [foregroundKey, backgroundKey] of SKIN_CONTRAST_PAIRS) {
    const foreground = map[foregroundKey];
    const background = map[backgroundKey];
    const required = foregroundKey === "--color-foreground" && backgroundKey === "--color-surface";
    if (foreground == null && background == null) continue;
    if (foreground == null || background == null) {
      if (backgroundKey === "--color-background") continue;
      errors.push(`${label}: set both ${foregroundKey} and ${backgroundKey}`);
      continue;
    }
    if (!required && (unmeasurable(foreground) || unmeasurable(background))) continue;
    const foregroundColor = parseCssColor(foreground);
    const backgroundColor = parseCssColor(background);
    if (!foregroundColor || !backgroundColor) {
      errors.push(
        `${label}: ${foregroundKey} and ${backgroundKey} must be hex, rgb, or oklch so contrast can be measured`,
      );
      continue;
    }
    const ratio = contrastRatio(foregroundColor, backgroundColor);
    if (ratio < AA_CONTRAST) {
      errors.push(
        `${label}: ${foregroundKey} on ${backgroundKey} contrast ${ratio.toFixed(2)} is below WCAG AA ${AA_CONTRAST}`,
      );
    }
  }
  return errors;
}
