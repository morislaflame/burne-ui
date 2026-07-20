import type { ProgressBarDisplayState } from "./progressBarTypes";

export const PROGRESS_INDETERMINATE_MS = 1500;
export const PROGRESS_INDETERMINATE_EASE = "expo.inOut" as const;

export function progressBarValueToPercent(
  value: number,
  min: number,
  max: number,
): number {
  if (max <= min) return 0;
  return ((value - min) / (max - min)) * 100;
}

export function defaultProgressBarFormatValue(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
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
