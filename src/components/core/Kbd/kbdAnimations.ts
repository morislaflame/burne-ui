import { useCallback, useMemo, useRef } from "react";

import {
  createGlossInteractiveRefCallback,
  GLOSS_INTERACTIVE_MOTION_CLASS,
  useGlossInteractiveHandlers,
} from "@/components/core/utils/glossInteractiveMotion";
import { mergeForwardedRef } from "@/components/core/utils/mergeRefs";
import { useSecondLevelShadow } from "@/components/core/utils/useShadowMotion";

import type { UseKbdAnimationsProps } from "./kbdTypes";

import "../utils/glossInteractive.css";

export function useKbdAnimations({
  variant,
  hoverLift = true,
  forwardedRef,
  onPointerOver: onPointerOverProp,
  onPointerOut: onPointerOutProp,
}: UseKbdAnimationsProps) {
  const rootRef = useRef<HTMLElement | null>(null);
  const isGloss = variant === "gloss";
  const liftEnabled = hoverLift;

  const bindGlossRef = useMemo(
    () => createGlossInteractiveRefCallback(rootRef, liftEnabled && isGloss),
    [isGloss, liftEnabled],
  );

  const glossHandlers = useGlossInteractiveHandlers(rootRef, liftEnabled && isGloss);
  const shadow = useSecondLevelShadow(rootRef, liftEnabled && !isGloss);

  const setMergedRef = useCallback(
    (node: HTMLElement | null) => {
      bindGlossRef(node);
      rootRef.current = node;
      mergeForwardedRef(forwardedRef, node);
    },
    [bindGlossRef, forwardedRef],
  );

  const pointerHandlers = useMemo(
    () => ({
      onPointerOver: (e: React.PointerEvent<HTMLElement>) => {
        onPointerOverProp?.(e);
        if (!liftEnabled || e.defaultPrevented) return;
        if (isGloss) glossHandlers.onPointerOver(e);
        else shadow.onPointerEnter(e);
      },
      onPointerOut: (e: React.PointerEvent<HTMLElement>) => {
        onPointerOutProp?.(e);
        if (!liftEnabled) return;
        if (isGloss) glossHandlers.onPointerOut(e);
        else shadow.onPointerLeave(e);
      },
    }),
    [
      glossHandlers.onPointerOut,
      glossHandlers.onPointerOver,
      isGloss,
      liftEnabled,
      onPointerOutProp,
      onPointerOverProp,
      shadow.onPointerEnter,
      shadow.onPointerLeave,
    ],
  );

  const motionClass =
    liftEnabled && !isGloss ? shadow.motionClass : "";

  const glossMotionClass =
    liftEnabled && isGloss ? GLOSS_INTERACTIVE_MOTION_CLASS : "";

  return {
    setMergedRef,
    motionClass,
    glossMotionClass,
    pointerHandlers,
  };
}
