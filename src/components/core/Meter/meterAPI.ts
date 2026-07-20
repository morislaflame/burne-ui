import type { MeterDisplayState } from "./meterTypes";

export function clampMeterValue(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n));
}

export function meterValueToPercent(value: number, min: number, max: number): number {
  if (max <= min) return 0;
  return ((value - min) / (max - min)) * 100;
}

export function defaultMeterFormatValue(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

export function meterDisplayEqual(
  a: MeterDisplayState | null,
  b: MeterDisplayState | null,
): boolean {
  if (a === b) return true;
  if (a == null || b == null) return false;
  return (
    a.clampedValue === b.clampedValue &&
    a.statusText === b.statusText &&
    a.min === b.min &&
    a.max === b.max
  );
}
