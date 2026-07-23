import type { TextVariant } from "@/components/core/Text";

import { SEMANTIC_STATUS_FILL, SEMANTIC_STATUS_OUTLINE_BORDER, SEMANTIC_STATUS_SURFACE_TINT, SEMANTIC_STATUS_TEXT, type SemanticSurfaceStatus } from "@/components/core/utils/semanticStatusSurface";
import { cn } from "@/utils/cn";

import type { BadgePlacement, BadgeSize, BadgeStatus, BadgeVariant } from "./badgeTypes";

export type { BadgePlacement, BadgeSize, BadgeStatus, BadgeVariant } from "./badgeTypes";

export const BADGE_VARIANT_SURFACE: Record<Exclude<BadgeVariant, "gloss">, string> = {
  default: "bg-surface border-token text-foreground",
  primary: "bg-primary border-token text-primary-foreground",
  outline: "bg-transparent border-token text-foreground",
  secondary: "bg-secondary border-token text-secondary-foreground",
};

export const BADGE_ANCHOR_PLACEMENT: Record<BadgePlacement, string> = {
  "top-right":
    "absolute right-0 top-0 z-10 translate-x-[38%] -translate-y-[38%]",
  "top-left":
    "absolute left-0 top-0 z-10 -translate-x-[38%] -translate-y-[38%]",
  "bottom-right":
    "absolute bottom-0 right-0 z-10 translate-x-[38%] translate-y-[38%]",
  "bottom-left":
    "absolute bottom-0 left-0 z-10 -translate-x-[38%] translate-y-[38%]",
};

export const BADGE_TEXT_ROW: Record<BadgeSize, string> = {
  small: "gap-xsmall px-small py-xsmall",
  base: "gap-xsmall px-base py-xsmall",
  mid: "gap-xsmall px-plus py-xsmall",
  large: "gap-small px-plus py-xsmall",
};

export const BADGE_SQUARE_MIN: Record<BadgeSize, string> = {
  small: "min-h-3 min-w-3",
  base: "min-h-4 min-w-4",
  mid: "min-h-4 min-w-4",
  large: "min-h-5 min-w-5",
};

export const BADGE_TEXT_VARIANT: Record<BadgeSize, TextVariant> = {
  small: "xsmall",
  base: "small",
  mid: "base",
  large: "mid",
};

export const BADGE_ICON_ONLY: Record<BadgeSize, string> = {
  small: "shrink-0 p-xsmall [&_svg]:icon-small",
  base: "shrink-0 p-small [&_svg]:icon-base",
  mid: "shrink-0 p-base [&_svg]:icon-base",
  large: "shrink-0 p-plus [&_svg]:icon-mid",
};

export const BADGE_DOT_DIM: Record<BadgeSize, string> = {
  small: "icon-small shrink-0 p-0",
  base: "icon-small shrink-0 p-0",
  mid: "icon-base shrink-0 p-0",
  large: "icon-mid shrink-0 p-0",
};

export const BADGE_INLINE_SVG_SIZE: Record<BadgeSize, string> = {
  small: "[&_svg]:icon-small",
  base: "[&_svg]:icon-small",
  mid: "[&_svg]:icon-base",
  large: "[&_svg]:icon-mid",
};

export const BADGE_TEXT_ROW_BASE =
  "box-border isolate inline-flex max-w-full shrink-0 select-none items-center justify-center truncate rounded-full whitespace-nowrap motion-reduce:transition-none";

export const BADGE_ICON_ONLY_BASE =
  "box-border isolate inline-flex items-center justify-center rounded-full whitespace-nowrap";

export const BADGE_DOT_RING =
  "box-border isolate inline-flex shrink-0 rounded-full ring-2 ring-background motion-reduce:ring-1";

const BADGE_DOT_FILL: Record<Exclude<BadgeVariant, "gloss"> | SemanticSurfaceStatus, string> = {
  default: "bg-foreground",
  primary: "bg-primary",
  outline: "bg-transparent border-token",
  secondary: "bg-secondary",
  danger: "bg-danger",
  success: "bg-success",
  info: "bg-info",
  warning: "bg-warning",
};

export function dotFillClass(variant: BadgeVariant, status: BadgeStatus): string {
  if (variant === "gloss") {
    if (status !== "default") return BADGE_DOT_FILL[status];
    return BADGE_DOT_FILL.default;
  }
  if (status !== "default") return BADGE_DOT_FILL[status];
  return BADGE_DOT_FILL[variant];
}

export function badgeSurfaceClass(variant: BadgeVariant, status: BadgeStatus): string {
  if (variant === "gloss") {
    return cn(
      "gloss-panel border-0 text-foreground",
      status !== "default" ? SEMANTIC_STATUS_TEXT[status] : "",
    );
  }

  if (status === "default") return BADGE_VARIANT_SURFACE[variant];

  switch (variant) {
    case "default":
      return cn(SEMANTIC_STATUS_SURFACE_TINT[status], SEMANTIC_STATUS_TEXT[status]);
    case "primary":
      return SEMANTIC_STATUS_FILL[status];
    case "outline":
      return cn("bg-transparent", SEMANTIC_STATUS_OUTLINE_BORDER[status], SEMANTIC_STATUS_TEXT[status]);
    case "secondary":
      return cn("bg-secondary border-token", SEMANTIC_STATUS_TEXT[status]);
  }
}

export function badgeGlossStatusTextClass(status: BadgeStatus): string {
  return status !== "default" ? SEMANTIC_STATUS_TEXT[status] : "";
}

export function badgeDotSurfaceClass(
  variant: BadgeVariant,
  status: BadgeStatus,
  isGloss: boolean,
): string {
  return isGloss
    ? cn("gloss-panel border-0", badgeGlossStatusTextClass(status))
    : dotFillClass(variant, status);
}

/** Icon wrapper in simple/inline API (`icon` prop or `data-icon` on child). */
export const BADGE_ICON_SLOT_BASE = "inline-flex shrink-0 [&_svg]:shrink-0";

export function badgeIconSlotClass(size: BadgeSize): string {
  return cn(BADGE_ICON_SLOT_BASE, BADGE_INLINE_SVG_SIZE[size]);
}

/** `Badge.Anchor` root — grid overlay of child elements. */
export const BADGE_ANCHOR_ROOT_CLASS =
  "relative isolate inline-grid w-fit shrink-0 [&>*]:col-start-1 [&>*]:row-start-1";

/** Shell: outer span for split-lift (hover on anchor). */
export const BADGE_SHELL_SPLIT_OUTER_CLASS = "pointer-events-none";

/** Shell: badge inside anchor without gloss — events on anchor. */
export const BADGE_SHELL_ANCHOR_CHILD_CLASS = "pointer-events-none";

export function badgeDotViewClass(
  size: BadgeSize,
  variant: BadgeVariant,
  status: BadgeStatus,
  isGloss: boolean,
  className = "",
): string {
  return cn(
    BADGE_DOT_RING,
    BADGE_DOT_DIM[size],
    BADGE_SQUARE_MIN[size],
    badgeDotSurfaceClass(variant, status, isGloss),
    className,
  );
}

export function badgeIconOnlyViewClass(
  size: BadgeSize,
  surfaceClass: string,
  className = "",
): string {
  return cn(
    BADGE_ICON_ONLY_BASE,
    surfaceClass,
    BADGE_ICON_ONLY[size],
    BADGE_SQUARE_MIN[size],
    className,
  );
}

export function badgeTextViewClass(
  size: BadgeSize,
  surfaceClass: string,
  className = "",
): string {
  return cn(
    BADGE_TEXT_ROW_BASE,
    surfaceClass,
    BADGE_TEXT_ROW[size],
    BADGE_SQUARE_MIN[size],
    className,
  );
}

export function badgeShellAnchorChildClass(
  isDirectAnchorChild: boolean,
  isGloss: boolean,
): string {
  return isDirectAnchorChild && !isGloss ? BADGE_SHELL_ANCHOR_CHILD_CLASS : "";
}
