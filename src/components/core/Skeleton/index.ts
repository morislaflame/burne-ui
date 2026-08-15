import {
  SkeletonBlock,
  SkeletonCircle,
  SkeletonRegion,
  SkeletonRoot,
  SkeletonText,
} from "./Skeleton";

export const Skeleton = Object.assign(SkeletonRoot, {
  Circle: SkeletonCircle,
  Text: SkeletonText,
  Block: SkeletonBlock,
  Region: SkeletonRegion,
});

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
