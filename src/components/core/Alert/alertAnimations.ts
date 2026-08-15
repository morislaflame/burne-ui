/**
 * Slot motion for Alert — look here first.
 *
 * DOM slots: `root`, `indicator`, `title`, `description`, `action`
 * (not slots: `message`, `content` — `display: contents`)
 *
 * Host: root (`useAlertAnimations`) plays pointer `hoverIn` / `hoverOut`.
 * Defaults: `resolveAlertMotionDefaults` (hoverLift + variant → kit recipe).
 */
import { useCallback, useMemo, useRef } from "react";

import { createGlossInteractiveRefCallback, GLOSS_INTERACTIVE_MOTION_CLASS } from "@/components/core/utils/glossInteractiveMotion";
import { mergeForwardedRef } from "@/components/core/utils/mergeRefs";
import { shouldSkipInteractiveHoverLift } from "@/components/core/utils/hoverInteractiveLift";
import { mergeMotionPointerHandlers, useMotionPointerPhases } from "@/components/core/utils/slotMotion";
import { useSecondLevelShadow } from "@/components/core/utils/useShadowMotion";
import { cn } from "@/utils/cn";

import { useAlertMotionScope } from "./alertContext";
import { alertSurfaceClass } from "./alertStyles";
import type { AlertMotion, AlertVariant, UseAlertAnimationsProps } from "./alertTypes";

import "../utils/glossInteractive.css";

export function resolveAlertMotionDefaults({
  variant,
  hoverLift,
}: {
  variant: AlertVariant;
  hoverLift: boolean;
}): AlertMotion {
  const recipe = variant === "gloss" ? "hoverLiftGloss" : "hoverLiftSecondLevel";
  const rootPhase = hoverLift ? recipe : false;
  return { root: { hoverIn: rootPhase, hoverOut: rootPhase } };
}

export function useAlertAnimations({
  variant,
  status,
  hoverLift = true,
  shadow = "base",
  motion,
  ref,
  onPointerOver: onPointerOverProp,
  onPointerOut: onPointerOutProp,
}: UseAlertAnimationsProps) {
  const isGloss = variant === "gloss";
  const rootRef = useRef<HTMLDivElement | null>(null);
  const scope = useAlertMotionScope();
  const rootMotionRef = useRef(motion?.root);
  rootMotionRef.current = motion?.root;

  const glossEnabled = isGloss && (hoverLift || motion?.root != null);
  const bindGlossRef = useMemo(
    () => createGlossInteractiveRefCallback(rootRef, glossEnabled),
    [glossEnabled],
  );

  const setRootRef = useCallback(
    (node: HTMLDivElement | null) => {
      bindGlossRef(node);
      rootRef.current = node;
      scope.registerTarget("root", node);
      mergeForwardedRef(ref, node);
    },
    [bindGlossRef, ref, scope],
  );

  const secondLevelLift = useSecondLevelShadow(rootRef, !isGloss, {
    shadowSize: shadow,
    interactive: false,
  });

  const motionPointer = useMotionPointerPhases<HTMLDivElement>({
    enabled: true,
    targetRef: rootRef,
    skipHover: shouldSkipInteractiveHoverLift,
    onHoverIn: (el) => {
      const value = scope.resolve("root", "hoverIn", rootMotionRef.current);
      if (value === undefined) return;
      scope.play("root", "hoverIn", { partMotion: rootMotionRef.current, el });
    },
    onHoverOut: (el) => {
      const value = scope.resolve("root", "hoverOut", rootMotionRef.current);
      if (value === undefined) return;
      scope.play("root", "hoverOut", { partMotion: rootMotionRef.current, el });
    },
  });

  const motionClass = isGloss
    ? glossEnabled
      ? GLOSS_INTERACTIVE_MOTION_CLASS
      : ""
    : secondLevelLift.motionClass;

  const surfaceClass = cn(alertSurfaceClass(variant, status), motionClass);

  const pointerHandlers = useMemo(
    () =>
      mergeMotionPointerHandlers(
        onPointerOverProp,
        onPointerOutProp,
        motionPointer.onPointerOver,
        motionPointer.onPointerOut,
      ),
    [motionPointer.onPointerOut, motionPointer.onPointerOver, onPointerOutProp, onPointerOverProp],
  );

  return {
    setRootRef,
    surfaceClass,
    pointerHandlers,
  };
}
