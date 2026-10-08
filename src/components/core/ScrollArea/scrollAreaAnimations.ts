/**
 * Slot motion for ScrollArea — look here first.
 *
 * DOM slots: `root`, `viewport`, `scrollbar` (one per axis), `thumb` (one per bar), `corner`
 *
 * Not a slot: the content wrapper inside the viewport.
 * Root owns the scope. Bar opacity is the show/hide channel — thumb motion uses transform.
 * Defaults are empty: the bar fades with CSS on `data-state`.
 */
import type { ForwardedRef, PointerEventHandler } from "react";

import {
  hasPointerPhases,
  useMotionPart,
  useOptionalEnterOnMount,
} from "@/components/core/utils/slotMotion";

import { useOptionalScrollAreaMotionScope } from "./scrollAreaContext";
import type { ScrollAreaMotion, ScrollAreaPartMotion } from "./scrollAreaTypes";

export function resolveScrollAreaMotionDefaults(): ScrollAreaMotion {
  return {};
}

export function useScrollAreaRootMotion({
  forwardedRef,
  onPointerOver,
  onPointerOut,
  onPointerDown,
  onPointerUp,
}: {
  forwardedRef?: ForwardedRef<HTMLDivElement>;
  onPointerOver?: PointerEventHandler<HTMLDivElement>;
  onPointerOut?: PointerEventHandler<HTMLDivElement>;
  onPointerDown?: PointerEventHandler<HTMLDivElement>;
  onPointerUp?: PointerEventHandler<HTMLDivElement>;
}) {
  const scope = useOptionalScrollAreaMotionScope();
  const pointer = hasPointerPhases(scope?.getRootMotion()?.root);
  const part = useMotionPart<HTMLDivElement>({
    scope,
    slot: "root",
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

export function useScrollAreaSlotMotion<T extends HTMLElement>({
  slot,
  motion,
  forwardedRef,
  onPointerOver,
  onPointerOut,
  onPointerDown,
  onPointerUp,
}: {
  slot: "viewport" | "scrollbar" | "thumb" | "corner";
  motion?: ScrollAreaPartMotion;
  forwardedRef?: ForwardedRef<T>;
  onPointerOver?: PointerEventHandler<T>;
  onPointerOut?: PointerEventHandler<T>;
  onPointerDown?: PointerEventHandler<T>;
  onPointerUp?: PointerEventHandler<T>;
}) {
  const scope = useOptionalScrollAreaMotionScope();
  const pointer = hasPointerPhases(motion ?? scope?.getRootMotion()?.[slot]);
  const part = useMotionPart<T>({
    scope,
    slot,
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
