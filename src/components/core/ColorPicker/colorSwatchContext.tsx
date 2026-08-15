import { createMotionScope } from "@/components/core/utils/slotMotion";

/** Scope only. Defaults and host play live in `colorSwatchAnimations.ts`. */
export const {
  MotionScopeProvider: ColorSwatchMotionProvider,
  useMotionScope: useColorSwatchMotionScope,
  useOptionalMotionScope: useOptionalColorSwatchMotionScope,
} = createMotionScope("ColorSwatch");
