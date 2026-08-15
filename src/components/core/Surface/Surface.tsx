import { forwardRef, useCallback, useMemo } from "react";

import { useMergedGlossPanelRef } from "@/components/core/utils/glossInteractiveMotion";
import { cn } from "@/utils/cn";

import "../utils/glossInteractive.css";
import { surfaceIsLandmark } from "./surfaceA11y";
import { resolveSurfaceMotionDefaults, useSurfaceRootMotion } from "./surfaceAnimations";
import { SurfaceMotionProvider } from "./surfaceContext";
import { SURFACE_GLOSS_CONTENT_CLASS, surfaceRootClass } from "./surfaceStyles";
import type { SurfacePartMotion, SurfaceProps } from "./surfaceTypes";

export type {
  SurfaceClassNames,
  SurfaceMotion,
  SurfacePadding,
  SurfacePartMotion,
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
    motion,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
    ...rest
  },
  ref,
) {
  const motionDefaults = useMemo(() => resolveSurfaceMotionDefaults(), []);

  return (
    <SurfaceMotionProvider motion={motion} defaults={motionDefaults}>
      <SurfaceSurface
        className={className}
        classNames={classNames}
        variant={variant}
        shadow={shadow}
        padding={padding}
        radius={radius}
        forwardedRef={ref}
        rootMotion={motion?.root}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        rest={rest}
      >
        {children}
      </SurfaceSurface>
    </SurfaceMotionProvider>
  );
});

function SurfaceSurface({
  className,
  classNames,
  variant,
  shadow,
  padding,
  radius,
  children,
  forwardedRef,
  rootMotion,
  onPointerOver,
  onPointerOut,
  onPointerDown,
  onPointerUp,
  rest,
}: {
  className: string;
  classNames: SurfaceProps["classNames"];
  variant: NonNullable<SurfaceProps["variant"]>;
  shadow: NonNullable<SurfaceProps["shadow"]>;
  padding: NonNullable<SurfaceProps["padding"]>;
  radius: NonNullable<SurfaceProps["radius"]>;
  children: SurfaceProps["children"];
  forwardedRef: React.ForwardedRef<HTMLDivElement>;
  rootMotion?: SurfacePartMotion;
  onPointerOver: SurfaceProps["onPointerOver"];
  onPointerOut: SurfaceProps["onPointerOut"];
  onPointerDown: SurfaceProps["onPointerDown"];
  onPointerUp: SurfaceProps["onPointerUp"];
  rest: Omit<
    SurfaceProps,
    | "className"
    | "classNames"
    | "variant"
    | "shadow"
    | "padding"
    | "radius"
    | "children"
    | "motion"
    | "onPointerOver"
    | "onPointerOut"
    | "onPointerDown"
    | "onPointerUp"
  >;
}) {
  const isGloss = variant === "gloss";
  const part = useSurfaceRootMotion({
    forwardedRef: isGloss ? undefined : forwardedRef,
    motion: rootMotion,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
  });
  const setGlossRef = useMergedGlossPanelRef(forwardedRef, isGloss);
  const setRef = useCallback(
    (node: HTMLDivElement | null) => {
      part.setRef(node);
      if (isGloss) setGlossRef(node);
    },
    [isGloss, part, setGlossRef],
  );

  const rootClass = surfaceRootClass({
    variant,
    shadow,
    padding,
    radius,
    className: cn(classNames?.root, className),
  });
  const landmarkRole = surfaceIsLandmark() ? ("region" as const) : undefined;

  if (isGloss) {
    return (
      <div
        ref={setRef}
        role={landmarkRole}
        className={rootClass}
        {...part.pointerHandlers}
        {...rest}
      >
        <div className={cn(SURFACE_GLOSS_CONTENT_CLASS, classNames?.glossContent)}>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setRef}
      role={landmarkRole}
      className={rootClass}
      {...part.pointerHandlers}
      {...rest}
    >
      {children}
    </div>
  );
}

Surface.displayName = "Surface";
