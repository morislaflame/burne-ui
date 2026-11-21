import { formatLocaleNumber } from "@/components/core/utils/intlFormat";

import type { ProgressBarDisplayState } from "./progressBarTypes";
 
export function resolveProgressBarBounds(
  min: number,
  max: number,
): { safeMin: number; safeMax: number } {
  const safeMin = Number.isFinite(min) ? min : 0;
  const safeMax = Number.isFinite(max)
    ? max >= safeMin
      ? max
      : safeMin
    : Math.max(safeMin, 100);
  return { safeMin, safeMax };
}

export function progressBarValueToPercent(
  value: number,
  min: number,
  max: number,
): number {
  if (!Number.isFinite(value) || !Number.isFinite(min) || !Number.isFinite(max)) {
    return 0;
  }
  if (max <= min) return 0;
  const raw = ((value - min) / (max - min)) * 100;
  if (!Number.isFinite(raw)) return 0;
  return Math.min(100, Math.max(0, raw));
}
 
export function defaultProgressBarFormatValue(value: number): string {
  return formatLocaleNumber(value);
}
 
export function progressBarDisplayEqual(
  a: ProgressBarDisplayState | null,
  b: ProgressBarDisplayState | null,
): boolean {
  if (a === b) return true;
  if (a == null || b == null) return false;
  return (
    a.clampedValue === b.clampedValue &&
    a.statusText === b.statusText &&
    a.min === b.min &&
    a.max === b.max &&
    a.indeterminate === b.indeterminate
  );
}
 