import type { UseSkeletonRootStateProps } from "./skeletonTypes";

export function useSkeletonRootState({
  variant = "wave",
  radius = "small",
}: UseSkeletonRootStateProps) {
  return {
    variant,
    radius,
    isWave: variant === "wave",
  };
}
