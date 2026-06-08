import { Skeleton, SkeletonBlock, SkeletonCircle, SkeletonText } from "./Skeleton";

export const SkeletonCompound = Object.assign(Skeleton, {
  Circle: SkeletonCircle,
  Text: SkeletonText,
  Block: SkeletonBlock,
});

export { SkeletonCompound as Skeleton };

export type {
  SkeletonProps,
  SkeletonCircleProps,
  SkeletonTextProps,
  SkeletonVariant,
  SkeletonRadius,
} from "./Skeleton";
