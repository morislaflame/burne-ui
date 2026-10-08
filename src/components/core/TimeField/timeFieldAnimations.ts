/**
 * Slot motion for TimeField — look here first.
 *
 * DOM slots: `shell` (host), `prefix`, `suffix`, `segments`,
 * `label`, `hint`, `error` (Root scope — siblings of Control).
 *
 * Root passes the `motion` map. Host is `TimeField.Control` (defaults + `play`).
 * Chrome registers on the Root scope.
 *
 * Not slots: Field's own scope; `shellInner` /
 * `segmentGroup` / `segment` / `segmentSeparator` / `keyboardInput` (layout).
 */
import { useCallback, useMemo, useRef, type ForwardedRef, type MutableRefObject, type PointerEvent, type PointerEventHandler } from "react";
 
import { prefersReducedMotion } from "@/components/core/utils/reducedMotion";
import { shouldSkipInteractiveHoverLift } from "@/components/core/utils/hoverInteractiveLift";
import {
  hasPointerPhases,
  mergeMotionPointerHandlers,
  useMotionPart,
  useMotionPointerPhases,
  useOptionalEnterOnMount,
} from "@/components/core/utils/slotMotion";
import { useSecondLevelShadow } from "@/components/core/utils/useShadowMotion";
import { isKitVariant, overlaySkinMotion } from "@/skins/resolveVariantVisual";
 
import { useOptionalTimeFieldMotionScope, useTimeFieldMotionScope } from "./timeFieldContext";
import type {
  TimeFieldMotion,
  TimeFieldPartMotion,
  TimeFieldVariant,
  UseTimeFieldShellAnimationsProps,
} from "./timeFieldTypes";
import { KIT_TIME_FIELD_VARIANTS } from "./timeFieldTypes";
 
export function resolveTimeFieldMotionDefaults({
  variant,
  disabled,
}: {
  variant: TimeFieldVariant;
  disabled: boolean;
}): TimeFieldMotion {
  const active = !disabled;
  return overlaySkinMotion(
    {
      shell: {
        hoverIn: active ? "hoverLiftSecondLevel" : false,
        hoverOut: active ? "hoverLiftSecondLevel" : false,
        pressIn: active ? "pressSqueeze" : false,
        pressOut: false,
      },
    },
    variant,
    KIT_TIME_FIELD_VARIANTS,
    "timeField",
  );
}
 
export function resolveTimeFieldMotionParams({
  variant,
  disabled,
  pointerInside,
}: {
  variant: TimeFieldVariant;
  disabled: boolean;
  pointerInside: MutableRefObject<boolean>;
}) {
  return {
    shadowSize: "base" as const,
    hasHoverShadow: !disabled && isKitVariant(variant, KIT_TIME_FIELD_VARIANTS),
    pointerInside,
  };
}
 
export function useTimeFieldShellAnimations({
  shellRef,
  disabled,
  variant,
  motion,
  pointerInsideRef,
  onPointerDown,
}: UseTimeFieldShellAnimationsProps) {
  const scope = useTimeFieldMotionScope();
  const shellMotionRef = useRef(motion);
  // react-doctor-disable-next-line react-doctor/no-ref-current-in-render -- latest value so child layout effects see this render; an effect runs too late
  shellMotionRef.current = motion;
  const kitSurface = isKitVariant(variant, KIT_TIME_FIELD_VARIANTS);

  useOptionalEnterOnMount(scope, "shell", shellRef);

  const standardShellHover = useSecondLevelShadow(shellRef, !disabled && kitSurface, {
    interactive: false,
    pointerInsideRef,
  });

  const bindShellRef = useCallback(
    (node: HTMLFieldSetElement | null) => {
      shellRef.current = node;
      scope.registerTarget("shell", node);
    },
    [scope, shellRef],
  );

  const playShell = useCallback(
    (phase: "hoverIn" | "hoverOut" | "pressIn" | "pressOut") => {
      if (disabled) return;
      const el = shellRef.current;
      if (!el) return;
      const value = scope.resolve("shell", phase, shellMotionRef.current);
      if (value === undefined || value === false) return;
      scope.play("shell", phase, { partMotion: shellMotionRef.current, el });
    },
    [disabled, scope, shellRef],
  );

  const motionPointer = useMotionPointerPhases<HTMLFieldSetElement>({
    enabled: !disabled,
    targetRef: shellRef,
    pointerInsideRef,
    skipHover: shouldSkipInteractiveHoverLift,
    onHoverIn: () => playShell("hoverIn"),
    onHoverOut: () => playShell("hoverOut"),
  });
 
  const hoverHandlers = useMemo(
    () =>
      mergeMotionPointerHandlers(
        undefined,
        undefined,
        motionPointer.onPointerOver,
        motionPointer.onPointerOut,
      ),
    [motionPointer.onPointerOut, motionPointer.onPointerOver],
  );
 
  const handleShellPointerDown = useCallback(
    (e: PointerEvent<HTMLFieldSetElement>) => {
      onPointerDown?.(e);
      if (e.defaultPrevented || disabled) return;
      const shell = shellRef.current;
      if (!shell || prefersReducedMotion()) return;
      const pressIn = scope.resolve("shell", "pressIn", shellMotionRef.current);
      if (pressIn === false || pressIn === undefined) return;
      void scope.play("shell", "pressIn", {
        partMotion: shellMotionRef.current,
        el: shell,
      }).finished;
    },
    [disabled, onPointerDown, scope, shellRef],
  );

  return {
    bindShellRef,
    shellPointerDown: handleShellPointerDown,
    shellPointerUp: () => playShell("pressOut"),
    shellPointerEnter: hoverHandlers.onPointerOver,
    shellPointerLeave: hoverHandlers.onPointerOut,
    shellHoverMotionClass: kitSurface ? standardShellHover.motionClass : "",
  };
}
 
export type TimeFieldChromeSlot = "label" | "hint" | "error";
 
export function useTimeFieldChromeSlot(
  slot: TimeFieldChromeSlot,
  {
    motion,
    forwardedRef,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
  }: {
    motion?: TimeFieldPartMotion;
    forwardedRef?: ForwardedRef<HTMLElement>;
    onPointerOver?: PointerEventHandler<HTMLElement>;
    onPointerOut?: PointerEventHandler<HTMLElement>;
    onPointerDown?: PointerEventHandler<HTMLElement>;
    onPointerUp?: PointerEventHandler<HTMLElement>;
  } = {},
) {
  const scope = useOptionalTimeFieldMotionScope();
  const pointer = hasPointerPhases(motion ?? scope?.getRootMotion()?.[slot]);
  const part = useMotionPart<HTMLElement>({
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
 
 
