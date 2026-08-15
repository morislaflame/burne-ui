/**
 * Slot motion for ColorSlider — look here first.
 *
 * DOM slots: `root`, `track`
 *
 * Not slots: thumb (SliderThumbButton; no Slider scope outside Slider).
 * Host: Track plays optional `enter` and `change` on value. Thumb percent is kit-internal.
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

import { useOptionalColorSliderMotionScope } from "./colorSliderContext";
import type { ColorSliderMotion, ColorSliderPartMotion } from "./colorSliderTypes";

export function resolveColorSliderMotionDefaults(): ColorSliderMotion {
  return {};
}

export { mergeMotionSlotMaps };

export function useColorSliderTrackMotion({
  motion,
  forwardedRef,
  valueIdentity,
  onPointerOver,
  onPointerOut,
  onPointerDown,
  onPointerUp,
}: {
  motion?: ColorSliderPartMotion;
  forwardedRef?: ForwardedRef<HTMLDivElement>;
  valueIdentity: number;
  onPointerOver?: (e: ReactPointerEvent<HTMLDivElement>) => void;
  onPointerOut?: (e: ReactPointerEvent<HTMLDivElement>) => void;
  onPointerDown?: (e: ReactPointerEvent<HTMLDivElement>) => void;
  onPointerUp?: (e: ReactPointerEvent<HTMLDivElement>) => void;
}) {
  const scope = useOptionalColorSliderMotionScope();
  const pointer = hasPointerPhases(motion ?? scope?.getRootMotion()?.track);
  const part = useMotionPart<HTMLDivElement>({
    scope,
    slot: "track",
    motion,
    forwardedRef,
    pointerPhases: pointer,
    pressPhases: pointer,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
  });
  useOptionalEnterOnMount(scope, "track", part.targetRef);
  useSlotPhaseOnChange(scope, "track", valueIdentity, {
    phase: "change",
    target: part.targetRef,
  });
  return part;
}

export function useColorSliderRootMotion({
  motion,
  forwardedRef,
}: {
  motion?: ColorSliderPartMotion;
  forwardedRef?: ForwardedRef<HTMLDivElement>;
}) {
  const scope = useOptionalColorSliderMotionScope();
  const pointer = hasPointerPhases(motion ?? scope?.getRootMotion()?.root);
  const part = useMotionPart<HTMLDivElement>({
    scope,
    slot: "root",
    motion,
    forwardedRef,
    pointerPhases: pointer,
    pressPhases: pointer,
  });
  useOptionalEnterOnMount(scope, "root", part.targetRef);
  return part;
}
