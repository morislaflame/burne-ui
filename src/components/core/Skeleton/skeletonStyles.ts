import type { CSSProperties } from "react";

import type { SkeletonAnimation, SkeletonRadius } from "./skeletonTypes";

export const SKELETON_BASE_CLASS = "relative overflow-hidden bg-primary-tint";

export const SKELETON_WAVE_OVERLAY_CLASS =
  "pointer-events-none absolute inset-0 -translate-x-full";

export const SKELETON_CIRCLE_RADIUS_CLASS = "rounded-full";

export const SKELETON_CIRCLE_SIZE_DEFAULT = "h-control-base w-control-base";

export const SKELETON_TEXT_ROOT_CLASS = "flex flex-col gap-small";

export const SKELETON_TEXT_LINE_CLASS = "h-[1em] rounded-small";

export const SKELETON_TEXT_LINE_LAST_SHORT_CLASS = "w-3/5";

export const SKELETON_TEXT_LINE_FULL_CLASS = "w-full";

export const SKELETON_BLOCK_CLASS = "rounded-mid px-large py-mid";

export const SKELETON_RADIUS_CLASS: Record<SkeletonRadius, string> = {
  none: "rounded-none",
  small: "rounded-small",
  mid: "rounded-mid",
  full: "rounded-full",
};

export const SKELETON_PULSE_ANIMATION = "skeleton-pulse 1.6s ease-in-out infinite";

export const SKELETON_WAVE_ANIMATION = "skeleton-wave-slide 2s linear 0.2s infinite";

export const SKELETON_SHIMMER_ANIMATION = "skeleton-shimmer 2s linear infinite";

export const SKELETON_WAVE_GRADIENT =
  "linear-gradient(90deg, transparent 0%, var(--color-primary-tint-strong) 50%, transparent 100%)";

export const SKELETON_SHIMMER_GRADIENT =
  "linear-gradient(90deg, var(--color-primary-tint) 0%, var(--color-primary-tint-strong) 50%, var(--color-primary-tint) 100%)";

export function skeletonPulseStyle(): CSSProperties {
  return { animation: SKELETON_PULSE_ANIMATION };
}

export function skeletonShimmerStyle(): CSSProperties {
  return {
    backgroundImage: SKELETON_SHIMMER_GRADIENT,
    backgroundSize: "400% 100%",
    animation: SKELETON_SHIMMER_ANIMATION,
  };
}

export function skeletonVariantStyle(variant: SkeletonAnimation): CSSProperties {
  if (variant === "pulse") return skeletonPulseStyle();
  if (variant === "shimmer") return skeletonShimmerStyle();
  return {};
}

export function skeletonWaveOverlayStyle(): CSSProperties {
  return {
    animation: SKELETON_WAVE_ANIMATION,
    background: SKELETON_WAVE_GRADIENT,
  };
}

export function skeletonRadiusClass(radius: SkeletonRadius): string {
  return SKELETON_RADIUS_CLASS[radius];
}

export function skeletonLineAnimationDelay(index: number): string {
  return `${index * 0.06}s`;
}

