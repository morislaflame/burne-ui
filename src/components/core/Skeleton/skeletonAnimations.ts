/**
 * Slot motion for Skeleton — look here first.
 *
 * DOM slots: `root` (Root / Circle / Text / Block), `region` (`Skeleton.Region`)
 *
 * Not a slot: `wave` overlay (CSS animation).
 * Host: each public part plays optional `enter` on its slot.
 * Defaults: empty.
 */
import type { ForwardedRef, PointerEventHandler } from "react";
 
import {
  hasPointerPhases,
  useMotionPart,
  useOptionalEnterOnMount,
  type MotionScopeValue,
} from "@/components/core/utils/slotMotion";
 
import type { SkeletonMotion, SkeletonPartMotion } from "./skeletonTypes";
 
export function resolveSkeletonMotionDefaults(): SkeletonMotion {
  return {};
}
 
export function useSkeletonSlotMotion<T extends HTMLElement>({
  scope,
  slot,
  motion,
  forwardedRef,
  onPointerOver,
  onPointerOut,
  onPointerDown,
  onPointerUp,
}: {
  scope: MotionScopeValue | null;
  slot: "root" | "region";
  motion?: SkeletonPartMotion;
  forwardedRef?: ForwardedRef<T>;
  onPointerOver?: PointerEventHandler<T>;
  onPointerOut?: PointerEventHandler<T>;
  onPointerDown?: PointerEventHandler<T>;
  onPointerUp?: PointerEventHandler<T>;
}) {
  const pointer = hasPointerPhases(motion);
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
 