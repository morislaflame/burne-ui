import { animateInteractivePressSqueeze } from "@/components/core/utils/hoverInteractiveLift";
import { prefersReducedMotion } from "@/components/core/utils/reducedMotion";
import { mergeForwardedRef } from "@/components/core/utils/mergeRefs";
import { isMotionFeatureEnabled } from "@/components/core/utils/motionConfig";
import { useChevronRotation } from "@/components/core/utils/useChevronRotation";
import { useCollapsibleHeight, useCollapsibleShellRef } from "@/components/core/utils/useCollapsibleHeight";
import { useCallback, useRef } from "react";

import type { UseExpandableTriggerMotionProps } from "./expandableTypes";

export function useExpandableTriggerMotion({
  open,
  disabled,
  toggle,
  forwardedRef,
  onClick,
  onKeyDown,
  onPointerDown,
}: UseExpandableTriggerMotionProps) {
  const liftSpanRef = useRef<HTMLSpanElement | null>(null);
  const chevronRef = useRef<HTMLSpanElement | null>(null);

  const bindChevronRef = useChevronRotation(
    open,
    chevronRef,
    () => isMotionFeatureEnabled("enableExpandable"),
  );

  const setTriggerRef = useCallback(
    (node: HTMLButtonElement | null) => {
      mergeForwardedRef(forwardedRef, node);
    },
    [forwardedRef],
  );

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
      if (e.defaultPrevented || disabled) return;
      toggle();
    },
    [disabled, onClick, toggle],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      onKeyDown?.(e);
      if (e.defaultPrevented || disabled) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggle();
      }
    },
    [disabled, onKeyDown, toggle],
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      if (!disabled) {
        const span = liftSpanRef.current;
        if (span && !prefersReducedMotion()) {
          void animateInteractivePressSqueeze(span);
        }
      }
      onPointerDown?.(e);
    },
    [disabled, onPointerDown],
  );

  return {
    liftSpanRef,
    bindChevronRef,
    setTriggerRef,
    handleClick,
    handleKeyDown,
    handlePointerDown,
  };
}

export function useExpandablePanelMotion(open: boolean) {
  const shellRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const bindShellRef = useCollapsibleShellRef(shellRef, open);

  useCollapsibleHeight(open, shellRef, innerRef);

  return { shellRef, innerRef, bindShellRef };
}
