/**
 * Slot motion for Alert — look here first.
 *
 * DOM slots: `root`, `indicator`, `title`, `description`, `action`
 * (not slots: `message`, `content` — `display: contents`)
 *
 * Host: root (`useAlertAnimations`) plays pointer `hoverIn` / `hoverOut`.
 * Defaults: `resolveAlertMotionDefaults` (hoverLift + second-level). A skin overlays its own recipes.
 */
import { useCallback, useMemo, useRef } from "react";

import { mergeForwardedRef } from "@/components/core/utils/mergeRefs";
import { shouldSkipInteractiveHoverLift } from "@/components/core/utils/hoverInteractiveLift";
import {
  mergeMotionPointerHandlers,
  useMotionPointerPhases,
  useOptionalEnterOnMount,
} from "@/components/core/utils/slotMotion";
import { useSecondLevelShadow } from "@/components/core/utils/useShadowMotion";
import { isKitVariant, overlaySkinMotion } from "@/skins/resolveVariantVisual";
import { cn } from "@/utils/cn";

import { useAlertMotionScope } from "./alertContext";
import { alertSurfaceClass } from "./alertStyles";
import type { AlertMotion, AlertVariant, UseAlertAnimationsProps } from "./alertTypes";
import { KIT_ALERT_VARIANTS } from "./alertTypes";

export function resolveAlertMotionDefaults({
  variant,
  hoverLift,
}: {
  variant: AlertVariant;
  hoverLift: boolean;
}): AlertMotion {
  const rootPhase = hoverLift ? "hoverLiftSecondLevel" : false;
  return overlaySkinMotion(
    { root: { hoverIn: rootPhase, hoverOut: rootPhase } },
    variant,
    KIT_ALERT_VARIANTS,
    "alert",
  );
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
  const rootRef = useRef<HTMLDivElement | null>(null);
  const scope = useAlertMotionScope();
  const rootMotionRef = useRef(motion?.root);
  // react-doctor-disable-next-line react-doctor/no-ref-current-in-render -- latest value so child layout effects see this render; an effect runs too late
  rootMotionRef.current = motion?.root;

  const hasHoverShadow = isKitVariant(variant, KIT_ALERT_VARIANTS) && hoverLift;

  const setRootRef = useCallback(
    (node: HTMLDivElement | null) => {
      rootRef.current = node;
      scope.registerTarget("root", node);
      mergeForwardedRef(ref, node);
    },
    [ref, scope],
  );

  useOptionalEnterOnMount(scope, "root", rootRef);

  const secondLevelLift = useSecondLevelShadow(rootRef, hasHoverShadow, {
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

  const motionClass = hasHoverShadow ? secondLevelLift.motionClass : "";
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
