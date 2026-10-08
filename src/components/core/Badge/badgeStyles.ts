import type { TextVariant } from "@/components/core/Text";
 
import {
  SEMANTIC_STATUS_FILL,
  SEMANTIC_STATUS_OUTLINE_BORDER,
  SEMANTIC_STATUS_SURFACE_TINT,
  SEMANTIC_STATUS_TEXT,
  type SemanticSurfaceStatus,
} from "@/components/core/utils/semanticStatusSurface";
import { iconSlotSizeClass, ICON_SLOT_CLASS } from "@/components/core/utils/sizeLayout";
import { cn } from "@/utils/cn";
 
import type { BadgePlacement, BadgeSize, BadgeStatus, BadgeVariant, KitBadgeVariant } from "./badgeTypes";
import { KIT_BADGE_VARIANTS } from "./badgeTypes";
import { isKitVariant, resolveVariantVisual } from "@/skins/resolveVariantVisual";
 
export type { BadgePlacement, BadgeSize, BadgeStatus, BadgeVariant } from "./badgeTypes";
 
/** Same surface roots as Button (`INTERACTIVE_VARIANT_ROOT`) for shared variants. */
export const BADGE_VARIANT_SURFACE: Record<KitBadgeVariant, string> = {
  default: "bg-surface border-token text-foreground",
  primary: "bg-primary text-primary-foreground border border-transparent",
  outline: "bg-transparent border-token-outline text-foreground",
  secondary: "bg-secondary text-secondary-foreground border border-token",
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
  /** Pads from internal `--chip-*` (shared with Kbd). */
  small:
    "gap-[length:var(--chip-gap-small)] px-[length:var(--chip-px-small)] py-[length:var(--chip-py-small)]",
  base:
    "gap-[length:var(--chip-gap-base)] px-[length:var(--chip-px-base)] py-[length:var(--chip-py-base)]",
  mid:
    "gap-[length:var(--chip-gap-mid)] px-[length:var(--chip-px-mid)] py-[length:var(--chip-py-mid)]",
  large:
    "gap-[length:var(--chip-gap-large)] px-[length:var(--chip-px-large)] py-[length:var(--chip-py-large)]",
};
 
/** Equal box for icon-only / single-digit — fixed square → circle with `rounded-full`. */
export const BADGE_CIRCLE: Record<BadgeSize, string> = {
  small: "size-[length:var(--chip-size-small)] shrink-0 p-0 leading-none",
  base: "size-[length:var(--chip-size-base)] shrink-0 p-0 leading-none",
  mid: "size-[length:var(--chip-size-mid)] shrink-0 p-0 leading-none",
  large: "size-[length:var(--chip-size-large)] shrink-0 p-0 leading-none",
};
 
export const BADGE_DOT_DIM: Record<BadgeSize, string> = {
  small: "size-[length:var(--icon-size-xsmall)] shrink-0 p-0",
  base: "size-[length:var(--icon-size-small)] shrink-0 p-0",
  mid: "size-[length:var(--icon-size-base)] shrink-0 p-0",
  large: "size-[length:var(--icon-size-mid)] shrink-0 p-0",
};
 
export const BADGE_TEXT_VARIANT: Record<BadgeSize, TextVariant> = {
  small: "xsmall",
  base: "small",
  mid: "base",
  large: "mid",
};
 
/** Same tight line-box as panel titles (`Card.Title` → `leading-none`). */
export const BADGE_TEXT_CLASS = "leading-none";
 
export const BADGE_ICON_SLOT_SIZE: Record<BadgeSize, string> = {
  small: iconSlotSizeClass("small"),
  base: iconSlotSizeClass("small"),
  mid: iconSlotSizeClass("base"),
  large: iconSlotSizeClass("mid"),
};
 
export const BADGE_TEXT_ROW_BASE =
  "box-border isolate inline-flex max-w-full shrink-0 select-none items-center justify-center truncate rounded-full whitespace-nowrap motion-reduce:transition-none";
 
export const BADGE_ICON_ONLY_BASE =
  "box-border isolate inline-flex items-center justify-center rounded-full whitespace-nowrap";
 
export const BADGE_DOT_RING =
  "box-border isolate inline-flex shrink-0 rounded-full ring-2 ring-background motion-reduce:ring-1";
 
const BADGE_DOT_FILL: Record<KitBadgeVariant | SemanticSurfaceStatus, string> = {
  default: "bg-foreground",
  primary: "bg-primary",
  outline: "bg-transparent border-token-outline",
  secondary: "bg-secondary",
  danger: "bg-danger",
  success: "bg-success",
  info: "bg-info",
  warning: "bg-warning",
};
 
export function dotFillClass(variant: BadgeVariant, status: BadgeStatus): string {
  if (status !== "default") return BADGE_DOT_FILL[status];
  if (isKitVariant(variant, KIT_BADGE_VARIANTS)) {
    return BADGE_DOT_FILL[variant as KitBadgeVariant];
  }
  return BADGE_DOT_FILL.default;
}
 
/** Variant root — mirrors `buttonVariantRootClass` (outline drops border when status paints it). */
export function badgeVariantRootClass(variant: BadgeVariant, status: BadgeStatus): string {
  const visual = resolveVariantVisual(variant, KIT_BADGE_VARIANTS, "badge.root");
  if (visual.className !== undefined) return visual.className;
  if (variant === "outline" && status !== "default") {
    return "bg-transparent text-foreground";
  }
  if (isKitVariant(variant, KIT_BADGE_VARIANTS)) {
    return BADGE_VARIANT_SURFACE[variant as KitBadgeVariant];
  }
  return BADGE_VARIANT_SURFACE.default;
}
 
/** Status overlay — same matrix as `buttonStatusClass`. A skin keeps the glass and colors the text. */
export function badgeStatusClass(variant: BadgeVariant, status: BadgeStatus): string {
  if (status === "default") return "";
  const visual = resolveVariantVisual(variant, KIT_BADGE_VARIANTS, "badge.root");
  if (visual.className !== undefined) return SEMANTIC_STATUS_TEXT[status];

  switch (visual.key) {
    case "default":
      return cn(SEMANTIC_STATUS_SURFACE_TINT[status], SEMANTIC_STATUS_TEXT[status]);
    case "primary":
      return SEMANTIC_STATUS_FILL[status];
    case "outline":
      return cn(SEMANTIC_STATUS_OUTLINE_BORDER[status], SEMANTIC_STATUS_TEXT[status]);
    case "secondary":
      return SEMANTIC_STATUS_TEXT[status];
  }
}

/** Drop the skin's `text-foreground` so the status text color is the only one. */
function withoutForegroundText(className: string): string {
  return className
    .split(/\s+/)
    .filter((part) => part !== "text-foreground")
    .join(" ");
}
 
/** Surface = variant root + status overlay (Button pattern). */
export function badgeSurfaceClass(variant: BadgeVariant, status: BadgeStatus = "default"): string {
  const root = badgeVariantRootClass(variant, status);
  const statusClass = badgeStatusClass(variant, status);
  const skinPaints =
    status !== "default" &&
    resolveVariantVisual(variant, KIT_BADGE_VARIANTS, "badge.root").className !== undefined;
  return cn(skinPaints ? withoutForegroundText(root) : root, statusClass);
}
 
export function badgeDotSurfaceClass(
  variant: BadgeVariant,
  status: BadgeStatus,
): string {
  const visual = resolveVariantVisual(variant, KIT_BADGE_VARIANTS, "badge.root");
  if (visual.className !== undefined) return visual.className;
  return dotFillClass(variant, status);
}
 
/** Icon wrapper in simple/inline API (`icon` prop or `data-icon` on child). */
export const BADGE_ICON_SLOT_BASE = `inline-flex shrink-0 ${ICON_SLOT_CLASS}`;
 
export function badgeIconSlotClass(size: BadgeSize, slotClass?: string): string {
  return cn(BADGE_ICON_SLOT_BASE, BADGE_ICON_SLOT_SIZE[size], slotClass);
}
 
/** `Badge.Anchor` root — grid overlay of child elements. */
export const BADGE_ANCHOR_ROOT_CLASS =
  "relative isolate inline-grid w-fit shrink-0 [&>*]:col-start-1 [&>*]:row-start-1";
 
/** Shell: outer span for split-lift (hover on anchor). */
export const BADGE_SHELL_SPLIT_OUTER_CLASS = "pointer-events-none";
 
/** Shell: badge inside anchor without — events on anchor. */
export const BADGE_SHELL_ANCHOR_CHILD_CLASS = "pointer-events-none";
 
export function badgeDotViewClass(
  size: BadgeSize,
  variant: BadgeVariant,
  status: BadgeStatus,
  className = "",
): string {
  return cn(
    BADGE_DOT_RING,
    BADGE_DOT_DIM[size],
    badgeDotSurfaceClass(variant, status),
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
    BADGE_CIRCLE[size],
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
    className,
  );
}
 
export function badgeShellAnchorChildClass(
  isDirectAnchorChild: boolean,
  kitSurface: boolean,
): string {
  return isDirectAnchorChild && kitSurface ? BADGE_SHELL_ANCHOR_CHILD_CLASS : "";
}
 