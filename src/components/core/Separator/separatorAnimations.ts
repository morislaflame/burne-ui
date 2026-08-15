/**
 * Slot motion for Separator — look here first.
 *
 * DOM slots: `root` (`<hr>` or vertical `<div role="separator">`)
 *
 * Host: root plays optional `enter` on mount. Pointer phases only when set.
 * Defaults: empty.
 */
import type { ForwardedRef } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

import {
  hasPointerPhases,
  useMotionPart,
  useOptionalEnterOnMount,
} from "@/components/core/utils/slotMotion";

import { useSeparatorMotionScope } from "./separatorContext";
import type { SeparatorPartMotion } from "./separatorTypes";

export function resolveSeparatorMotionDefaults() {
  return {};
}

export function useSeparatorRootMotion({
  forwardedRef,
  motion,
  onPointerOver,
  onPointerOut,
  onPointerDown,
  onPointerUp,
}: {
  forwardedRef?: ForwardedRef<HTMLElement>;
  motion?: SeparatorPartMotion;
  onPointerOver?: (e: ReactPointerEvent<HTMLElement>) => void;
  onPointerOut?: (e: ReactPointerEvent<HTMLElement>) => void;
  onPointerDown?: (e: ReactPointerEvent<HTMLElement>) => void;
  onPointerUp?: (e: ReactPointerEvent<HTMLElement>) => void;
}) {
  const scope = useSeparatorMotionScope();
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
