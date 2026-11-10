/** Used writing direction. Missing `getComputedStyle` (unit tests) counts as LTR. */
export function isRtlElement(el: HTMLElement): boolean {
  if (typeof getComputedStyle !== "function") return false;
  try {
    return getComputedStyle(el).direction === "rtl";
  } catch {
    return false;
  }
}

/** Horizontal scale grows from the inline start. */
export function horizontalScaleOrigin(el: HTMLElement): "left center" | "right center" {
  return isRtlElement(el) ? "right center" : "left center";
}

/** Positive travel in LTR moves toward the inline end. */
export function inlineEndTravel(el: HTMLElement, travelPx: number): number {
  return isRtlElement(el) ? -travelPx : travelPx;
}
