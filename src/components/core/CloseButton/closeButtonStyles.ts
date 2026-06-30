import { CONTROL_SIZE_LAYOUT } from "@/components/core/utils/controlSizeLayout";
import { GLOSS_INTERACTIVE_MOTION_CLASS } from "@/components/core/utils/glossInteractiveMotion";
import { hoverVariant, type HoverVariant } from "@/components/core/utils/hoverVariant";
import { SHADOW_LIFT_MOTION_CLASS } from "@/components/core/utils/useShadowMotion";
import { colorToken } from "@/tokens";
import { cn } from "@/utils/cn";

import { mergeCloseButtonSlotClass } from "./closeButtonAPI";
import type { CloseButtonSize, CloseButtonVariant } from "./closeButtonTypes";

type VariantVisual = {
  root: string;
  focusOutline: string;
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
    root: "bg-surface text-foreground border-token",
    focusOutline: "focus-visible:outline-primary",
    convergeBg: colorToken("converge-ripple-neutral"),
  },
  primary: {
    root: "bg-primary text-primary-foreground border border-transparent",
    focusOutline: "focus-visible:outline-primary",
    convergeBg: colorToken("converge-ripple-primary-fill"),
  },
  outline: {
    root: "bg-transparent border-token text-foreground",
    focusOutline: "focus-visible:outline-primary",
    convergeBg: colorToken("converge-ripple-neutral"),
  },
  secondary: {
    root: "bg-secondary text-secondary-foreground border border-transparent",
    focusOutline: "focus-visible:outline-primary",
    convergeBg: colorToken("converge-ripple-neutral"),
  },
  ghost: {
    root: "bg-transparent text-foreground border border-transparent",
    focusOutline: "focus-visible:outline-primary",
    convergeBg: colorToken("converge-ripple-neutral"),
  },
  gloss: {
    root: "",
    focusOutline: "focus-visible:outline-primary",
    convergeBg: colorToken("converge-ripple-neutral"),
  },
};

const CLOSE_BUTTON_SIZE: Record<
  CloseButtonSize,
  { root: string; icon: string }
> = {
  small: {
    root: CONTROL_SIZE_LAYOUT.small.toggleBox,
    icon: CONTROL_SIZE_LAYOUT.small.toggleIcon,
  },
  base: {
    root: CONTROL_SIZE_LAYOUT.base.toggleBox,
    icon: CONTROL_SIZE_LAYOUT.base.toggleIcon,
  },
  mid: {
    root: CONTROL_SIZE_LAYOUT.mid.toggleBox,
    icon: CONTROL_SIZE_LAYOUT.mid.toggleIcon,
  },
  large: {
    root: CONTROL_SIZE_LAYOUT.large.toggleBox,
    icon: CONTROL_SIZE_LAYOUT.large.toggleIcon,
  },
};

export const CLOSE_BUTTON_ROOT_BASE_CLASS =
  "relative z-0 flex shrink-0 cursor-pointer items-center justify-center rounded-full outline-none overflow-hidden";

export const CLOSE_BUTTON_DISABLED_CLASS = "cursor-not-allowed opacity-50";

export const CLOSE_BUTTON_ICON_BASE_CLASS =
  "relative z-[1] shrink-0 text-current";

export const CLOSE_BUTTON_RIPPLE_CLIP_CLASS = "rounded-full";

export function closeButtonVariantVisual(variant: CloseButtonVariant): VariantVisual {
  return CLOSE_BUTTON_VARIANT[variant];
}

export function closeButtonSizeClasses(size: CloseButtonSize) {
  return CLOSE_BUTTON_SIZE[size];
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
  const vn = CLOSE_BUTTON_VARIANT[variant];
  const sizeClasses = CLOSE_BUTTON_SIZE[size];

  return mergeCloseButtonSlotClass(
    CLOSE_BUTTON_ROOT_BASE_CLASS,
    !isGloss && SHADOW_LIFT_MOTION_CLASS,
    !disabled && !isGloss && hoverVariant(CLOSE_BUTTON_HOVER_VARIANT[variant]),
    isGloss
      ? cn("gloss-btn", GLOSS_INTERACTIVE_MOTION_CLASS)
      : "will-change-transform origin-center",
    sizeClasses.root,
    !isGloss && vn.root,
    vn.focusOutline,
    disabled && CLOSE_BUTTON_DISABLED_CLASS,
    className,
    slotRoot,
  );
}

export function closeButtonIconClass(size: CloseButtonSize, slotIcon?: string): string {
  return mergeCloseButtonSlotClass(
    CLOSE_BUTTON_ICON_BASE_CLASS,
    CLOSE_BUTTON_SIZE[size].icon,
    slotIcon,
  );
}
