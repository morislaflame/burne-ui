import { killMotion } from "@/components/core/utils/gsapMotion";
import { useCallback, useEffect, useLayoutEffect, useRef } from "react";

import { animateInteractivePressSqueeze, prefersReducedInteractiveHoverLift } from "@/components/core/utils/hoverInteractiveLift";

export function useSliderThumbShellAnimation(disabled?: boolean) {
  const shellRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;
    killMotion(shell);
    shell.style.opacity = disabled ? "0.48" : "1";
  }, [disabled]);

  return shellRef;
}

export function useSliderThumbPressAnimation({
  disabled,
  onPointerDown,
}: {
  disabled?: boolean;
  onPointerDown: (e: React.PointerEvent<HTMLButtonElement>) => void;
}) {
  const squeezeRef = useRef<HTMLButtonElement>(null);
  const reduceMotion = prefersReducedInteractiveHoverLift();

  useEffect(() => {
    const squeeze = squeezeRef.current;
    return () => {
      if (squeeze) killMotion(squeeze);
    };
  }, []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      onPointerDown(e);
      if (e.defaultPrevented || disabled) return;
      if (reduceMotion) return;
      const el = squeezeRef.current;
      if (!el) return;
      void animateInteractivePressSqueeze(el);
    },
    [disabled, onPointerDown, reduceMotion],
  );

  return { squeezeRef, handlePointerDown };
}

export function useSliderFillCleanup(fillRef: React.RefObject<HTMLSpanElement | null>) {
  useEffect(() => {
    const fill = fillRef.current;
    return () => {
      if (fill) killMotion(fill);
    };
  }, [fillRef]);
}

export function applySliderFillStyle(
  fill: HTMLSpanElement,
  style: { left?: string; width?: string; bottom?: string; height?: string },
  orientation: "horizontal" | "vertical",
) {
  killMotion(fill);
  fill.style.left = style.left ?? "";
  fill.style.width = style.width ?? "";
  fill.style.bottom = style.bottom ?? "";
  fill.style.height = style.height ?? "";
  if (orientation === "horizontal") {
    fill.style.bottom = "";
    fill.style.height = "";
  } else {
    fill.style.left = "";
    fill.style.width = "";
  }
}
