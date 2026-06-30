import type { CSSProperties, HTMLAttributes } from "react";

export type SkeletonVariant = "pulse" | "wave" | "shimmer" | "none";

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
  variant?: SkeletonVariant;
  radius?: SkeletonRadius;
  classNames?: SkeletonClassNames;
};

export type SkeletonCircleProps = HTMLAttributes<HTMLDivElement> & {
  variant?: SkeletonVariant;
  size?: string;
  classNames?: SkeletonCircleClassNames;
};

export type SkeletonTextProps = HTMLAttributes<HTMLDivElement> & {
  variant?: SkeletonVariant;
  lines?: number;
  lastShort?: boolean;
  classNames?: SkeletonTextClassNames;
};

export type SkeletonBlockProps = HTMLAttributes<HTMLDivElement> & {
  variant?: SkeletonVariant;
  classNames?: SkeletonBlockClassNames;
};

export type SkeletonWaveProps = {
  className?: string;
  style?: CSSProperties;
};
