import { createMotionScope } from "@/components/core/utils/slotMotion";

/** Scope only. Defaults and host play live in `separatorAnimations.ts`. */
export const {
  MotionScopeProvider: SeparatorMotionProvider,
  useMotionScope: useSeparatorMotionScope,
  useOptionalMotionScope: useOptionalSeparatorMotionScope,
} = createMotionScope("Separator");
