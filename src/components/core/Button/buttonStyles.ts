import type { TextVariant } from "@/components/core/Text";
import type { ComponentSize } from "@/components/core/utils/sizeLayout";
import { CONTROL_SIZE_LAYOUT, ICON_SLOT_CLASS, iconSlotSizeClass } from "@/components/core/utils/sizeLayout";
import { SEMANTIC_STATUS_FILL, SEMANTIC_STATUS_FILL_TEXT, SEMANTIC_STATUS_OUTLINE_BORDER, SEMANTIC_STATUS_SURFACE_TINT, SEMANTIC_STATUS_TEXT, type SemanticSurfaceStatus } from "@/components/core/utils/semanticStatusSurface";
import { hoverVariant, type HoverVariant } from "@/components/core/utils/hoverVariant";
import { SHADOW_LIFT_MOTION_CLASS } from "@/components/core/utils/useShadowMotion";
import { colorToken } from "@/tokens";
import { cn } from "@/utils/cn";
 
import { resolveVariantVisual } from "@/skins/resolveVariantVisual";

import type { ButtonSize, ButtonStatus, ButtonVariant, KitButtonVariant } from "./buttonTypes";
import { KIT_BUTTON_VARIANTS } from "./buttonTypes";
 
type VariantVisual = {
  root: string;
  loaderText: string;
};
 
/**
 * Shared surface root classes for interactive controls that share the same variant set
 * (Button, CloseButton). Single source of truth — import here instead of duplicating.
 */
export const INTERACTIVE_VARIANT_ROOT: Record<KitButtonVariant, string> = {
  default: "bg-surface text-foreground border-token",
  primary: "bg-primary text-primary-foreground border border-transparent",
  outline: "bg-transparent border-token-outline text-foreground",
  secondary: "bg-secondary text-secondary-foreground border border-token",
  ghost: "bg-transparent text-foreground border border-transparent",
};
 
export const BUTTON_VARIANT_HAS_HOVER_SHADOW = new Set<KitButtonVariant>([
  "default",
  "primary",
  "outline",
  "secondary",
  "ghost",
]);
 
const BUTTON_VARIANT: Record<KitButtonVariant, VariantVisual> = {
  default: {
    root: INTERACTIVE_VARIANT_ROOT.default,
    loaderText: "text-foreground",
  },
  primary: {
    root: INTERACTIVE_VARIANT_ROOT.primary,
    loaderText: "text-primary-foreground",
  },
  outline: {
    root: INTERACTIVE_VARIANT_ROOT.outline,
    loaderText: "text-foreground",
  },
  secondary: {
    root: INTERACTIVE_VARIANT_ROOT.secondary,
    loaderText: "text-secondary-foreground",
  },
  ghost: {
    root: INTERACTIVE_VARIANT_ROOT.ghost,
    loaderText: "text-foreground",
  },
};
 
 
/** Retarget `--color-focus-ring` for `focus-ring` (status soft tokens). */
export const BUTTON_STATUS_FOCUS_OUTLINE: Record<ButtonStatus, string> = {
  default: "",
  danger: "[--color-focus-ring:var(--color-focus-ring-danger)]",
  success: "[--color-focus-ring:var(--color-focus-ring-success)]",
  info: "[--color-focus-ring:var(--color-focus-ring-info)]",
  warning: "[--color-focus-ring:var(--color-focus-ring-warning)]",
};
 
export const BUTTON_STATUS_RIPPLE: Record<ButtonStatus, string> = {
  default: colorToken("converge-ripple-neutral"),
  danger: colorToken("converge-ripple-danger"),
  success: colorToken("converge-ripple-success"),
  info: colorToken("converge-ripple-info"),
  warning: colorToken("converge-ripple-warning"),
};
 
export const BUTTON_PRIMARY_STATUS_RIPPLE: Record<SemanticSurfaceStatus, string> = {
  danger: colorToken("converge-ripple-danger"),
  success: colorToken("converge-ripple-success"),
  info: colorToken("converge-ripple-info"),
  warning: colorToken("converge-ripple-warning"),
};
 
export const BUTTON_ICON_SLOT_SIZE: Record<ButtonSize, string> = {
  small: iconSlotSizeClass("small"),
  base: iconSlotSizeClass("base"),
  mid: iconSlotSizeClass("mid"),
  large: iconSlotSizeClass("large"),
};
 
export const BUTTON_SIZE_TEXT_VARIANT: Record<ButtonSize, TextVariant> = {
  small: "small",
  base: "base",
  mid: "mid",
  large: "large",
};
 
export const BUTTON_BASE_INTERACTIVE_CLASS =
  "relative inline-flex items-center justify-center outline-none focus-ring disabled:pointer-events-none";
 
 
export const BUTTON_CONTENT_MOTION_CLASS =
  "relative z-[1] grid w-full min-w-0 place-items-center";
 
export const BUTTON_CONTENT_MOTION_GROUP_CLASS = "origin-center";
 
export const BUTTON_LABEL_LAYER_CLASS =
  "col-start-1 row-start-1 inline-flex w-full min-w-0 items-center justify-center gap-xsmall";
 
export const BUTTON_LEFT_ICON_SLOT_CLASS = `inline-flex shrink-0 items-center justify-center ${ICON_SLOT_CLASS}`;
 
export const BUTTON_LABEL_TEXT_CLASS = "min-w-0 shrink";
 
export const BUTTON_OVERLAY_GRID_LAYER_CLASS = "col-start-1 row-start-1 flex items-center justify-center";
 
/**
 * CSS rest for overlay layers (`Button.Loader` / `Success` / `Error`).
 * GSAP `autoAlpha` from `motion.states` overrides inline; first paint stays hidden.
 */
export const BUTTON_OVERLAY_LAYER_INACTIVE_CLASS =
  "invisible opacity-0 pointer-events-none";
 
export const BUTTON_SUCCESS_LAYER_CLASS = "text-success";
 
export const BUTTON_ERROR_LAYER_CLASS = "text-danger";
 
export const BUTTON_SPINNER_MOTION_CLASS = "animate-spin motion-reduce:animate-none";
 
export const BUTTON_CURSOR_CLASS = "cursor-pointer";
 
export const BUTTON_DISABLED_OPACITY_CLASS = "opacity-50";
 
export function buttonVariantRootClass(variant: ButtonVariant, status: ButtonStatus): string {
  const visual = resolveVariantVisual(variant, KIT_BUTTON_VARIANTS, "button.root");
  if (visual.className !== undefined) return visual.className;
  const key = visual.key;
  if (key === "outline" && status !== "default") {
    return "bg-transparent text-foreground";
  }
  return BUTTON_VARIANT[key].root;
}
 
export function buttonVariantLoaderText(variant: ButtonVariant): string {
  const visual = resolveVariantVisual(variant, KIT_BUTTON_VARIANTS, "button.root");
  return BUTTON_VARIANT[visual.key].loaderText;
}
 
export function buttonHoverVariant(variant: ButtonVariant, status: ButtonStatus): HoverVariant {
  const key = resolveVariantVisual(variant, KIT_BUTTON_VARIANTS, "button.root").key;
  if (status === "default") {
    switch (key) {
      case "default":
        return "default";
      case "primary":
        return "primary";
      case "outline":
        return "transparent-hover";
      case "secondary":
        return "secondary";
      case "ghost":
        return "transparent-hover";
    }
  }
 
  switch (key) {
    case "default":
      return `${status}-tint-hover` as HoverVariant;
    case "primary":
      return `${status}-fill` as HoverVariant;
    case "outline":
    case "ghost":
      return status as HoverVariant;
    case "secondary":
      return "secondary";
  }
}
 
export function buttonStatusClass(variant: ButtonVariant, status: ButtonStatus): string {
  if (status === "default") return "";
  const key = resolveVariantVisual(variant, KIT_BUTTON_VARIANTS, "button.root").key;
  // Skin paints status via data-status CSS — no kit status overlay when skin target set.
  if (resolveVariantVisual(variant, KIT_BUTTON_VARIANTS, "button.root").className !== undefined) {
    return "";
  }
  switch (key) {
    case "default":
      return cn(SEMANTIC_STATUS_SURFACE_TINT[status], SEMANTIC_STATUS_TEXT[status]);
    case "primary":
      return SEMANTIC_STATUS_FILL[status];
    case "outline":
      return cn(SEMANTIC_STATUS_OUTLINE_BORDER[status], SEMANTIC_STATUS_TEXT[status]);
    case "secondary":
      return SEMANTIC_STATUS_TEXT[status];
    case "ghost":
      return SEMANTIC_STATUS_TEXT[status];
  }
}
 
export function buttonIdleSurfaceMotion(
  variant: ButtonVariant,
  status: ButtonStatus,
  blocked: boolean,
): string {
  return blocked ? "" : hoverVariant(buttonHoverVariant(variant, status));
}
 
export function buttonLoaderTextClass(
  variant: ButtonVariant,
  status: ButtonStatus,
): string {
  if (variant === "primary" && status !== "default") {
    return SEMANTIC_STATUS_FILL_TEXT[status];
  }
  return buttonVariantLoaderText(variant);
}
 
export function buttonConvergeRippleColor(
  variant: ButtonVariant,
  status: ButtonStatus,
): string {
  if (variant === "primary") {
    return status === "default"
      ? colorToken("converge-ripple-primary-fill")
      : BUTTON_PRIMARY_STATUS_RIPPLE[status];
  }
  return BUTTON_STATUS_RIPPLE[status];
}
 
export const BUTTON_CONTROL_HEIGHT_CLASS: Record<ComponentSize, string> = {
  small: "min-h-control-small",
  base: "min-h-control-base",
  mid: "min-h-control-mid",
  large: "min-h-control-large",
};
 
export function controlShellClass(
  size: ComponentSize,
  minW = CONTROL_SIZE_LAYOUT[size].minWButton,
): string {
  const layout = CONTROL_SIZE_LAYOUT[size];
  return cn(minW, layout.padX, layout.padY);
}
 
export function buttonRootClass(size: ComponentSize, iconOnly = false): string {
  const layout = CONTROL_SIZE_LAYOUT[size];
  return cn(
    BUTTON_CONTROL_HEIGHT_CLASS[size],
    iconOnly ? "min-w-fit" : layout.minWButton,
    layout.padX,
    layout.padY,
  );
}
 
export function buttonSpinnerClass(size: ComponentSize): string {
  const layout = CONTROL_SIZE_LAYOUT[size];
  return cn(layout.spinnerIcon, layout.spinnerBorder);
}
 
export function buttonSpinnerInnerClass(): string {
  return "box-border inline-block rounded-full border-current border-t-transparent";
}
 
export function buttonContentClass({
  groupSegment,
  slotClass,
  className,
}: {
  groupSegment: boolean;
  slotClass?: string;
  className?: string;
}): string {
  return cn(
    BUTTON_CONTENT_MOTION_CLASS,
    groupSegment && BUTTON_CONTENT_MOTION_GROUP_CLASS,
    slotClass,
    className,
  );
}
 
export function buttonLabelClass({
  slotClass,
  className,
  layoutClass,
}: {
  slotClass?: string;
  className?: string;
  layoutClass?: string;
}): string {
  return cn(
    BUTTON_LABEL_LAYER_CLASS,
    slotClass,
    layoutClass,
    className,
  );
}
 
export function buttonIconClass(size: ComponentSize, slotClass?: string): string {
  return cn(BUTTON_LEFT_ICON_SLOT_CLASS, BUTTON_ICON_SLOT_SIZE[size], slotClass);
}
 
export function buttonTextClass(slotClass?: string, className?: string): string {
  return cn(BUTTON_LABEL_TEXT_CLASS, slotClass, className);
}
 
export function buttonLoaderLayerClass(
  loaderTextClass: string,
  slotClass?: string,
): string {
  return cn(
    BUTTON_OVERLAY_GRID_LAYER_CLASS,
    BUTTON_OVERLAY_LAYER_INACTIVE_CLASS,
    loaderTextClass,
    slotClass,
  );
}
 
export function buttonSuccessLayerClass(slotClass?: string): string {
  return cn(
    BUTTON_OVERLAY_GRID_LAYER_CLASS,
    BUTTON_OVERLAY_LAYER_INACTIVE_CLASS,
    BUTTON_SUCCESS_LAYER_CLASS,
    slotClass,
  );
}
 
export function buttonErrorLayerClass(slotClass?: string): string {
  return cn(
    BUTTON_OVERLAY_GRID_LAYER_CLASS,
    BUTTON_OVERLAY_LAYER_INACTIVE_CLASS,
    BUTTON_ERROR_LAYER_CLASS,
    slotClass,
  );
}
 
export function buttonIconSvgClass(): string {
  return "shrink-0";
}
 
 
const BUTTON_CONVERGE_BG: Record<KitButtonVariant, string> = {
  default: colorToken("converge-ripple-neutral"),
  primary: colorToken("converge-ripple-primary-fill"),
  outline: colorToken("converge-ripple-neutral"),
  secondary: colorToken("converge-ripple-neutral"),
  ghost: colorToken("converge-ripple-neutral"),
};
 
const BUTTON_STATUS_CONVERGE_BG: Record<Exclude<ButtonStatus, "default">, string> = {
  danger: colorToken("converge-ripple-danger"),
  success: colorToken("converge-ripple-success"),
  info: colorToken("converge-ripple-info"),
  warning: colorToken("converge-ripple-warning"),
};
 
export function buttonRippleTone(
  variant: ButtonVariant,
  status: ButtonStatus = "default",
): string {
  if (status !== "default") return BUTTON_STATUS_CONVERGE_BG[status];
  const key = resolveVariantVisual(variant, KIT_BUTTON_VARIANTS, "button.root").key;
  return BUTTON_CONVERGE_BG[key];
}
 
/**
 * Surface + motion class for the button root.
 * Skin targets replace kit fill/status/hover (status via data-status CSS).
 */
export function buttonSurfaceMotionClass(
  status: ButtonStatus,
  variant: ButtonVariant,
  hasGroupSegment: boolean,
  blocked: boolean,
): string {
  const visual = resolveVariantVisual(variant, KIT_BUTTON_VARIANTS, "button.root");
  if (visual.className !== undefined) {
    return visual.className;
  }
  return cn(
    buttonVariantRootClass(variant, status),
    buttonStatusClass(variant, status),
    hasGroupSegment && "border-0 shadow-none",
    !hasGroupSegment && SHADOW_LIFT_MOTION_CLASS,
    buttonIdleSurfaceMotion(variant, status, blocked),
  );
}
 