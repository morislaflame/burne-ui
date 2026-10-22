export const AA_CONTRAST: number;

export const FOCUS_RING_CONTRAST: number;

export const FOCUS_RING_COLOR_TOKENS: readonly string[];

export const SKIN_CONTRAST_PAIRS: readonly (readonly [string, string])[];

export function shadowLayerCount(value: string): number;

export function parseCssColor(value: string): [number, number, number] | null;

export function rgbToOklch(red: number, green: number, blue: number): { l: number; c: number; h: number };

export function contrastRatio(
  foreground: [number, number, number],
  background: [number, number, number],
): number;

export function checkContrastPairs(label: string, map: Record<string, string>): string[];

export function resolveMeasurableColor(
  value: string | null | undefined,
  map: Record<string, string> | undefined,
  depth?: number,
): [number, number, number] | null;

export function checkFocusRingContrast(label: string, map: Record<string, string>): string[];
