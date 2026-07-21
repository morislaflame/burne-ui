import type { CSSProperties, HTMLAttributes } from "react";

export type SkeletonAnimation = "pulse" | "wave" | "shimmer" | "none";

export type SkeletonRadius = "none" | "small" | "mid" | "full";

export type SkeletonClassNames = {
  root?: string;
  wave?: string;
};

export type SkeletonCircleClassNames = {
  root?: string;
  wave?: string;
};

export type SkeletonTextClassNames = {
  root?: string;
  line?: string;
  wave?: string;
};

export type SkeletonBlockClassNames = {
  root?: string;
  wave?: string;
};

export type SkeletonProps = HTMLAttributes<HTMLDivElement> & {
  animation?: SkeletonAnimation;
  radius?: SkeletonRadius;
  classNames?: SkeletonClassNames;
};

export type UseSkeletonRootStateProps = Pick<SkeletonProps, "animation" | "radius">;

export type SkeletonCircleProps = HTMLAttributes<HTMLDivElement> & {
  animation?: SkeletonAnimation;
  size?: string;
  classNames?: SkeletonCircleClassNames;
};

export type SkeletonTextProps = HTMLAttributes<HTMLDivElement> & {
  animation?: SkeletonAnimation;
  lines?: number;
  lastShort?: boolean;
  classNames?: SkeletonTextClassNames;
};

export type SkeletonBlockProps = HTMLAttributes<HTMLDivElement> & {
  animation?: SkeletonAnimation;
  classNames?: SkeletonBlockClassNames;
};

export type SkeletonWaveProps = {
  className?: string;
  style?: CSSProperties;
};
