import { hoverVariant, type HoverVariant } from "@/components/core/utils/hoverVariant";
import { SHADOW_LIFT_MOTION_CLASS } from "@/components/core/utils/useShadowMotion";
import { colorToken } from "@/tokens";
import { cn } from "@/utils/cn";
 
import { INTERACTIVE_VARIANT_ROOT } from "@/components/core/Button/buttonStyles";
import { isKitVariant, resolveVariantVisual } from "@/skins/resolveVariantVisual";
 
import { KIT_CLOSE_BUTTON_VARIANTS, type CloseButtonSize, type CloseButtonVariant, type KitCloseButtonVariant } from "./closeButtonTypes";
 
type VariantVisual = {
  convergeBg: string;
};
 
export const CLOSE_BUTTON_HAS_HOVER_SHADOW = new Set<KitCloseButtonVariant>([
  "default",
  "primary",
  "outline",
  "secondary",
  "ghost",
]);
 
const CLOSE_BUTTON_HOVER_VARIANT: Record<KitCloseButtonVariant, HoverVariant> = {
  default: "default",
  primary: "primary",
  outline: "transparent-hover",
  secondary: "secondary",
  ghost: "transparent-hover",
};
 
const CLOSE_BUTTON_VARIANT: Record<KitCloseButtonVariant, VariantVisual> = {
  default: {
    convergeBg: colorToken("converge-ripple-neutral"),
  },
  primary: {
    convergeBg: colorToken("converge-ripple-primary-fill"),
  },
  outline: {
    convergeBg: colorToken("converge-ripple-neutral"),
  },
  secondary: {
    convergeBg: colorToken("converge-ripple-neutral"),
  },
  ghost: {
    convergeBg: colorToken("converge-ripple-neutral"),
  },
};
 
const CLOSE_BUTTON_SIZE: Record<
  CloseButtonSize,
  { root: string; icon: string }
> = {
  small: {
    root: "min-h-control-xsmall w-control-xsmall min-w-control-xsmall",
    icon: "icon-small",
  },
  base: {
    root: "min-h-control-small w-control-small min-w-control-small",
    icon: "icon-base",
  },
  mid: {
    root: "min-h-control-base w-control-base min-w-control-base",
    icon: "icon-mid",
  },
  large: {
    root: "min-h-control-mid w-control-mid min-w-control-mid",
    icon: "icon-large",
  },
};
 
export const CLOSE_BUTTON_ROOT_BASE_CLASS =
  "relative z-0 flex aspect-square shrink-0 cursor-pointer items-center justify-center rounded-full outline-none focus-ring";
 
export const CLOSE_BUTTON_DISABLED_CLASS = "cursor-not-allowed opacity-50";
 
export const CLOSE_BUTTON_ICON_BASE_CLASS =
  "relative z-[1] shrink-0 text-current";
 
export const CLOSE_BUTTON_RIPPLE_CLIP_CLASS = "rounded-full";
 
export function closeButtonVariantVisual(variant: CloseButtonVariant): VariantVisual {
  const visual = resolveVariantVisual(variant, KIT_CLOSE_BUTTON_VARIANTS, "closeButton.root");
  return CLOSE_BUTTON_VARIANT[visual.key];
}
 
export function closeButtonRootClass({
  variant,
  size,
  disabled,
  className,
  slotRoot,
}: {
  variant: CloseButtonVariant;
  size: CloseButtonSize;
  disabled: boolean;
  className?: string;
  slotRoot?: string;
}): string {
  const visual = resolveVariantVisual(variant, KIT_CLOSE_BUTTON_VARIANTS, "closeButton.root");
  const sizeClasses = CLOSE_BUTTON_SIZE[size];
  if (visual.className !== undefined) {
    return cn(
      CLOSE_BUTTON_ROOT_BASE_CLASS,
      visual.className,
      sizeClasses.root,
      disabled && CLOSE_BUTTON_DISABLED_CLASS,
      className,
      slotRoot,
    );
  }
 
  return cn(
    CLOSE_BUTTON_ROOT_BASE_CLASS,
    isKitVariant(variant, KIT_CLOSE_BUTTON_VARIANTS) && SHADOW_LIFT_MOTION_CLASS,
    !disabled && hoverVariant(CLOSE_BUTTON_HOVER_VARIANT[visual.key]),
    INTERACTIVE_VARIANT_ROOT[visual.key],
    sizeClasses.root,
    disabled && CLOSE_BUTTON_DISABLED_CLASS,
    className,
    slotRoot,
  );
}
 
export function closeButtonIconClass(size: CloseButtonSize, slotIcon?: string): string {
  return cn(
    CLOSE_BUTTON_ICON_BASE_CLASS,
    CLOSE_BUTTON_SIZE[size].icon,
    slotIcon,
  );
}
 