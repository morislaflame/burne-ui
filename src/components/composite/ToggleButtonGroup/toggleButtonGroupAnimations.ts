/**
 * Slot motion for ToggleButtonGroup — look here first.
 *
 * DOM slots: `root`
 *
 * Not slots: item ToggleButton hosts, separator.
 * Host: root plays optional `enter` and `change` on selection identity.
 * Defaults: empty.
 */
import type { ForwardedRef } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

import {
  hasPointerPhases,
  useMotionPart,
  useOptionalEnterOnMount,
  useSlotPhaseOnChange,
} from "@/components/core/utils/slotMotion";

import { useOptionalToggleButtonGroupMotionScope } from "./toggleButtonGroupContext";
import type { ToggleButtonGroupMotion, ToggleButtonGroupPartMotion } from "./toggleButtonGroupTypes";

export function resolveToggleButtonGroupMotionDefaults(): ToggleButtonGroupMotion {
  return {};
}

export function useToggleButtonGroupRootMotion({
  motion,
  forwardedRef,
  selectionIdentity,
  onPointerOver,
  onPointerOut,
  onPointerDown,
  onPointerUp,
}: {
  motion?: ToggleButtonGroupPartMotion;
  forwardedRef?: ForwardedRef<HTMLDivElement>;
  selectionIdentity: string;
  onPointerOver?: (e: ReactPointerEvent<HTMLDivElement>) => void;
  onPointerOut?: (e: ReactPointerEvent<HTMLDivElement>) => void;
  onPointerDown?: (e: ReactPointerEvent<HTMLDivElement>) => void;
  onPointerUp?: (e: ReactPointerEvent<HTMLDivElement>) => void;
}) {
  const scope = useOptionalToggleButtonGroupMotionScope();
  const pointer = hasPointerPhases(motion ?? scope?.getRootMotion()?.root);
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
  useSlotPhaseOnChange(scope, "root", selectionIdentity, {
    phase: "change",
    target: part.targetRef,
  });
  return part;
}
