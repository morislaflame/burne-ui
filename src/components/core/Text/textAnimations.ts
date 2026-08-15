/**
 * Slot motion for Text — look here first.
 *
 * DOM slots: `root` (the typography element)
 *
 * Host: root (`useTextRootMotion`) plays optional `enter` on mount.
 * Pointer hover/press run via `useMotionPart` only when the user set those phases.
 * Defaults: empty — no kit motion.
 */
import {
  hasPointerPhases,
  useMotionPart,
  useOptionalEnterOnMount,
} from "@/components/core/utils/slotMotion";
import type { ForwardedRef } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

import { useOptionalTextMotionScope, useTextMotionScope } from "./textContext";
import type { TextMotion, TextPartMotion } from "./textTypes";

export function resolveTextMotionDefaults(): TextMotion {
  return {};
}

export function useTextRootMotion({
  forwardedRef,
  motion,
  onPointerOver,
  onPointerOut,
  onPointerDown,
  onPointerUp,
}: {
  forwardedRef?: ForwardedRef<HTMLElement>;
  motion?: TextPartMotion;
  onPointerOver?: (e: ReactPointerEvent<HTMLElement>) => void;
  onPointerOut?: (e: ReactPointerEvent<HTMLElement>) => void;
  onPointerDown?: (e: ReactPointerEvent<HTMLElement>) => void;
  onPointerUp?: (e: ReactPointerEvent<HTMLElement>) => void;
}) {
  const scope = useTextMotionScope();
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
  useOptionalEnterOnMount(scope, "root");
  return part;
}

export function useOptionalTextRootMotion() {
  return useOptionalTextMotionScope();
}
