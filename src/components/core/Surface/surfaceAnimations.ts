/**
 * Slot motion for Surface — look here first.
 *
 * DOM slots: `root`
 *
 * Not a slot: `glossContent` (layout wrapper).
 * Host: root plays optional `enter`. Pointer phases only when set.
 * Defaults: empty.
 */
import type { ForwardedRef } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

import {
  hasPointerPhases,
  useMotionPart,
  useOptionalEnterOnMount,
} from "@/components/core/utils/slotMotion";

import { useSurfaceMotionScope } from "./surfaceContext";
import type { SurfaceMotion, SurfacePartMotion } from "./surfaceTypes";

export function resolveSurfaceMotionDefaults(): SurfaceMotion {
  return {};
}

export function useSurfaceRootMotion({
  forwardedRef,
  motion,
  onPointerOver,
  onPointerOut,
  onPointerDown,
  onPointerUp,
}: {
  forwardedRef?: ForwardedRef<HTMLDivElement>;
  motion?: SurfacePartMotion;
  onPointerOver?: (e: ReactPointerEvent<HTMLDivElement>) => void;
  onPointerOut?: (e: ReactPointerEvent<HTMLDivElement>) => void;
  onPointerDown?: (e: ReactPointerEvent<HTMLDivElement>) => void;
  onPointerUp?: (e: ReactPointerEvent<HTMLDivElement>) => void;
}) {
  const scope = useSurfaceMotionScope();
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
