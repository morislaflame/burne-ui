/**
 * Slot motion for Form — look here first.
 *
 * DOM slots: `root`, `header`, `title`, `description`, `actions`, `errorSummary`,
 * `announce`, `section`, `field`
 *
 * `section` / `field` use nested scopes (many instances). Does not steal child Input motion.
 * Host: root plays optional `enter` and `change` when error presence flips.
 * Defaults: empty.
 */
import type { ForwardedRef } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

import {
  hasPointerPhases,
  mergeMotionSlotMaps,
  useMotionPart,
  useOptionalEnterOnMount,
  useSlotPhaseOnChange,
} from "@/components/core/utils/slotMotion";

import { useOptionalFormMotionScope } from "./formContext";
import type { FormMotion, FormPartMotion } from "./formTypes";

export function resolveFormMotionDefaults(): FormMotion {
  return {};
}

export { mergeMotionSlotMaps };

export function useFormSlotMotion<T extends HTMLElement>(
  slot: keyof FormMotion,
  {
    motion,
    forwardedRef,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
    changeIdentity,
  }: {
    motion?: FormPartMotion;
    forwardedRef?: ForwardedRef<T>;
    onPointerOver?: (e: ReactPointerEvent<T>) => void;
    onPointerOut?: (e: ReactPointerEvent<T>) => void;
    onPointerDown?: (e: ReactPointerEvent<T>) => void;
    onPointerUp?: (e: ReactPointerEvent<T>) => void;
    changeIdentity?: unknown;
  } = {},
) {
  const scope = useOptionalFormMotionScope();
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
  useOptionalEnterOnMount(scope, slot);
  useSlotPhaseOnChange(
    changeIdentity === undefined ? null : scope,
    slot,
    changeIdentity,
    { phase: "change" },
  );
  return part;
}
