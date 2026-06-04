/** HSV (Hue-Saturation-Value) + Alpha color model used internally. */
export type HSVA = { h: number; s: number; v: number; a: number };
/** RGBA in 0-255 range; alpha 0-100. */
export type RGBA = { r: number; g: number; b: number; a: number };

export function clampN(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

export function hsvaToRgba({ h, s, v, a }: HSVA): RGBA {
  const S = s / 100;
  const V = v / 100;
  const H = ((h % 360) + 360) % 360;
  const sector = H / 60;
  const i = Math.floor(sector);
  const f = sector - i;
  const p = V * (1 - S);
  const q = V * (1 - S * f);
  const t = V * (1 - S * (1 - f));
  let r = 0, g = 0, b = 0;
  switch (i % 6) {
    case 0: r = V; g = t; b = p; break;
    case 1: r = q; g = V; b = p; break;
    case 2: r = p; g = V; b = t; break;
    case 3: r = p; g = q; b = V; break;
    case 4: r = t; g = p; b = V; break;
    case 5: r = V; g = p; b = q; break;
  }
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255), a };
}

export function rgbaToHsva({ r, g, b, a }: RGBA): HSVA {
  const nr = r / 255;
  const ng = g / 255;
  const nb = b / 255;
  const max = Math.max(nr, ng, nb);
  const min = Math.min(nr, ng, nb);
  const delta = max - min;

  let h = 0;
  if (delta > 0) {
    if (max === nr) h = ((ng - nb) / delta + 6) % 6;
    else if (max === ng) h = (nb - nr) / delta + 2;
    else h = (nr - ng) / delta + 4;
    h = Math.round(h * 60);
  }

  return {
    h,
    s: max === 0 ? 0 : Math.round((delta / max) * 100),
    v: Math.round(max * 100),
    a,
  };
}

export function rgbaToHex({ r, g, b, a }: RGBA): string {
  const toHex = (n: number) => Math.round(clampN(n, 0, 255)).toString(16).padStart(2, "0");
  const base = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  if (a < 100) return base + toHex(Math.round((a / 100) * 255));
  return base;
}

export function hexToRgba(hex: string): RGBA | null {
  const s = hex.replace(/^#/, "");
  if (s.length === 3) {
    return {
      r: parseInt(s[0]! + s[0]!, 16),
      g: parseInt(s[1]! + s[1]!, 16),
      b: parseInt(s[2]! + s[2]!, 16),
      a: 100,
    };
  }
  if (s.length === 6) {
    return {
      r: parseInt(s.slice(0, 2), 16),
      g: parseInt(s.slice(2, 4), 16),
      b: parseInt(s.slice(4, 6), 16),
      a: 100,
    };
  }
  if (s.length === 8) {
    return {
      r: parseInt(s.slice(0, 2), 16),
      g: parseInt(s.slice(2, 4), 16),
      b: parseInt(s.slice(4, 6), 16),
      a: Math.round((parseInt(s.slice(6, 8), 16) / 255) * 100),
    };
  }
  return null;
}

export function hsvaToHex(hsva: HSVA): string {
  return rgbaToHex(hsvaToRgba(hsva));
}

export function hexToHsva(hex: string): HSVA | null {
  const rgba = hexToRgba(hex);
  return rgba ? rgbaToHsva(rgba) : null;
}

/** CSS color string from HSVA */
export function hsvaToColorString(hsva: HSVA): string {
  const { r, g, b } = hsvaToRgba(hsva);
  if (hsva.a < 100) return `rgba(${r},${g},${b},${(hsva.a / 100).toFixed(2)})`;
  return `rgb(${r},${g},${b})`;
}

/** Pure hue color at s=100, v=100 for gradient display */
export function hueToRgbString(hue: number): string {
  const { r, g, b } = hsvaToRgba({ h: hue, s: 100, v: 100, a: 100 });
  return `rgb(${r},${g},${b})`;
}

/** Inline style for checkerboard (for alpha display) */
export const CHECKER_STYLE: React.CSSProperties = {
  backgroundImage:
    "linear-gradient(45deg,#808080 25%,transparent 25%)," +
    "linear-gradient(-45deg,#808080 25%,transparent 25%)," +
    "linear-gradient(45deg,transparent 75%,#808080 75%)," +
    "linear-gradient(-45deg,transparent 75%,#808080 75%)",
  backgroundSize: "8px 8px",
  backgroundPosition: "0 0, 0 4px, 4px -4px, -4px 0",
  backgroundColor: "#fff",
};
