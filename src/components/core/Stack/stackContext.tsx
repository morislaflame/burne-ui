import { createMotionScope } from "@/components/core/utils/slotMotion";

/** Scope only. Defaults and host play live in `stackAnimations.ts`. */
export const {
  MotionScopeProvider: StackMotionProvider,
  useMotionScope: useStackMotionScope,
} = createMotionScope("Stack");
