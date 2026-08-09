import { useCallback, useMemo, useRef, type ForwardedRef, type PointerEvent as ReactPointerEvent } from "react";

import { createGlossInteractiveRefCallback, GLOSS_INTERACTIVE_MOTION_CLASS, useGlossInteractiveHandlers } from "@/components/core/utils/glossInteractiveMotion";
import { useSecondLevelShadow } from "@/components/core/utils/useShadowMotion";
import { cn } from "@/utils/cn";

import { alertSurfaceClass } from "./alertStyles";
import type { AlertStatus, AlertVariant } from "./alertTypes";
import type { ShadowLevel } from "@/tokens/shadows";

import "../utils/glossInteractive.css";

export function useAlertAnimations({
  variant,
  status,
  hoverLift = true,
  shadow = "base",
  ref,
  onPointerOver: onPointerOverProp,
  onPointerOut: onPointerOutProp,
}: {
  variant: AlertVariant;
  status: AlertStatus;
  hoverLift?: boolean;
  shadow?: ShadowLevel;
  ref: ForwardedRef<HTMLDivElement>;
  onPointerOver?: (e: ReactPointerEvent<HTMLDivElement>) => void;
  onPointerOut?: (e: ReactPointerEvent<HTMLDivElement>) => void;
}) {
  const isGloss = variant === "gloss";
  const rootRef = useRef<HTMLDivElement | null>(null);

  const bindGlossRef = useMemo(
    () => createGlossInteractiveRefCallback(rootRef, hoverLift && isGloss),
    [isGloss, hoverLift],
  );

  const setRootRef = useCallback(
    (node: HTMLDivElement | null) => {
      bindGlossRef(node);
      rootRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [bindGlossRef, ref],
  );

  const glossPointerHandlers = useGlossInteractiveHandlers(rootRef, hoverLift && isGloss);
  // Rest elevation always on (non-gloss); hoverLift only toggles interactive motion.
  const secondLevelLift = useSecondLevelShadow(rootRef, !isGloss, {
    shadowSize: shadow,
    interactive: hoverLift,
  });

  const motionClass = isGloss
    ? hoverLift
      ? GLOSS_INTERACTIVE_MOTION_CLASS
      : ""
    : secondLevelLift.motionClass;

  const surfaceClass = cn(alertSurfaceClass(variant, status), motionClass);

  const pointerHandlers = useMemo(
    () => ({
      onPointerOver: (e: ReactPointerEvent<HTMLDivElement>) => {
        onPointerOverProp?.(e);
        if (e.defaultPrevented || !hoverLift) return;
        if (isGloss) glossPointerHandlers.onPointerOver(e);
        else secondLevelLift.onPointerOver(e);
      },
      onPointerOut: (e: ReactPointerEvent<HTMLDivElement>) => {
        onPointerOutProp?.(e);
        if (!hoverLift) return;
        if (isGloss) glossPointerHandlers.onPointerOut(e);
        else secondLevelLift.onPointerOut(e);
      },
    }),
    [
      glossPointerHandlers.onPointerOut,
      glossPointerHandlers.onPointerOver,
      hoverLift,
      isGloss,
      onPointerOutProp,
      onPointerOverProp,
      secondLevelLift.onPointerOut,
      secondLevelLift.onPointerOver,
    ],
  );

  return {
    setRootRef,
    surfaceClass,
    pointerHandlers,
  };
}
