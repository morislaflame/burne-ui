/**
 * Slot motion for TimeField — look here first.
 *
 * DOM slots: `shell` (host), `prefix`, `suffix`, `segments`
 *
 * Root passes the `motion` map. Host is `TimeField.Control` (defaults + `play`).
 * Gloss hover/press stay on `useGlossFieldShellMotion`.
 *
 * Not slots: Field `root` / `label` / `hint` / `error`; `shellInner` /
 * `segmentGroup` / `segment` / `segmentSeparator` / `keyboardInput` (layout).
 */
import { useCallback, useMemo, useRef, type MutableRefObject, type PointerEvent } from "react";

import { prefersReducedMotion } from "@/components/core/utils/reducedMotion";
import { useGlossFieldShellMotion } from "@/components/core/utils/glossInteractiveMotion";
import { shouldSkipInteractiveHoverLift } from "@/components/core/utils/hoverInteractiveLift";
import {
  mergeMotionPointerHandlers,
  useMotionPointerPhases,
  type MotionValue,
} from "@/components/core/utils/slotMotion";
import { useSecondLevelShadow } from "@/components/core/utils/useShadowMotion";

import { useTimeFieldMotionScope } from "./timeFieldContext";
import type {
  TimeFieldMotion,
  UseTimeFieldShellAnimationsProps,
} from "./timeFieldTypes";

import "../utils/glossInteractive.css";

function isKitPressSqueeze(value: MotionValue | undefined): boolean {
  if (typeof value === "string") {
    return value === "pressSqueeze" || value === "pressSqueezeGloss";
  }
  if (value && typeof value === "object" && "recipe" in value) {
    const recipe = (value as { recipe?: unknown }).recipe;
    return recipe === "pressSqueeze" || recipe === "pressSqueezeGloss";
  }
  return false;
}

export function resolveTimeFieldMotionDefaults({
  isGloss,
  disabled,
}: {
  isGloss: boolean;
  disabled: boolean;
}): TimeFieldMotion {
  const hover = !disabled && !isGloss;
  const press = !disabled && !isGloss;
  return {
    shell: {
      hoverIn: hover ? "hoverLiftSecondLevel" : false,
      hoverOut: hover ? "hoverLiftSecondLevel" : false,
      pressIn: press ? "pressSqueeze" : false,
      pressOut: false,
    },
  };
}

export function resolveTimeFieldMotionParams({
  disabled,
  isGloss,
  pointerInside,
}: {
  disabled: boolean;
  isGloss: boolean;
  pointerInside: MutableRefObject<boolean>;
}) {
  return {
    shadowSize: "base" as const,
    hasHoverShadow: !disabled && !isGloss,
    isGloss,
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
  shellMotionRef.current = motion;
  const isGloss = variant === "gloss";

  const standardShellHover = useSecondLevelShadow(shellRef, !disabled && !isGloss, {
    interactive: false,
    pointerInsideRef,
  });
  const glossShellMotion = useGlossFieldShellMotion(shellRef, !disabled && isGloss);

  const bindShellRef = useCallback(
    (node: HTMLFieldSetElement | null) => {
      shellRef.current = node;
      scope.registerTarget("shell", node);
      if (!disabled && isGloss) glossShellMotion.bindShellRef(node);
    },
    [disabled, glossShellMotion, isGloss, scope, shellRef],
  );

  const playShell = useCallback(
    (phase: "hoverIn" | "hoverOut" | "pressIn" | "pressOut") => {
      if (disabled || isGloss) return;
      const el = shellRef.current;
      if (!el) return;
      const value = scope.resolve("shell", phase, shellMotionRef.current);
      if (value === undefined) return;
      scope.play("shell", phase, { partMotion: shellMotionRef.current, el });
    },
    [disabled, isGloss, scope, shellRef],
  );

  const motionPointer = useMotionPointerPhases<HTMLFieldSetElement>({
    enabled: !disabled && !isGloss,
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
      if (isGloss) {
        glossShellMotion.onShellPointerDown();
        return;
      }
      const pressIn = scope.resolve("shell", "pressIn", shellMotionRef.current);
      if (pressIn === false || pressIn === undefined) return;
      if (isKitPressSqueeze(pressIn) || pressIn) {
        void scope.play("shell", "pressIn", {
          partMotion: shellMotionRef.current,
          el: shell,
        }).finished;
      }
    },
    [disabled, glossShellMotion, isGloss, onPointerDown, scope, shellRef],
  );

  return {
    isGloss,
    bindShellRef,
    shellPointerDown: handleShellPointerDown,
    shellPointerUp: () => playShell("pressOut"),
    shellPointerEnter: isGloss ? glossShellMotion.onShellPointerEnter : hoverHandlers.onPointerOver,
    shellPointerLeave: isGloss ? glossShellMotion.onShellPointerLeave : hoverHandlers.onPointerOut,
    shellFocusCapture: isGloss && !disabled ? glossShellMotion.onShellFocusIn : undefined,
    shellBlurCapture: isGloss && !disabled ? glossShellMotion.onShellFocusOut : undefined,
    glossShellHoverMotionClass: glossShellMotion.shellHoverMotionClass,
    standardShellHoverMotionClass: standardShellHover.motionClass,
    glossDisabledAttr: disabled && isGloss ? { "data-gloss-disabled": "" } : {},
  };
}

