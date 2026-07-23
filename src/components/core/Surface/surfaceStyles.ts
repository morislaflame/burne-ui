import { cn } from "@/utils/cn";

export const SURFACE_VARIANT_CLASS = {
  default: "bg-surface",
  secondary: "bg-secondary",
  tertiary: "bg-tertiary",
} as const;

export const SURFACE_SHADOW_CLASS = {
  none: "",
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

export const SURFACE_BASE_CLASS = "min-w-0 text-left text-foreground";

export const SURFACE_GLOSS_PANEL_CLASS = "gloss-panel min-w-0 text-left text-foreground";

export const SURFACE_GLOSS_CONTENT_CLASS = "gloss-content";

export function surfaceRootClass({
  variant,
  shadow,
  padding,
  radius,
  className,
}: {
  variant: keyof typeof SURFACE_VARIANT_CLASS | "gloss";
  shadow: keyof typeof SURFACE_SHADOW_CLASS;
  padding: keyof typeof SURFACE_PADDING_CLASS;
  radius: keyof typeof SURFACE_RADIUS_CLASS;
  className?: string;
}): string {
  const isGloss = variant === "gloss";
  return cn(
    isGloss ? SURFACE_GLOSS_PANEL_CLASS : SURFACE_BASE_CLASS,
    !isGloss && SURFACE_VARIANT_CLASS[variant],
    SURFACE_RADIUS_CLASS[radius],
    SURFACE_SHADOW_CLASS[shadow],
    SURFACE_PADDING_CLASS[padding],
    className,
  );
}
