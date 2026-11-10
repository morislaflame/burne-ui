/**
 * Slot motion for Container — look here first.
 *
 * DOM slots: `root`
 *
 * Host: root plays optional `enter` on mount. Pointer phases only when set.
 * Defaults: empty. Width is not motion.
 */
import type { ForwardedRef } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

import {
  hasPointerPhases,
  useMotionPart,
  useOptionalEnterOnMount,
} from "@/components/core/utils/slotMotion";

import { useContainerMotionScope } from "./containerContext";
import type { ContainerPartMotion } from "./containerTypes";

export function resolveContainerMotionDefaults() {
  return {};
}

export function useContainerRootMotion({
  forwardedRef,
  motion,
  onPointerOver,
  onPointerOut,
  onPointerDown,
  onPointerUp,
}: {
  forwardedRef?: ForwardedRef<HTMLDivElement>;
  motion?: ContainerPartMotion;
  onPointerOver?: (e: ReactPointerEvent<HTMLDivElement>) => void;
  onPointerOut?: (e: ReactPointerEvent<HTMLDivElement>) => void;
  onPointerDown?: (e: ReactPointerEvent<HTMLDivElement>) => void;
  onPointerUp?: (e: ReactPointerEvent<HTMLDivElement>) => void;
}) {
  const scope = useContainerMotionScope();
  const pointer = hasPointerPhases(motion);
  const part = useMotionPart<HTMLDivElement>({
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
