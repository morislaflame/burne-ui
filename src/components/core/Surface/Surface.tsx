import { forwardRef, type HTMLAttributes } from "react";

import { useMergedGlossPanelRef } from "@/components/core/utils/glossInteractiveMotion";
import type { ShadowSize } from "@/tokens/shadows";

import "../utils/glossInteractive.css";
import { SURFACE_GLOSS_CONTENT_CLASS, surfaceRootClass } from "./surfaceStyles";

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
  const rootClass = surfaceRootClass({
    variant,
    shadow,
    padding,
    radius,
    className,
  });

  if (variant === "gloss") {
    return (
      <div ref={setGlossRef} className={rootClass} {...rest}>
        <div className={SURFACE_GLOSS_CONTENT_CLASS}>{children}</div>
      </div>
    );
  }

  return (
    <div ref={ref} className={rootClass} {...rest}>
      {children}
    </div>
  );
});

Surface.displayName = "Surface";
