import { useCallback, useMemo, useRef, type ForwardedRef, type PointerEvent as ReactPointerEvent } from "react";

import { createGlossInteractiveRefCallback, GLOSS_INTERACTIVE_MOTION_CLASS, useGlossInteractiveHandlers } from "@/components/core/utils/glossInteractiveMotion";
import { useSecondLevelShadow } from "@/components/core/utils/useShadowMotion";
import { cn } from "@/utils/cn";

import { alertSurfaceClass } from "./alertStyles";
import type { AlertStatus, AlertVariant } from "./alertTypes";

import "../utils/glossInteractive.css";

export function useAlertAnimations({
  variant,
  status,
  hoverLift = true,
  ref,
  onPointerOver: onPointerOverProp,
  onPointerOut: onPointerOutProp,
}: {
  variant: AlertVariant;
  status: AlertStatus;
  hoverLift?: boolean;
  ref: ForwardedRef<HTMLDivElement>;
  onPointerOver?: (e: ReactPointerEvent<HTMLDivElement>) => void;
  onPointerOut?: (e: ReactPointerEvent<HTMLDivElement>) => void;
}) {
  const isGloss = variant === "gloss";
  const liftEnabled = hoverLift;
  const rootRef = useRef<HTMLDivElement | null>(null);

  const bindGlossRef = useMemo(
    () => createGlossInteractiveRefCallback(rootRef, liftEnabled && isGloss),
    [isGloss, liftEnabled],
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

  const glossPointerHandlers = useGlossInteractiveHandlers(rootRef, liftEnabled && isGloss);
  const secondLevelLift = useSecondLevelShadow(rootRef, liftEnabled && !isGloss);

  const motionClass = liftEnabled
    ? isGloss
      ? GLOSS_INTERACTIVE_MOTION_CLASS
      : secondLevelLift.motionClass
    : "";

  const surfaceClass = cn(alertSurfaceClass(variant, status), motionClass);

  const pointerHandlers = useMemo(
    () => ({
      onPointerOver: (e: ReactPointerEvent<HTMLDivElement>) => {
        onPointerOverProp?.(e);
        if (e.defaultPrevented || !liftEnabled) return;
        if (isGloss) glossPointerHandlers.onPointerOver(e);
        else secondLevelLift.onPointerEnter(e);
      },
      onPointerOut: (e: ReactPointerEvent<HTMLDivElement>) => {
        onPointerOutProp?.(e);
        if (!liftEnabled) return;
        if (isGloss) glossPointerHandlers.onPointerOut(e);
        else secondLevelLift.onPointerLeave(e);
      },
    }),
    [
      glossPointerHandlers.onPointerOut,
      glossPointerHandlers.onPointerOver,
      isGloss,
      liftEnabled,
      onPointerOutProp,
      onPointerOverProp,
      secondLevelLift.onPointerEnter,
      secondLevelLift.onPointerLeave,
    ],
  );

  return {
    setRootRef,
    surfaceClass,
    pointerHandlers,
  };
}
