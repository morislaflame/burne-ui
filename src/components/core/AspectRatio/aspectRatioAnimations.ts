/**
 * Slot motion for AspectRatio — look here first.
 *
 * DOM slots: `root`, `content`
 *
 * Host: optional `enter` on mount. Pointer phases only when set.
 * Defaults: empty. `ratio` is not motion.
 */
import type { ForwardedRef } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

import {
  hasPointerPhases,
  useMotionPart,
  useOptionalEnterOnMount,
} from "@/components/core/utils/slotMotion";

import { useAspectRatioMotionScope } from "./aspectRatioContext";
import type { AspectRatioPartMotion } from "./aspectRatioTypes";

export function resolveAspectRatioMotionDefaults() {
  return {};
}

/** Literal registrations for the slot checker. */
const ASPECT_RATIO_MOTION_SLOTS = {
  root: { slot: "root" },
  content: { slot: "content" },
} as const;

function useAspectSlot(
  slot: "root" | "content",
  {
    forwardedRef,
    motion,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
  }: {
    forwardedRef?: ForwardedRef<HTMLDivElement>;
    motion?: AspectRatioPartMotion;
    onPointerOver?: (e: ReactPointerEvent<HTMLDivElement>) => void;
    onPointerOut?: (e: ReactPointerEvent<HTMLDivElement>) => void;
    onPointerDown?: (e: ReactPointerEvent<HTMLDivElement>) => void;
    onPointerUp?: (e: ReactPointerEvent<HTMLDivElement>) => void;
  },
) {
  const scope = useAspectRatioMotionScope();
  const pointer = hasPointerPhases(motion);
  const part = useMotionPart<HTMLDivElement>({
    scope,
    slot: ASPECT_RATIO_MOTION_SLOTS[slot].slot,
    motion,
    forwardedRef,
    pointerPhases: pointer,
    pressPhases: pointer,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
  });
  useOptionalEnterOnMount(scope, slot, part.targetRef);
  return part;
}

export function useAspectRatioRootMotion(
  args: Parameters<typeof useAspectSlot>[1],
) {
  return useAspectSlot("root", args);
}

export function useAspectRatioContentMotion(
  args: Parameters<typeof useAspectSlot>[1],
) {
  return useAspectSlot("content", args);
}
