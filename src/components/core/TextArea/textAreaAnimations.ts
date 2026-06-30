import { useCallback, type PointerEvent, type RefObject } from "react";

import { useGlossFieldShellMotion } from "@/components/core/utils/glossInteractiveMotion";
import {
  animateInteractivePressSqueeze,
  prefersReducedInteractiveHoverLift,
} from "@/components/core/utils/hoverInteractiveLift";
import { useFieldShellHoverLift } from "@/components/core/utils/useFieldShellHoverLift";

import type { TextAreaVariant } from "./textAreaTypes";

export function useTextAreaShellMotion({
  shellRef,
  blocked,
  variant,
  resizable,
  onPointerDown,
}: {
  shellRef: RefObject<HTMLDivElement | null>;
  blocked: boolean;
  variant: TextAreaVariant;
  resizable: boolean;
  onPointerDown?: (e: PointerEvent<HTMLDivElement>) => void;
}) {
  const isGloss = variant === "gloss";
  const standardShellHover = useFieldShellHoverLift(shellRef, !blocked && !isGloss);
  const glossShellMotion = useGlossFieldShellMotion(shellRef, !blocked && isGloss);

  const setShellRef = useCallback(
    (node: HTMLDivElement | null) => {
      shellRef.current = node;
      if (node && !resizable) node.style.removeProperty("height");
      if (!blocked && isGloss) glossShellMotion.bindShellRef(node);
    },
    [blocked, glossShellMotion, isGloss, resizable, shellRef],
  );

  const handleShellPointerDown = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      onPointerDown?.(e);
      if (e.defaultPrevented || blocked) return;
      const target = e.target;
      if (target instanceof HTMLElement && target.closest("[data-textarea-resize-handle]")) {
        return;
      }
      const shell = shellRef.current;
      if (!shell || prefersReducedInteractiveHoverLift()) return;
      if (isGloss) {
        glossShellMotion.onShellPointerDown();
        return;
      }
      void animateInteractivePressSqueeze(shell);
    },
    [blocked, glossShellMotion, isGloss, onPointerDown, shellRef],
  );

  return {
    isGloss,
    setShellRef,
    shellPointerDown: handleShellPointerDown,
    shellPointerEnter: isGloss
      ? glossShellMotion.onShellPointerEnter
      : standardShellHover.onShellPointerEnter,
    shellPointerLeave: isGloss
      ? glossShellMotion.onShellPointerLeave
      : standardShellHover.onShellPointerLeave,
    shellFocusCapture: isGloss ? glossShellMotion.onShellFocusIn : undefined,
    shellBlurCapture: isGloss ? glossShellMotion.onShellFocusOut : undefined,
    glossShellHoverMotionClass: glossShellMotion.shellHoverMotionClass,
    standardShellHoverMotionClass: standardShellHover.shellHoverMotionClass,
  };
}
