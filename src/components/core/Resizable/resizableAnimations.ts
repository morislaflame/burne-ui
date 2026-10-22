/**
 * Slot motion for Resizable — look here first.
 *
 * DOM slots: `root`, `panel`, `handle`
 *
 * Drag writes panel size. That size is not a public MotionVar.
 * Defaults: empty.
 */
import type { ForwardedRef } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

import {
  hasPointerPhases,
  useMotionPart,
  useOptionalEnterOnMount,
} from "@/components/core/utils/slotMotion";

import { useResizableMotionScope } from "./resizableContext";
import type { ResizableMotion, ResizablePartMotion } from "./resizableTypes";

export function resolveResizableMotionDefaults() {
  return {};
}

/** Literal registrations for the slot checker. */
const RESIZABLE_MOTION_SLOTS = {
  root: { slot: "root" },
  panel: { slot: "panel" },
  handle: { slot: "handle" },
} as const;

function useResizableSlot(
  slot: keyof ResizableMotion,
  {
    forwardedRef,
    motion,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
  }: {
    forwardedRef?: ForwardedRef<HTMLDivElement>;
    motion?: ResizablePartMotion;
    onPointerOver?: (e: ReactPointerEvent<HTMLDivElement>) => void;
    onPointerOut?: (e: ReactPointerEvent<HTMLDivElement>) => void;
    onPointerDown?: (e: ReactPointerEvent<HTMLDivElement>) => void;
    onPointerUp?: (e: ReactPointerEvent<HTMLDivElement>) => void;
  },
) {
  const scope = useResizableMotionScope();
  const pointer = hasPointerPhases(motion);
  const part = useMotionPart<HTMLDivElement>({
    scope,
    slot: RESIZABLE_MOTION_SLOTS[slot].slot,
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

export function useResizableRootMotion(args: Parameters<typeof useResizableSlot>[1]) {
  return useResizableSlot("root", args);
}

export function useResizablePanelMotion(args: Parameters<typeof useResizableSlot>[1]) {
  return useResizableSlot("panel", args);
}

export function useResizableHandleMotion(args: Parameters<typeof useResizableSlot>[1]) {
  return useResizableSlot("handle", args);
}
