import { forwardRef, type HTMLAttributes } from "react";

import { useMergedGlossPanelRef } from "@/components/core/utils/glossInteractiveMotion";
import { cn } from "@/utils/cn";
import type { ShadowSize } from "@/tokens/shadows";

import "../utils/glossInteractive.css";

export type SurfaceVariant = "default" | "secondary" | "tertiary" | "gloss";

export type SurfaceShadow = ShadowSize;

export type SurfacePadding = "none" | "small" | "base" | "plus" | "mid";

export type SurfaceRadius = "base" | "mid" | "large";

export type SurfaceProps = HTMLAttributes<HTMLDivElement> & {
  variant?: SurfaceVariant;
  shadow?: SurfaceShadow;
  padding?: SurfacePadding;
  radius?: SurfaceRadius;
};

const SURFACE_VARIANT: Record<Exclude<SurfaceVariant, "gloss">, string> = {
  default: "bg-surface",
  secondary: "bg-secondary",
  tertiary: "bg-tertiary",
};

const SURFACE_SHADOW: Record<SurfaceShadow, string> = {
  none: "",
  sm: "shadow-token-sm",
  md: "shadow-token-md",
  lg: "shadow-token-lg",
};

const SURFACE_PADDING: Record<SurfacePadding, string> = {
  none: "",
  small: "p-small",
  base: "p-base",
  plus: "p-plus",
  mid: "p-mid",
};

const SURFACE_RADIUS: Record<SurfaceRadius, string> = {
  base: "rounded-base",
  mid: "rounded-mid",
  large: "rounded-large",
};

export const Surface = forwardRef<HTMLDivElement, SurfaceProps>(function Surface(
  {
    className = "",
    variant = "default",
    shadow = "none",
    padding = "none",
    radius = "mid",
    children,
    ...rest
  },
  ref,
) {
  const setGlossRef = useMergedGlossPanelRef(ref, variant === "gloss");

  if (variant === "gloss") {
    return (
      <div
        ref={setGlossRef}
        className={cn(
          "gloss-panel min-w-0 text-left text-foreground",
          SURFACE_RADIUS[radius],
          SURFACE_SHADOW[shadow],
          SURFACE_PADDING[padding],
          className,
        )}
        {...rest}
      >
        <div className="gloss-content">{children}</div>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={cn(
        "min-w-0 text-left text-foreground",
        SURFACE_VARIANT[variant],
        SURFACE_RADIUS[radius],
        SURFACE_SHADOW[shadow],
        SURFACE_PADDING[padding],
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
});

Surface.displayName = "Surface";
