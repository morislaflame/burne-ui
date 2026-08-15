import { createMotionScope } from "@/components/core/utils/slotMotion";

/** Scope only. Defaults and host play live in `surfaceAnimations.ts`. */
export const {
  MotionScopeProvider: SurfaceMotionProvider,
  useMotionScope: useSurfaceMotionScope,
  useOptionalMotionScope: useOptionalSurfaceMotionScope,
} = createMotionScope("Surface");
