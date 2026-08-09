import { useCallback, useMemo, useRef } from "react";

import { createGlossInteractiveRefCallback, GLOSS_INTERACTIVE_MOTION_CLASS, useGlossInteractiveHandlers } from "@/components/core/utils/glossInteractiveMotion";
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

  const bindGlossRef = useMemo(
    () => createGlossInteractiveRefCallback(rootRef, hoverLift && isGloss),
    [isGloss, hoverLift],
  );

  const glossHandlers = useGlossInteractiveHandlers(rootRef, hoverLift && isGloss);
  // Rest elevation always on (non-gloss); hoverLift only toggles interactive motion.
  const shadow = useSecondLevelShadow(rootRef, !isGloss, {
    interactive: hoverLift,
  });

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
        if (!hoverLift || e.defaultPrevented) return;
        if (isGloss) glossHandlers.onPointerOver(e);
        else shadow.onPointerOver(e);
      },
      onPointerOut: (e: React.PointerEvent<HTMLElement>) => {
        onPointerOutProp?.(e);
        if (!hoverLift) return;
        if (isGloss) glossHandlers.onPointerOut(e);
        else shadow.onPointerOut(e);
      },
    }),
    [
      glossHandlers.onPointerOut,
      glossHandlers.onPointerOver,
      hoverLift,
      isGloss,
      onPointerOutProp,
      onPointerOverProp,
      shadow.onPointerOut,
      shadow.onPointerOver,
    ],
  );

  const motionClass = !isGloss ? shadow.motionClass : "";

  const glossMotionClass =
    hoverLift && isGloss ? GLOSS_INTERACTIVE_MOTION_CLASS : "";

  return {
    setMergedRef,
    motionClass,
    glossMotionClass,
    pointerHandlers,
  };
}
