import { killMotion } from "@/components/core/utils/gsapMotion";
import { mergeForwardedRef, mergeRefs } from "@/components/core/utils/mergeRefs";
import {
  animateInteractiveHoverLift,
  animateInteractivePressSqueeze,
  prefersReducedInteractiveHoverLift,
  shouldSkipInteractiveHoverLift,
} from "@/components/core/utils/hoverInteractiveLift";
import { getMotionConfig } from "@/components/core/utils/motionConfig";
import { useChevronRotation } from "@/components/core/utils/useChevronRotation";
import { useCallback, useEffect, useRef } from "react";

import type { UseDisclosureTriggerMotionProps } from "./disclosureTypes";

export function useDisclosureTriggerMotion({
  open,
  disabled,
  setOpen,
  chevronRef,
  skipContentAnimRef,
  forwardedRef,
  onClick,
  onKeyDown,
  onPointerEnter,
  onPointerLeave,
  onPointerDown,
}: UseDisclosureTriggerMotionProps) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const titleLiftRef = useRef<HTMLSpanElement>(null);
  const hoverInsideRef = useRef(false);

  const setRefs = useCallback(
    (node: HTMLButtonElement | null) => {
      btnRef.current = node;
      mergeForwardedRef(forwardedRef, node);
    },
    [forwardedRef],
  );

  const bindChevronRef = useChevronRotation(
    open,
    chevronRef,
    () => getMotionConfig().enableExpandable,
    skipContentAnimRef,
  );

  useEffect(() => {
    const el = titleLiftRef.current;
    return () => {
      if (el) killMotion(el);
    };
  }, []);

  useEffect(() => {
    if (!disabled) return;
    hoverInsideRef.current = false;
    const el = titleLiftRef.current;
    if (el) killMotion(el);
  }, [disabled]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e);
      if (e.defaultPrevented || disabled) return;
      setOpen(!open);
    },
    [disabled, onClick, open, setOpen],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      onKeyDown?.(e);
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (!disabled) setOpen(!open);
      }
    },
    [disabled, onKeyDown, open, setOpen],
  );

  const handlePointerEnter = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      onPointerEnter?.(e);
      if (e.defaultPrevented || disabled) return;
      hoverInsideRef.current = true;
      const el = titleLiftRef.current;
      if (!el || shouldSkipInteractiveHoverLift()) return;
      animateInteractiveHoverLift(el, true);
    },
    [disabled, onPointerEnter],
  );

  const handlePointerLeave = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      onPointerLeave?.(e);
      hoverInsideRef.current = false;
      const el = titleLiftRef.current;
      if (!el || shouldSkipInteractiveHoverLift()) return;
      animateInteractiveHoverLift(el, false);
    },
    [onPointerLeave],
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      onPointerDown?.(e);
      if (e.defaultPrevented || disabled) return;
      const el = titleLiftRef.current;
      if (!el || prefersReducedInteractiveHoverLift()) return;
      void animateInteractivePressSqueeze(el, {
        pointerInside: hoverInsideRef.current,
      });
    },
    [disabled, onPointerDown],
  );

  return {
    setRefs,
    titleLiftRef,
    bindChevronRef,
    handleClick,
    handleKeyDown,
    handlePointerEnter,
    handlePointerLeave,
    handlePointerDown,
    mergeRefs,
  };
}
