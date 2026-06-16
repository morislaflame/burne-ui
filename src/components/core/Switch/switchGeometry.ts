import { type TextVariant } from "@/components/core/Text";
import { selectionIndicatorFallbackPx } from "@/components/core/SelectionIndicator";

export type SwitchSize = "small" | "base" | "mid" | "large";

/** Диаметр кружка по `size` (px), если `thickness` не задан. */
const THUMB_PX: Record<SwitchSize, number> = {
  small: selectionIndicatorFallbackPx("small"),
  base: selectionIndicatorFallbackPx("base"),
  mid: selectionIndicatorFallbackPx("mid"),
  large: selectionIndicatorFallbackPx("large"),
};

/** Fallback для геометрии до первого измерения DOM. */
export function resolveFallbackThumbPx(
  thickness: number | string | undefined,
  size: SwitchSize,
): number {
  if (thickness == null) return THUMB_PX[size];
  if (typeof thickness === "number") return thickness;
  const trimmed = thickness.trim();
  const pxMatch = /^([\d.]+)px$/i.exec(trimmed);
  if (pxMatch) return Number.parseFloat(pxMatch[1]!);
  const remMatch = /^([\d.]+)rem$/i.exec(trimmed);
  if (remMatch && typeof document !== "undefined") {
    const root =
      Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    return Number.parseFloat(remMatch[1]!) * root;
  }
  return THUMB_PX[size];
}

export function measureSwitchTravel(trackEl: HTMLElement, thumbEl: HTMLElement): number {
  const trackW = trackEl.getBoundingClientRect().width;
  const thumbW = thumbEl.getBoundingClientRect().width;
  return Math.max(0, trackW - thumbW);
}

/** Толщина трека = диаметру кружка; ширина трека — 2× диаметр (как cross-axis у Slider). */
const SWITCH_TRACK: Record<SwitchSize, string> = {
  small:
    "h-[var(--selection-indicator-small)] min-h-[var(--selection-indicator-small)] w-[calc(2*var(--selection-indicator-small))] min-w-[calc(2*var(--selection-indicator-small))]",
  base:
    "h-[var(--selection-indicator-base)] min-h-[var(--selection-indicator-base)] w-[calc(2*var(--selection-indicator-base))] min-w-[calc(2*var(--selection-indicator-base))]",
  mid:
    "h-[var(--selection-indicator-mid)] min-h-[var(--selection-indicator-mid)] w-[calc(2*var(--selection-indicator-mid))] min-w-[calc(2*var(--selection-indicator-mid))]",
  large:
    "h-[var(--selection-indicator-large)] min-h-[var(--selection-indicator-large)] w-[calc(2*var(--selection-indicator-large))] min-w-[calc(2*var(--selection-indicator-large))]",
};

export const SWITCH_LAYOUT: Record<
  SwitchSize,
  {
    track: string;
    travelPx: number;
    title: TextVariant;
    desc: TextVariant;
    gap: string;
  }
> = {
  small: {
    track: SWITCH_TRACK.small,
    travelPx: selectionIndicatorFallbackPx("small"),
    title: "small",
    desc: "tools",
    gap: "gap-x-small gap-y-xsmall",
  },
  base: {
    track: SWITCH_TRACK.base,
    travelPx: selectionIndicatorFallbackPx("base"),
    title: "base",
    desc: "small",
    gap: "gap-x-base gap-y-xsmall",
  },
  mid: {
    track: SWITCH_TRACK.mid,
    travelPx: selectionIndicatorFallbackPx("mid"),
    title: "mid",
    desc: "small",
    gap: "gap-x-plus gap-y-xsmall",
  },
  large: {
    track: SWITCH_TRACK.large,
    travelPx: selectionIndicatorFallbackPx("large"),
    title: "large",
    desc: "base",
    gap: "gap-x-plus gap-y-xsmall",
  },
};
