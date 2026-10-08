/**
 * Slot motion for CheckboxGroup — look here first.
 *
 * DOM slots: `root` (fieldset), `list`, `legend`, `hint`, `error`, `actions`
 *
 * Not slots: `Group` (Field.Set.Group layout), item Checkbox hosts (Checkbox motion).
 * Host: root plays optional `enter` and `change` when single-selection value updates.
 * Chrome enter is per-slot (`useOptionalEnterOnMount` + `targetRef`). Defaults: empty.
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
 
export type CheckboxGroupMotionSlot = keyof CheckboxGroupMotion;
 
export function resolveCheckboxGroupMotionDefaults(): CheckboxGroupMotion {
  return {};
}
 
function useCheckboxGroupPartMotion<T extends HTMLElement>(
  slot: CheckboxGroupMotionSlot,
  {
    motion,
    forwardedRef,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
  }: {
    motion?: CheckboxGroupPartMotion;
    forwardedRef?: ForwardedRef<T>;
    onPointerOver?: (e: ReactPointerEvent<T>) => void;
    onPointerOut?: (e: ReactPointerEvent<T>) => void;
    onPointerDown?: (e: ReactPointerEvent<T>) => void;
    onPointerUp?: (e: ReactPointerEvent<T>) => void;
  } = {},
) {
  const scope = useOptionalCheckboxGroupMotionScope();
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
  const part = useCheckboxGroupPartMotion<HTMLFieldSetElement>("root", {
    motion,
    forwardedRef,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
  });
  const scope = useOptionalCheckboxGroupMotionScope();
  useSlotPhaseOnChange(scope, "root", selectionIdentity, {
    phase: "change",
    target: part.targetRef,
  });
  return part;
}
 
export function useCheckboxGroupSlotMotion<T extends HTMLElement>(
  slot: Exclude<CheckboxGroupMotionSlot, "root">,
  options?: {
    motion?: CheckboxGroupPartMotion;
    forwardedRef?: ForwardedRef<T>;
    onPointerOver?: (e: ReactPointerEvent<T>) => void;
    onPointerOut?: (e: ReactPointerEvent<T>) => void;
    onPointerDown?: (e: ReactPointerEvent<T>) => void;
    onPointerUp?: (e: ReactPointerEvent<T>) => void;
  },
) {
  return useCheckboxGroupPartMotion<T>(slot, options);
}
 