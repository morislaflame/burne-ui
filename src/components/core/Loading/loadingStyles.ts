import { CONTROL_SIZE_LAYOUT } from "@/components/core/utils/sizeLayout";
import { cn } from "@/utils/cn";

import type { LoadingColor, LoadingDotsLayout, LoadingSize } from "./loadingTypes";

export const LOADING_SPINNER_RING: Record<
  LoadingSize,
  { icon: string; border: string }
> = {
  small: {
    icon: CONTROL_SIZE_LAYOUT.small.spinnerIcon,
    border: CONTROL_SIZE_LAYOUT.small.spinnerBorder,
  },
  base: {
    icon: CONTROL_SIZE_LAYOUT.base.spinnerIcon,
    border: CONTROL_SIZE_LAYOUT.base.spinnerBorder,
  },
  mid: {
    icon: CONTROL_SIZE_LAYOUT.mid.spinnerIcon,
    border: CONTROL_SIZE_LAYOUT.mid.spinnerBorder,
  },
  large: {
    icon: CONTROL_SIZE_LAYOUT.large.spinnerIcon,
    border: CONTROL_SIZE_LAYOUT.large.spinnerBorder,
  },
};

export const LOADING_SPINNER_COLOR: Record<LoadingColor, string> = {
  primary: "text-primary",
  foreground: "text-foreground",
  muted: "text-muted",
  secondary: "text-primary",
  danger: "text-danger",
  success: "text-success",
  info: "text-info",
  warning: "text-warning",
};

export const LOADING_ROOT_CLASS = "inline-flex shrink-0 items-center justify-center";

export const LOADING_SPINNER_RING_CLASS =
  "box-border inline-block rounded-full border-current border-t-transparent animate-spin motion-reduce:animate-none";

export const LOADING_DOTS_TRACK_CLASS = "flex items-end";

export const LOADING_DOT_CLASS = "block shrink-0 rounded-full origin-bottom";

export const LOADING_DOTS_LAYOUT: Record<LoadingSize, LoadingDotsLayout> = {
  small: {
    dotClass: "size-[calc(var(--icon-size-xsmall)*0.45)]",
    dotSizeVar: "calc(var(--icon-size-xsmall) * 0.45)",
    gapClass: "gap-[calc(var(--space-xsmall)*0.75)]",
    jumpPx: 5,
    scalePeak: 1.25,
  },
  base: {
    dotClass: "size-[calc(var(--icon-size-xsmall)*0.6)]",
    dotSizeVar: "calc(var(--icon-size-xsmall) * 0.6)",
    gapClass: "gap-xsmall",
    jumpPx: 7,
    scalePeak: 1.3,
  },
  mid: {
    dotClass: "size-[calc(var(--icon-size-xsmall)*0.75)]",
    dotSizeVar: "calc(var(--icon-size-xsmall) * 0.75)",
    gapClass: "gap-xsmall",
    jumpPx: 9,
    scalePeak: 1.35,
  },
  large: {
    dotClass: "size-[calc(var(--icon-size-small)*0.75)]",
    dotSizeVar: "calc(var(--icon-size-small) * 0.75)",
    gapClass: "gap-small",
    jumpPx: 12,
    scalePeak: 1.4,
  },
};

export const LOADING_DOTS_COLOR: Record<LoadingColor, string> = {
  primary: "bg-primary",
  foreground: "bg-foreground",
  muted: "bg-muted-foreground",
  secondary: "bg-primary",
  danger: "bg-danger",
  success: "bg-success",
  info: "bg-info",
  warning: "bg-warning",
};

export function loadingSpinnerRingClass(size: LoadingSize, color: LoadingColor, className?: string) {
  const ring = LOADING_SPINNER_RING[size];
  return cn(
    LOADING_SPINNER_RING_CLASS,
    ring.icon,
    ring.border,
    LOADING_SPINNER_COLOR[color],
    className,
  );
}

export function loadingDotsTrackClass(size: LoadingSize, className?: string) {
  const layout = LOADING_DOTS_LAYOUT[size];
  return cn(LOADING_DOTS_TRACK_CLASS, layout.gapClass, className);
}

export function loadingDotClass(
  size: LoadingSize,
  color: LoadingColor,
  className?: string,
) {
  return cn(
    LOADING_DOT_CLASS,
    LOADING_DOTS_LAYOUT[size].dotClass,
    LOADING_DOTS_COLOR[color],
    className,
  );
}

export function loadingDotsTrackStyle(size: LoadingSize): { height: string } {
  const { jumpPx, dotSizeVar } = LOADING_DOTS_LAYOUT[size];
  return { height: `calc(${dotSizeVar} + ${jumpPx}px)` };
}
