import { createMotionScope } from "@/components/core/utils/slotMotion";

/** Scope only. Defaults and host play live in `sidebarAnimations.ts`. */
export const {
  MotionScopeProvider: SidebarMotionProvider,
  useMotionScope: useSidebarMotionScope,
} = createMotionScope("Sidebar");
