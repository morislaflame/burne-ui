/** Clamp `n` into the inclusive range `[lo, hi]` (safe against `NaN`, `±Infinity`, and `lo > hi`). */
export function clampNumber(n: number, lo: number, hi: number): number {
  const min = Number.isFinite(lo) ? lo : 0;
  const max = Number.isFinite(hi) ? Math.max(min, hi) : min;
  if (!Number.isFinite(n)) return min;
  return Math.min(max, Math.max(min, n));
}
 