import { forwardRef } from "react";

import { skeletonPresentationProps } from "./skeletonA11y";
import { SkeletonBlock, SkeletonCircle, SkeletonText, SkeletonWave } from "./skeletonParts";
import { SKELETON_BASE_CLASS, skeletonRadiusClass, skeletonVariantStyle } from "./skeletonStyles";
import type { SkeletonProps } from "./skeletonTypes";
import { useSkeletonRootState } from "./useSkeletonRootState";

import { cn } from "@/utils/cn";

export type {
  SkeletonProps,
  SkeletonCircleProps,
  SkeletonTextProps,
  SkeletonBlockProps,
  SkeletonAnimation,
  SkeletonRadius,
  SkeletonClassNames,
  SkeletonCircleClassNames,
  SkeletonTextClassNames,
  SkeletonBlockClassNames,
} from "./skeletonTypes";

export const SkeletonRoot = forwardRef<HTMLDivElement, SkeletonProps>(function SkeletonRoot(
  {
    animation: animationProp = "wave",
    radius: radiusProp = "small",
    className,
    classNames,
    style,
    children,
    ...rest
  },
  ref,
) {
  const { animation, radius, isWave } = useSkeletonRootState({
    animation: animationProp,
    radius: radiusProp,
  });

  return (
    <div
      ref={ref}
      className={cn(
        SKELETON_BASE_CLASS,
        skeletonRadiusClass(radius),
        classNames?.root,
        className,
      )}
      style={{ ...skeletonVariantStyle(animation), ...style }}
      {...skeletonPresentationProps()}
      {...rest}
    >
      {isWave ? <SkeletonWave className={classNames?.wave} /> : null}
      {children}
    </div>
  );
});

SkeletonRoot.displayName = "Skeleton";

export { SkeletonCircle, SkeletonText, SkeletonBlock };
