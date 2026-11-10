import { forwardRef, useMemo } from "react";
 
import { dataVariantProps } from "@/components/core/utils/dataContract";
import { hasPointerPhases } from "@/components/core/utils/slotMotion";
import { mergeSkinSurfaceStyle, useSkinRegistryRevision, useSkinSurfaceStyle, useSkinVariant } from "@/skins/skinContext";
import { SkinShell } from "@/skins/skinShell";
import { cn } from "@/utils/cn";
 
import { surfaceIsLandmark } from "./surfaceA11y";
import { resolveSurfaceMotionDefaults } from "./surfaceAnimations";
import { SurfaceMotionProvider, useSurfaceMotionScope } from "./surfaceContext";
import { surfaceRootClass } from "./surfaceStyles";
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
    variant: variantProp,
    shadow = "none",
    padding = "none",
    radius = "mid",
    children,
    motion,
    motionController,
    motionState,
    motionPayload,
    playInitialState,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
    ...rest
  },
  ref,
) {
  const variant = useSkinVariant(variantProp);
  const skinRevision = useSkinRegistryRevision();
  const motionDefaults = useMemo(() => {
    void skinRevision;
    return resolveSurfaceMotionDefaults(variant);
  }, [skinRevision, variant]);
 
  return (
    <SurfaceMotionProvider motion={motion} defaults={motionDefaults} controller={motionController}
        motionState={motionState}
        motionPayload={motionPayload}
        playInitialState={playInitialState}>
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
    | "motionController"
    | "onPointerOver"
    | "onPointerOut"
    | "onPointerDown"
    | "onPointerUp"
  >;
}) {
  const scope = useSurfaceMotionScope();
  const pointer = hasPointerPhases(rootMotion);
  const rootClass = surfaceRootClass({
    variant,
    shadow,
    padding,
    radius,
    className: cn(classNames?.root, className),
  });
  const landmarkRole = surfaceIsLandmark() ? ("region" as const) : undefined;
  const surfaceStyle = useSkinSurfaceStyle(variant);

  return (
    <SkinShell
      role={landmarkRole}
      {...rest}
      {...dataVariantProps({ variant })}
      part="surface.root"
      variant={variant}
      scope={scope}
      slot="root"
      motion={rootMotion}
      pointerPhases={pointer}
      pressPhases={pointer}
      ref={forwardedRef}
      className={rootClass}
      style={mergeSkinSurfaceStyle(surfaceStyle, rest.style)}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    >
      {children}
    </SkinShell>
  );
}
 
Surface.displayName = "Surface";
 
