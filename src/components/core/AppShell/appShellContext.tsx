import { createMotionScope } from "@/components/core/utils/slotMotion";

/** Scope only. Defaults and host play live in `appShellAnimations.ts`. */
export const {
  MotionScopeProvider: AppShellMotionProvider,
  useMotionScope: useAppShellMotionScope,
} = createMotionScope("AppShell");
