import type { CSSProperties } from "react";

import {
  skeletonPulseStyle,
  skeletonShimmerStyle,
} from "./skeletonStyles";
import type { SkeletonVariant } from "./skeletonTypes";

export function skeletonVariantStyle(variant: SkeletonVariant): CSSProperties {
  if (variant === "pulse") return skeletonPulseStyle();
  if (variant === "shimmer") return skeletonShimmerStyle();
  return {};
}
