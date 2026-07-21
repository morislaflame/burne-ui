import type { UseSkeletonRootStateProps } from "./skeletonTypes";

export function useSkeletonRootState({
  animation = "wave",
  radius = "small",
}: UseSkeletonRootStateProps) {
  return {
    animation,
    radius,
    isWave: animation === "wave",
  };
}
