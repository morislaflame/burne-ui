import { createMotionScope } from "@/components/core/utils/slotMotion";

/** Scope only. Defaults and host play live in `containerAnimations.ts`. */
export const {
  MotionScopeProvider: ContainerMotionProvider,
  useMotionScope: useContainerMotionScope,
} = createMotionScope("Container");
