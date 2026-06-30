import {
  SkeletonBlock,
  SkeletonCircle,
  SkeletonRoot,
  SkeletonText,
} from "./Skeleton";

export const Skeleton = Object.assign(SkeletonRoot, {
  Circle: SkeletonCircle,
  Text: SkeletonText,
  Block: SkeletonBlock,
});

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
