import { killMotion } from "@/components/core/utils/gsapMotion";
import { useGlossFieldShellMotion } from "@/components/core/utils/glossInteractiveMotion";
import { animateInteractivePressSqueeze } from "@/components/core/utils/hoverInteractiveLift";
import { prefersReducedMotion } from "@/components/core/utils/reducedMotion";
import { useFieldShellHoverLift } from "@/components/core/utils/useFieldShellHoverLift";
import { motionInteractive } from "@/components/core/utils/motionConfig";
import { gsap } from "@/components/core/utils/gsapMotion";
import { useCallback, type PointerEvent, type RefObject } from "react";

import type { InputVariant } from "./inputTypes";

export function animateInputFileRowExit(rowEl: HTMLElement): Promise<void> {
  killMotion(rowEl);
  return new Promise((resolve) => {
    gsap.to(rowEl, {
      scale: 0.94,
      y: "-0.5rem",
      autoAlpha: 0,
      ...motionInteractive(),
      overwrite: "auto",
      onComplete: () => {
        killMotion(rowEl);
        resolve();
      },
    });
  });
}

export function useInputShellMotion({
  shellRef,
  blocked,
  variant,
  groupSegment,
  onPointerDown,
}: {
  shellRef: RefObject<HTMLDivElement | null>;
  blocked: boolean;
  variant: InputVariant;
  groupSegment: unknown;
  onPointerDown?: (e: PointerEvent<HTMLDivElement>) => void;
}) {
  const isGloss = variant === "gloss";
  const standardShellHover = useFieldShellHoverLift(
    shellRef,
    !blocked && !isGloss && groupSegment == null,
  );
  const glossShellMotion = useGlossFieldShellMotion(
    shellRef,
    !blocked && isGloss && groupSegment == null,
  );

  const setShellRef = useCallback(
    (node: HTMLDivElement | null) => {
      shellRef.current = node;
      if (!blocked && isGloss) glossShellMotion.bindShellRef(node);
    },
    [blocked, glossShellMotion, isGloss, shellRef],
  );

  const handleShellPointerDown = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      onPointerDown?.(e);
      if (e.defaultPrevented || blocked || isGloss || groupSegment != null) return;
      const shell = shellRef.current;
      if (!shell || prefersReducedMotion()) return;
      void animateInteractivePressSqueeze(shell);
    },
    [blocked, groupSegment, isGloss, onPointerDown, shellRef],
  );

  return {
    isGloss,
    setShellRef,
    handleShellPointerDown,
    shellPointerDown: isGloss && !blocked
      ? glossShellMotion.onShellPointerDown
      : handleShellPointerDown,
    shellPointerEnter:
      isGloss && !blocked
        ? glossShellMotion.onShellPointerEnter
        : standardShellHover.onShellPointerEnter,
    shellPointerLeave:
      isGloss && !blocked
        ? glossShellMotion.onShellPointerLeave
        : standardShellHover.onShellPointerLeave,
    shellFocusCapture:
      isGloss && !blocked ? glossShellMotion.onShellFocusIn : undefined,
    shellBlurCapture:
      isGloss && !blocked ? glossShellMotion.onShellFocusOut : undefined,
    shellHoverMotionClass: isGloss
      ? glossShellMotion.shellHoverMotionClass
      : standardShellHover.shellHoverMotionClass,
    glossDisabledAttr: blocked && isGloss ? { "data-gloss-disabled": "" } : {},
  };
}
