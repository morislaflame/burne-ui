import { createMotionScope } from "@/components/core/utils/slotMotion";

/** Scope only. Defaults and host play live in `skeletonAnimations.ts`. */
export const {
  MotionScopeProvider: SkeletonMotionProvider,
  useMotionScope: useSkeletonMotionScope,
  useOptionalMotionScope: useOptionalSkeletonMotionScope,
} = createMotionScope("Skeleton");
