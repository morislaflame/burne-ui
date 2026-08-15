import { forwardRef, useMemo } from "react";

import { skeletonPresentationProps } from "./skeletonA11y";
import { resolveSkeletonMotionDefaults, useSkeletonSlotMotion } from "./skeletonAnimations";
import { SkeletonMotionProvider, useSkeletonMotionScope } from "./skeletonContext";
import {
  SkeletonBlock,
  SkeletonCircle,
  SkeletonRegion,
  SkeletonText,
  SkeletonWave,
} from "./skeletonParts";
import { SKELETON_BASE_CLASS, skeletonRadiusClass, skeletonVariantStyle } from "./skeletonStyles";
import type { SkeletonPartMotion, SkeletonProps } from "./skeletonTypes";
import { useSkeletonRootState } from "./useSkeletonRootState";

import { cn } from "@/utils/cn";

export type {
  SkeletonProps,
  SkeletonCircleProps,
  SkeletonTextProps,
  SkeletonBlockProps,
  SkeletonRegionProps,
  SkeletonAnimation,
  SkeletonRadius,
  SkeletonClassNames,
  SkeletonCircleClassNames,
  SkeletonTextClassNames,
  SkeletonBlockClassNames,
  SkeletonRegionClassNames,
  SkeletonMotion,
  SkeletonPartMotion,
} from "./skeletonTypes";

export const SkeletonRoot = forwardRef<HTMLDivElement, SkeletonProps>(function SkeletonRoot(
  {
    animation: animationProp = "wave",
    radius: radiusProp = "small",
    className,
    classNames,
    style,
    children,
    motion,
    ...rest
  },
  ref,
) {
  const { animation, radius, isWave } = useSkeletonRootState({
    animation: animationProp,
    radius: radiusProp,
  });
  const motionDefaults = useMemo(() => resolveSkeletonMotionDefaults(), []);

  return (
    <SkeletonMotionProvider motion={motion} defaults={motionDefaults}>
      <SkeletonRootSurface
        animation={animation}
        radius={radius}
        isWave={isWave}
        className={className}
        classNames={classNames}
        style={style}
        forwardedRef={ref}
        rootMotion={motion?.root}
        rest={rest}
      >
        {children}
      </SkeletonRootSurface>
    </SkeletonMotionProvider>
  );
});

function SkeletonRootSurface({
  animation,
  radius,
  isWave,
  className,
  classNames,
  style,
  children,
  forwardedRef,
  rootMotion,
  rest,
}: {
  animation: ReturnType<typeof useSkeletonRootState>["animation"];
  radius: ReturnType<typeof useSkeletonRootState>["radius"];
  isWave: boolean;
  className: SkeletonProps["className"];
  classNames: SkeletonProps["classNames"];
  style: SkeletonProps["style"];
  children: SkeletonProps["children"];
  forwardedRef: React.ForwardedRef<HTMLDivElement>;
  rootMotion?: SkeletonPartMotion;
  rest: Omit<
    SkeletonProps,
    | "animation"
    | "radius"
    | "className"
    | "classNames"
    | "style"
    | "children"
    | "motion"
  >;
}) {
  const part = useSkeletonSlotMotion<HTMLDivElement>({
    scope: useSkeletonMotionScope(),
    slot: "root",
    motion: rootMotion,
    forwardedRef,
  });

  return (
    <div
      ref={part.setRef}
      className={cn(
        SKELETON_BASE_CLASS,
        skeletonRadiusClass(radius),
        classNames?.root,
        className,
      )}
      style={{ ...skeletonVariantStyle(animation), ...style }}
      {...skeletonPresentationProps()}
      {...part.pointerHandlers}
      {...rest}
    >
      {isWave ? <SkeletonWave className={classNames?.wave} /> : null}
      {children}
    </div>
  );
}

SkeletonRoot.displayName = "Skeleton";

export { SkeletonCircle, SkeletonText, SkeletonBlock, SkeletonRegion };
