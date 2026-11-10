/**
 * Slot motion for Header — look here first.
 *
 * DOM slots: `root`
 *
 * Host: optional `enter` on mount. Pointer phases only when set.
 * Defaults: empty.
 */
import type { ForwardedRef } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

import {
  hasPointerPhases,
  useMotionPart,
  useOptionalEnterOnMount,
} from "@/components/core/utils/slotMotion";

import { useHeaderMotionScope } from "./headerContext";
import type { HeaderPartMotion } from "./headerTypes";

export function resolveHeaderMotionDefaults() {
  return {};
}

export function useHeaderRootMotion({
  forwardedRef,
  motion,
  onPointerOver,
  onPointerOut,
  onPointerDown,
  onPointerUp,
}: {
  forwardedRef?: ForwardedRef<HTMLElement>;
  motion?: HeaderPartMotion;
  onPointerOver?: (e: ReactPointerEvent<HTMLElement>) => void;
  onPointerOut?: (e: ReactPointerEvent<HTMLElement>) => void;
  onPointerDown?: (e: ReactPointerEvent<HTMLElement>) => void;
  onPointerUp?: (e: ReactPointerEvent<HTMLElement>) => void;
}) {
  const scope = useHeaderMotionScope();
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
