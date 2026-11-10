import { createMotionScope } from "@/components/core/utils/slotMotion";

/** Scope only. Defaults and host play live in `gridAnimations.ts`. */
export const {
  MotionScopeProvider: GridMotionProvider,
  useMotionScope: useGridMotionScope,
} = createMotionScope("Grid");
