import { resolveVariantVisual } from "@/skins/resolveVariantVisual";
import { cn } from "@/utils/cn";

import { KIT_SURFACE_VARIANTS, type SurfaceVariant } from "./surfaceTypes";

export const SURFACE_VARIANT_CLASS = {
  default: "bg-surface",
  secondary: "bg-secondary",
  tertiary: "bg-tertiary",
} as const;

export const SURFACE_SHADOW_CLASS = {
  none: "",
  small: "shadow-token-small",
  base: "shadow-token-base",
  mid: "shadow-token-mid",
  large: "shadow-token-large",
} as const;

export const SURFACE_PADDING_CLASS = {
  none: "",
  small: "p-small",
  base: "p-base",
  mid: "p-mid",
  large: "p-large",
} as const;

export const SURFACE_RADIUS_CLASS = {
  base: "rounded-base",
  mid: "rounded-mid",
  large: "rounded-large",
} as const;

export const SURFACE_BASE_CLASS = "min-w-0 text-start text-foreground";

export function surfaceRootClass({
  variant,
  shadow,
  padding,
  radius,
  className,
}: {
  variant: SurfaceVariant;
  shadow: keyof typeof SURFACE_SHADOW_CLASS;
  padding: keyof typeof SURFACE_PADDING_CLASS;
  radius: keyof typeof SURFACE_RADIUS_CLASS;
  className?: string;
}): string {
  const visual = resolveVariantVisual(variant, KIT_SURFACE_VARIANTS, "surface.root");
  return cn(
    visual.className !== undefined ? visual.className : SURFACE_BASE_CLASS,
    visual.className === undefined && SURFACE_VARIANT_CLASS[visual.key],
    SURFACE_RADIUS_CLASS[radius],
    SURFACE_SHADOW_CLASS[shadow],
    SURFACE_PADDING_CLASS[padding],
    className,
  );
}
