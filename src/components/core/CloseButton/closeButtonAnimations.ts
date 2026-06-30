import { killMotion } from "@/components/core/utils/gsapMotion";
import {
  animateGlossInteractiveHoverLift,
  animateGlossInteractivePressSqueeze,
  createGlossInteractiveRefCallback,
} from "@/components/core/utils/glossInteractiveMotion";
import {
  animateInteractiveHoverLift,
  animateInteractivePressSqueeze,
  prefersReducedInteractiveHoverLift,
  shouldSkipInteractiveHoverLift,
} from "@/components/core/utils/hoverInteractiveLift";
import { firstLevelHoverShadow } from "@/components/core/utils/useShadowMotion";
import { useCallback, useEffect, useMemo, useRef } from "react";

import { CLOSE_BUTTON_HAS_HOVER_SHADOW } from "./closeButtonStyles";
import type { UseCloseButtonAnimationsProps } from "./closeButtonTypes";

export function useCloseButtonAnimations({
  variant,
  animated,
  disabled,
  forwardedRef,
  onPointerDown,
  onPointerEnter,
  onPointerLeave,
}: UseCloseButtonAnimationsProps) {
  const isGloss = variant === "gloss";
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const hoverPointerInsideRef = useRef(false);

  const bindGlossRef = useMemo(
    () => createGlossInteractiveRefCallback(btnRef, isGloss),
    [isGloss],
  );

  const setRefs = useCallback(
    (node: HTMLButtonElement | null) => {
      bindGlossRef(node);
      btnRef.current = node;
      if (typeof forwardedRef === "function") forwardedRef(node);
      else if (forwardedRef) forwardedRef.current = node;
    },
    [bindGlossRef, forwardedRef],
  );

  const btnShadow = useMemo(
    () =>
      CLOSE_BUTTON_HAS_HOVER_SHADOW.has(variant)
        ? firstLevelHoverShadow()
        : undefined,
    [variant],
  );

  useEffect(() => {
    const el = btnRef.current;
    if (!el) return;
    if (disabled) {
      killMotion(el);
      hoverPointerInsideRef.current = false;
      el.style.removeProperty("--el-shadow");
    }
  }, [disabled]);

  const handlePointerEnter = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      onPointerEnter?.(e);
      if (e.defaultPrevented || disabled) return;
      if (shouldSkipInteractiveHoverLift()) return;
      const el = btnRef.current;
      if (!el) return;
      hoverPointerInsideRef.current = true;
      if (isGloss) {
        animateGlossInteractiveHoverLift(el, true);
      } else {
        animateInteractiveHoverLift(el, true, undefined, btnShadow);
      }
    },
    [btnShadow, disabled, isGloss, onPointerEnter],
  );

  const handlePointerLeave = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      onPointerLeave?.(e);
      hoverPointerInsideRef.current = false;
      if (shouldSkipInteractiveHoverLift()) return;
      const el = btnRef.current;
      if (!el || disabled) return;
      if (isGloss) {
        animateGlossInteractiveHoverLift(el, false);
      } else {
        animateInteractiveHoverLift(el, false, undefined, btnShadow);
      }
    },
    [disabled, btnShadow, isGloss, onPointerLeave],
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      onPointerDown?.(e);
      if (e.defaultPrevented || disabled || !animated) return;
      if (prefersReducedInteractiveHoverLift()) return;
      const el = btnRef.current;
      if (!el) return;

      if (isGloss) {
        void animateGlossInteractivePressSqueeze(
          el,
          hoverPointerInsideRef.current,
        );
        return;
      }

      void animateInteractivePressSqueeze(el).then(() => {
        const b = btnRef.current;
        if (
          !b ||
          disabled ||
          !animated ||
          shouldSkipInteractiveHoverLift()
        )
          return;
        if (hoverPointerInsideRef.current) {
          animateInteractiveHoverLift(b, true, undefined, btnShadow);
        }
      });
    },
    [animated, btnShadow, disabled, isGloss, onPointerDown],
  );

  return {
    setRefs,
    handlePointerEnter,
    handlePointerLeave,
    handlePointerDown,
  };
}
