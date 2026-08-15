/**
 * Slot motion for CheckboxGroup — look here first.
 *
 * DOM slots: `root` (fieldset), `list`
 *
 * Not slots: item Checkbox hosts (already have Checkbox motion).
 * Host: root plays optional `enter` and `change` when single-selection value updates.
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

import { useOptionalCheckboxGroupMotionScope } from "./checkboxGroupContext";
import type { CheckboxGroupMotion, CheckboxGroupPartMotion } from "./checkboxGroupTypes";

export function resolveCheckboxGroupMotionDefaults(): CheckboxGroupMotion {
  return {};
}

export function useCheckboxGroupRootMotion({
  motion,
  forwardedRef,
  selectionIdentity,
  onPointerOver,
  onPointerOut,
  onPointerDown,
  onPointerUp,
}: {
  motion?: CheckboxGroupPartMotion;
  forwardedRef?: ForwardedRef<HTMLFieldSetElement>;
  selectionIdentity: string;
  onPointerOver?: (e: ReactPointerEvent<HTMLFieldSetElement>) => void;
  onPointerOut?: (e: ReactPointerEvent<HTMLFieldSetElement>) => void;
  onPointerDown?: (e: ReactPointerEvent<HTMLFieldSetElement>) => void;
  onPointerUp?: (e: ReactPointerEvent<HTMLFieldSetElement>) => void;
}) {
  const scope = useOptionalCheckboxGroupMotionScope();
  const pointer = hasPointerPhases(motion ?? scope?.getRootMotion()?.root);
  const part = useMotionPart<HTMLFieldSetElement>({
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

export function useCheckboxGroupListMotion({
  motion,
  forwardedRef,
  onPointerOver,
  onPointerOut,
  onPointerDown,
  onPointerUp,
}: {
  motion?: CheckboxGroupPartMotion;
  forwardedRef?: ForwardedRef<HTMLDivElement>;
  onPointerOver?: (e: ReactPointerEvent<HTMLDivElement>) => void;
  onPointerOut?: (e: ReactPointerEvent<HTMLDivElement>) => void;
  onPointerDown?: (e: ReactPointerEvent<HTMLDivElement>) => void;
  onPointerUp?: (e: ReactPointerEvent<HTMLDivElement>) => void;
}) {
  const scope = useOptionalCheckboxGroupMotionScope();
  const pointer = hasPointerPhases(motion ?? scope?.getRootMotion()?.list);
  const part = useMotionPart<HTMLDivElement>({
    scope,
    slot: "list",
    motion,
    forwardedRef,
    pointerPhases: pointer,
    pressPhases: pointer,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
  });
  useOptionalEnterOnMount(scope, "list", part.targetRef);
  return part;
}
