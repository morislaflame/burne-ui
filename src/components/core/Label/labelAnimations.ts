/**
 * Slot motion for Label — look here first.
 *
 * DOM slots: `root` (`<label>` / `<span>`), `text`, `required`
 *
 * Host: root plays optional `enter`. Pointer phases only when set.
 * Defaults: empty. Does not steal child Input motion.
 */
import type { ForwardedRef } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

import {
  hasPointerPhases,
  useMotionPart,
  useOptionalEnterOnMount,
} from "@/components/core/utils/slotMotion";

import { useLabelMotionScope } from "./labelContext";
import type { LabelMotion, LabelPartMotion } from "./labelTypes";

export function resolveLabelMotionDefaults(): LabelMotion {
  return {};
}

export function useLabelRootMotion({
  forwardedRef,
  motion,
  onPointerOver,
  onPointerOut,
  onPointerDown,
  onPointerUp,
}: {
  forwardedRef?: ForwardedRef<HTMLElement>;
  motion?: LabelPartMotion;
  onPointerOver?: (e: ReactPointerEvent<HTMLElement>) => void;
  onPointerOut?: (e: ReactPointerEvent<HTMLElement>) => void;
  onPointerDown?: (e: ReactPointerEvent<HTMLElement>) => void;
  onPointerUp?: (e: ReactPointerEvent<HTMLElement>) => void;
}) {
  const scope = useLabelMotionScope();
  const pointer = hasPointerPhases(motion);
  const part = useMotionPart<HTMLElement>({
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
