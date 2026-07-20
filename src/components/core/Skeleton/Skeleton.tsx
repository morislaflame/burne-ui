import { forwardRef } from "react";

import { skeletonPresentationProps } from "./skeletonA11y";
import {
  SkeletonBlock,
  SkeletonCircle,
  SkeletonText,
  SkeletonWave,
} from "./skeletonParts";
import {
  SKELETON_BASE_CLASS,
  skeletonRadiusClass,
  skeletonVariantStyle,
} from "./skeletonStyles";
import type { SkeletonProps } from "./skeletonTypes";
import { useSkeletonRootState } from "./useSkeletonRootState";

import { cn } from "@/utils/cn";

export type {
  SkeletonProps,
  SkeletonCircleProps,
  SkeletonTextProps,
  SkeletonBlockProps,
  SkeletonVariant,
  SkeletonRadius,
  SkeletonClassNames,
  SkeletonCircleClassNames,
  SkeletonTextClassNames,
  SkeletonBlockClassNames,
} from "./skeletonTypes";

export const SkeletonRoot = forwardRef<HTMLDivElement, SkeletonProps>(function SkeletonRoot(
  {
    variant: variantProp = "wave",
    radius: radiusProp = "small",
    className,
    classNames,
    style,
    children,
    ...rest
  },
  ref,
) {
  const { variant, radius, isWave } = useSkeletonRootState({
    variant: variantProp,
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
      style={{ ...skeletonVariantStyle(variant), ...style }}
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
