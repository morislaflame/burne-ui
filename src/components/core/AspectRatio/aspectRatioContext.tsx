import { createMotionScope } from "@/components/core/utils/slotMotion";

/** Scope only. Defaults and host play live in `aspectRatioAnimations.ts`. */
export const {
  MotionScopeProvider: AspectRatioMotionProvider,
  useMotionScope: useAspectRatioMotionScope,
} = createMotionScope("AspectRatio");
