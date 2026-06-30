import { useCallback, type PointerEvent, type RefObject } from "react";

import { useGlossFieldShellMotion } from "@/components/core/utils/glossInteractiveMotion";
import {
  animateInteractivePressSqueeze,
  prefersReducedInteractiveHoverLift,
} from "@/components/core/utils/hoverInteractiveLift";
import { useFieldShellHoverLift } from "@/components/core/utils/useFieldShellHoverLift";

import type { TimeFieldVariant } from "./timeFieldTypes";

export function useTimeFieldShellMotion({
  shellRef,
  disabled,
  variant,
  onPointerDown,
  onPointerEnter,
  onPointerLeave,
}: {
  shellRef: RefObject<HTMLFieldSetElement | null>;
  disabled: boolean;
  variant: TimeFieldVariant;
  onPointerDown?: (e: PointerEvent<HTMLFieldSetElement>) => void;
  onPointerEnter?: (e: PointerEvent<HTMLFieldSetElement>) => void;
  onPointerLeave?: (e: PointerEvent<HTMLFieldSetElement>) => void;
}) {
  const isGloss = variant === "gloss";
  const shellHoverLift = useFieldShellHoverLift(shellRef, !disabled && !isGloss);
  const glossShellMotion = useGlossFieldShellMotion(shellRef, !disabled && isGloss);

  const bindShellRef = useCallback(
    (node: HTMLFieldSetElement | null, setShellRef: (node: HTMLFieldSetElement | null) => void) => {
      setShellRef(node);
      if (!disabled && isGloss) glossShellMotion.bindShellRef(node);
    },
    [disabled, glossShellMotion, isGloss],
  );

  const handleShellPointerDown = useCallback(
    (e: PointerEvent<HTMLFieldSetElement>) => {
      onPointerDown?.(e);
      if (e.defaultPrevented || disabled || isGloss) return;
      const shell = shellRef.current;
      if (!shell || prefersReducedInteractiveHoverLift()) return;
      void animateInteractivePressSqueeze(shell);
    },
    [disabled, isGloss, onPointerDown, shellRef],
  );

  const handlePointerEnter = useCallback(
    (e: PointerEvent<HTMLFieldSetElement>) => {
      onPointerEnter?.(e);
      if (e.defaultPrevented) return;
      if (isGloss) glossShellMotion.onShellPointerEnter(e);
      else shellHoverLift.onShellPointerEnter(e);
    },
    [glossShellMotion, isGloss, onPointerEnter, shellHoverLift],
  );

  const handlePointerLeave = useCallback(
    (e: PointerEvent<HTMLFieldSetElement>) => {
      onPointerLeave?.(e);
      if (isGloss) glossShellMotion.onShellPointerLeave(e);
      else shellHoverLift.onShellPointerLeave(e);
    },
    [glossShellMotion, isGloss, onPointerLeave, shellHoverLift],
  );

  return {
    isGloss,
    bindShellRef,
    shellPointerDown:
      isGloss && !disabled ? glossShellMotion.onShellPointerDown : handleShellPointerDown,
    shellPointerEnter: handlePointerEnter,
    shellPointerLeave: handlePointerLeave,
    shellFocusCapture: isGloss && !disabled ? glossShellMotion.onShellFocusIn : undefined,
    shellBlurCapture: isGloss && !disabled ? glossShellMotion.onShellFocusOut : undefined,
    glossShellHoverMotionClass: glossShellMotion.shellHoverMotionClass,
    standardShellHoverMotionClass: shellHoverLift.shellHoverMotionClass,
  };
}
