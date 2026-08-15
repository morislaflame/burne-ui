import { createMotionScope } from "@/components/core/utils/slotMotion";

/** Scope only. Defaults and host play live in `selectionThumbAnimations.ts`. */
export const {
  MotionScopeProvider: SelectionThumbMotionProvider,
  useMotionScope: useSelectionThumbMotionScope,
  useOptionalMotionScope: useOptionalSelectionThumbMotionScope,
} = createMotionScope("SelectionThumb");
