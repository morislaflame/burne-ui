import { createMotionScope } from "@/components/core/utils/slotMotion";

/** Scope only. Defaults and host play live in `headerAnimations.ts`. */
export const {
  MotionScopeProvider: HeaderMotionProvider,
  useMotionScope: useHeaderMotionScope,
} = createMotionScope("Header");
