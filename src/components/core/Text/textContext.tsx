import { createMotionScope } from "@/components/core/utils/slotMotion";

/** Scope only. Defaults and host play live in `textAnimations.ts`. */
export const {
  MotionScopeProvider: TextMotionProvider,
  useMotionScope: useTextMotionScope,
  useOptionalMotionScope: useOptionalTextMotionScope,
} = createMotionScope("Text");
