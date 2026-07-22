import { forwardRef } from "react";

import { useMergedGlossPanelRef } from "@/components/core/utils/glossInteractiveMotion";
import { cn } from "@/utils/cn";

import "../utils/glossInteractive.css";
import { surfaceIsLandmark } from "./surfaceA11y";
import { SURFACE_GLOSS_CONTENT_CLASS, surfaceRootClass } from "./surfaceStyles";
import type { SurfaceProps } from "./surfaceTypes";

export type {
  SurfaceClassNames,
  SurfacePadding,
  SurfaceProps,
  SurfaceRadius,
  SurfaceShadow,
  SurfaceVariant,
} from "./surfaceTypes";

export const Surface = forwardRef<HTMLDivElement, SurfaceProps>(function Surface(
  {
    className = "",
    classNames,
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
    className: cn(classNames?.root, className),
  });
  const landmarkRole = surfaceIsLandmark() ? ("region" as const) : undefined;

  if (variant === "gloss") {
    return (
      <div ref={setGlossRef} role={landmarkRole} className={rootClass} {...rest}>
        <div className={cn(SURFACE_GLOSS_CONTENT_CLASS, classNames?.glossContent)}>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} role={landmarkRole} className={rootClass} {...rest}>
      {children}
    </div>
  );
});

Surface.displayName = "Surface";
