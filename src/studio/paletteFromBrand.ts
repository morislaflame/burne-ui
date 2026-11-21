import { contrastRatio, parseCssColor, rgbToOklch } from "../../cli/skin-color.mjs";
import { DARK_COLORS, LIGHT_COLORS, type ThemeColors } from "@/theme/themeDefaults";

type Rgb = [number, number, number];

const AA = 4.5;

function isRgb(value: unknown): value is Rgb {
  return Array.isArray(value) && value.length === 3 && value.every((channel) => typeof channel === "number");
}

function contrastAt(lightness: number, chroma: number, hue: number, surface: Rgb): number {
  const color = parseCssColor(`oklch(${lightness} ${chroma} ${hue})`);
  if (!isRgb(color)) return 1;
  return contrastRatio(color, surface);
}

function foregroundFor(primary: Rgb): string {
  const white = parseCssColor("#ffffff");
  const ink = parseCssColor("#111111");
  if (!isRgb(white) || !isRgb(ink)) return "#ffffff";
  const whiteContrast = contrastRatio(white, primary);
  const inkContrast = contrastRatio(ink, primary);
  return whiteContrast >= inkContrast ? "#ffffff" : "#111111";
}

function hueDistance(left: number, right: number): number {
  const delta = Math.abs(left - right) % 360;
  return Math.min(delta, 360 - delta);
}

/** Channel clipping shifts hue. Drop chroma until the OKLCH color round-trips inside sRGB. */
function fitsGamut(lightness: number, chroma: number, hue: number): boolean {
  if (chroma < 0.02) return true;
  const rgb = parseCssColor(`oklch(${lightness} ${chroma} ${hue})`);
  if (!isRgb(rgb)) return false;
  const back = rgbToOklch(rgb[0], rgb[1], rgb[2]);
  return hueDistance(back.h, hue) <= 2 && back.c >= chroma * 0.9;
}

function fitChroma(lightness: number, chroma: number, hue: number): number {
  if (fitsGamut(lightness, chroma, hue)) return chroma;
  let low = 0;
  let high = chroma;
  for (let step = 0; step < 20; step += 1) {
    const mid = (low + high) / 2;
    if (fitsGamut(lightness, mid, hue)) low = mid;
    else high = mid;
  }
  return low;
}

function fittedContrast(lightness: number, chroma: number, hue: number, surface: Rgb): { chroma: number; ratio: number } {
  const fitted = fitChroma(lightness, chroma, hue);
  return { chroma: fitted, ratio: contrastAt(lightness, fitted, hue, surface) };
}

/** Lightness closest to `start` whose in-gamut color reaches contrast 4.5. */
function searchFittedLightness(start: number, chroma: number, hue: number, surface: Rgb): { lightness: number; chroma: number } {
  const atStart = fittedContrast(start, chroma, hue, surface);
  if (atStart.ratio >= AA) return { lightness: start, chroma: atStart.chroma };
  const dark = fittedContrast(0, chroma, hue, surface).ratio;
  const light = fittedContrast(1, chroma, hue, surface).ratio;
  const towardDark = dark >= light;
  let low = towardDark ? 0 : start;
  let high = towardDark ? start : 1;
  for (let step = 0; step < 24; step += 1) {
    const mid = (low + high) / 2;
    const passes = fittedContrast(mid, chroma, hue, surface).ratio >= AA;
    if (towardDark) {
      if (passes) low = mid;
      else high = mid;
    } else if (passes) high = mid;
    else low = mid;
  }
  const lightness = towardDark ? low : high;
  const chosen = fittedContrast(lightness, chroma, hue, surface);
  if (chosen.ratio >= AA) return { lightness, chroma: chosen.chroma };
  const edge = towardDark ? 0 : 1;
  const fallback = fittedContrast(edge, chroma, hue, surface);
  return { lightness: edge, chroma: fallback.chroma };
}

function paint(base: ThemeColors, oklch: { l: number; c: number; h: number }): ThemeColors {
  const surface = parseCssColor(base.surface) ?? parseCssColor(base.background);
  if (!isRgb(surface)) return { ...base, primary: `oklch(${oklch.l} ${oklch.c} ${oklch.h})` };
  const chosen = searchFittedLightness(oklch.l, oklch.c, oklch.h, surface);
  const primaryCss = `oklch(${chosen.lightness} ${chosen.chroma} ${oklch.h})`;
  const primary = parseCssColor(primaryCss);
  return {
    ...base,
    primary: primaryCss,
    primaryForeground: isRgb(primary) ? foregroundFor(primary) : base.primaryForeground,
  };
}

/**
 * Light and dark palettes from one brand color.
 * Kit surfaces stay. `primary` keeps the brand hue. Lightness moves until contrast
 * against `surface` is at least 4.5, then chroma drops until the color fits sRGB.
 * `primaryForeground` is white or ink, also at least 4.5 against that primary.
 */
export function paletteFromBrand(brand: string): { light: ThemeColors; dark: ThemeColors } {
  const rgb = parseCssColor(brand);
  if (!isRgb(rgb)) {
    return { light: { ...LIGHT_COLORS }, dark: { ...DARK_COLORS } };
  }
  const oklch = rgbToOklch(rgb[0], rgb[1], rgb[2]);
  return {
    light: paint(LIGHT_COLORS, oklch),
    dark: paint(DARK_COLORS, oklch),
  };
}
