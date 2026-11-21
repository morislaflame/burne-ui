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
import { overlaySkinMotion } from "@/skins/resolveVariantVisual";

import { useSidebarMotionScope } from "./sidebarContext";
import type { SidebarMotion, SidebarPartMotion } from "./sidebarTypes";

export function resolveSidebarMotionDefaults(variant = "default"): SidebarMotion {
  return overlaySkinMotion({}, variant, ["default"], "sidebar");
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
  const pointer =
    hasPointerPhases(motion) ||
    hasPointerPhases(scope.getRootMotion()?.root) ||
    hasPointerPhases(scope.getDefaults()?.root);
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
