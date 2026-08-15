import { createMotionScope } from "@/components/core/utils/slotMotion";

/** Scope only. Defaults and host play live in `loadingAnimations.ts`. */
export const {
  MotionScopeProvider: LoadingMotionProvider,
  useMotionScope: useLoadingMotionScope,
  useOptionalMotionScope: useOptionalLoadingMotionScope,
} = createMotionScope("Loading");
