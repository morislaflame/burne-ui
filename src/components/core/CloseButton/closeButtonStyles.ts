import { GLOSS_INTERACTIVE_MOTION_CLASS } from "@/components/core/utils/glossInteractiveMotion";
import { hoverVariant, type HoverVariant } from "@/components/core/utils/hoverVariant";
import { SHADOW_LIFT_MOTION_CLASS } from "@/components/core/utils/useShadowMotion";
import { colorToken } from "@/tokens";
import { cn } from "@/utils/cn";

import { INTERACTIVE_VARIANT_ROOT } from "@/components/core/Button/buttonStyles";

import type { CloseButtonSize, CloseButtonVariant } from "./closeButtonTypes";

type VariantVisual = {
  convergeBg: string;
};

export const CLOSE_BUTTON_HAS_HOVER_SHADOW = new Set<CloseButtonVariant>([
  "default",
  "primary",
  "outline",
  "secondary",
  "ghost",
]);

const CLOSE_BUTTON_HOVER_VARIANT: Record<CloseButtonVariant, HoverVariant> = {
  default: "default",
  primary: "primary",
  outline: "default",
  secondary: "secondary",
  ghost: "default",
  gloss: "default",
};

const CLOSE_BUTTON_VARIANT: Record<CloseButtonVariant, VariantVisual> = {
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
  gloss: {
    convergeBg: colorToken("converge-ripple-neutral"),
  },
};

const CLOSE_BUTTON_SIZE: Record<
  CloseButtonSize,
  { root: string; icon: string }
> = {
  small: {
    root: "h-control-xsmall w-control-xsmall",
    icon: "icon-small",
  },
  base: {
    root: "h-control-small w-control-small",
    icon: "icon-base",
  },
  mid: {
    root: "h-control-base w-control-base",
    icon: "icon-plus",
  },
  large: {
    root: "h-control-mid w-control-mid",
    icon: "icon-mid",
  },
};

export const CLOSE_BUTTON_ROOT_BASE_CLASS =
  "relative z-0 flex shrink-0 cursor-pointer items-center justify-center rounded-full outline-none focus-ring overflow-hidden";

export const CLOSE_BUTTON_DISABLED_CLASS = "cursor-not-allowed opacity-50";

export const CLOSE_BUTTON_ICON_BASE_CLASS =
  "relative z-[1] shrink-0 text-current";

export const CLOSE_BUTTON_RIPPLE_CLIP_CLASS = "rounded-full";

export function closeButtonVariantVisual(variant: CloseButtonVariant): VariantVisual {
  return CLOSE_BUTTON_VARIANT[variant];
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
  const isGloss = variant === "gloss";
  const sizeClasses = CLOSE_BUTTON_SIZE[size];

  return cn(
    CLOSE_BUTTON_ROOT_BASE_CLASS,
    isGloss
      ? cn("gloss-btn", GLOSS_INTERACTIVE_MOTION_CLASS)
      : SHADOW_LIFT_MOTION_CLASS,
    !disabled && !isGloss && hoverVariant(CLOSE_BUTTON_HOVER_VARIANT[variant]),
    !isGloss && INTERACTIVE_VARIANT_ROOT[variant],
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
