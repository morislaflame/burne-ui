/**
 * Slot motion for RadioGroup — look here first.
 *
 * DOM slots: `root` (fieldset), `list`, `legend`, `hint`, `error`, `actions`
 *
 * Not slots: `Group` (Field.Set.Group layout), item Radio hosts (Radio motion).
 * Host: root plays optional `enter` and `change` when value updates.
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
 
import { useOptionalRadioGroupMotionScope } from "./radioGroupContext";
import type { RadioGroupMotion, RadioGroupPartMotion } from "./radioGroupTypes";
 
export type RadioGroupMotionSlot = keyof RadioGroupMotion;
 
export function resolveRadioGroupMotionDefaults(): RadioGroupMotion {
  return {};
}
 
function useRadioGroupPartMotion<T extends HTMLElement>(
  slot: RadioGroupMotionSlot,
  {
    motion,
    forwardedRef,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
  }: {
    motion?: RadioGroupPartMotion;
    forwardedRef?: ForwardedRef<T>;
    onPointerOver?: (e: ReactPointerEvent<T>) => void;
    onPointerOut?: (e: ReactPointerEvent<T>) => void;
    onPointerDown?: (e: ReactPointerEvent<T>) => void;
    onPointerUp?: (e: ReactPointerEvent<T>) => void;
  } = {},
) {
  const scope = useOptionalRadioGroupMotionScope();
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
 
export function useRadioGroupRootMotion({
  motion,
  forwardedRef,
  selectionIdentity,
  onPointerOver,
  onPointerOut,
  onPointerDown,
  onPointerUp,
}: {
  motion?: RadioGroupPartMotion;
  forwardedRef?: ForwardedRef<HTMLFieldSetElement>;
  selectionIdentity: string;
  onPointerOver?: (e: ReactPointerEvent<HTMLFieldSetElement>) => void;
  onPointerOut?: (e: ReactPointerEvent<HTMLFieldSetElement>) => void;
  onPointerDown?: (e: ReactPointerEvent<HTMLFieldSetElement>) => void;
  onPointerUp?: (e: ReactPointerEvent<HTMLFieldSetElement>) => void;
}) {
  const part = useRadioGroupPartMotion<HTMLFieldSetElement>("root", {
    motion,
    forwardedRef,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
  });
  const scope = useOptionalRadioGroupMotionScope();
  useSlotPhaseOnChange(scope, "root", selectionIdentity, {
    phase: "change",
    target: part.targetRef,
  });
  return part;
}
 
export function useRadioGroupSlotMotion<T extends HTMLElement>(
  slot: Exclude<RadioGroupMotionSlot, "root">,
  options?: {
    motion?: RadioGroupPartMotion;
    forwardedRef?: ForwardedRef<T>;
    onPointerOver?: (e: ReactPointerEvent<T>) => void;
    onPointerOut?: (e: ReactPointerEvent<T>) => void;
    onPointerDown?: (e: ReactPointerEvent<T>) => void;
    onPointerUp?: (e: ReactPointerEvent<T>) => void;
  },
) {
  return useRadioGroupPartMotion<T>(slot, options);
}
 