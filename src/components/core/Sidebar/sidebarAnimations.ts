/**
 * Slot motion for Sidebar — look here first.
 *
 * DOM slots: `root`
 *
 * Host: optional `enter` on mount. Pointer phases only when set.
 * Defaults: empty. Width is not motion.
 */
import type { ForwardedRef } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

import {
  hasPointerPhases,
  useMotionPart,
  useOptionalEnterOnMount,
} from "@/components/core/utils/slotMotion";

import { useSidebarMotionScope } from "./sidebarContext";
import type { SidebarPartMotion } from "./sidebarTypes";

export function resolveSidebarMotionDefaults() {
  return {};
}

export function useSidebarRootMotion({
  forwardedRef,
  motion,
  onPointerOver,
  onPointerOut,
  onPointerDown,
  onPointerUp,
}: {
  forwardedRef?: ForwardedRef<HTMLElement>;
  motion?: SidebarPartMotion;
  onPointerOver?: (e: ReactPointerEvent<HTMLElement>) => void;
  onPointerOut?: (e: ReactPointerEvent<HTMLElement>) => void;
  onPointerDown?: (e: ReactPointerEvent<HTMLElement>) => void;
  onPointerUp?: (e: ReactPointerEvent<HTMLElement>) => void;
}) {
  const scope = useSidebarMotionScope();
  const pointer = hasPointerPhases(motion);
  const part = useMotionPart<HTMLElement>({
    scope,
    slot: "root",
    motion,
    forwardedRef,
    pointerPhases: pointer,
    pressPhases: pointer,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
  });
  useOptionalEnterOnMount(scope, "root", part.targetRef);
  return part;
}
