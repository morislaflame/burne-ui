import { createMotionScope } from "@/components/core/utils/slotMotion";

/** Scope only. Defaults and host play live in `colorSliderAnimations.ts`. */
export const {
  MotionScopeProvider: ColorSliderMotionProvider,
  useMotionScope: useColorSliderMotionScope,
  useOptionalMotionScope: useOptionalColorSliderMotionScope,
} = createMotionScope("ColorSlider");
