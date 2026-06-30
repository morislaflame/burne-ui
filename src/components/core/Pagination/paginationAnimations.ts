import { useCallback, useLayoutEffect, useRef, type ForwardedRef } from "react";

import { gsap, killMotion } from "@/components/core/utils/gsapMotion";
import {
  animateInteractiveHoverLift,
  animateInteractivePressSqueeze,
  prefersReducedInteractiveHoverLift,
  shouldSkipInteractiveHoverLift,
} from "@/components/core/utils/hoverInteractiveLift";
import { getMotionConfig, motionInteractive } from "@/components/core/utils/motionConfig";

import type { UsePaginationInteractiveMotionProps } from "./paginationTypes";

export function usePaginationInteractiveMotion({
  disabled,
  onPointerEnter,
  onPointerLeave,
  onPointerDown,
}: UsePaginationInteractiveMotionProps) {
  const liftRef = useRef<HTMLSpanElement>(null);
  const hoverInsideRef = useRef(false);

  const handlePointerEnter = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      onPointerEnter?.(event);
      if (disabled) return;
      const el = liftRef.current;
      if (!el || shouldSkipInteractiveHoverLift()) return;
      hoverInsideRef.current = true;
      animateInteractiveHoverLift(el, true, getMotionConfig().hoverLiftScale);
    },
    [disabled, onPointerEnter],
  );

  const handlePointerLeave = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      onPointerLeave?.(event);
      hoverInsideRef.current = false;
      const el = liftRef.current;
      if (!el || shouldSkipInteractiveHoverLift()) return;
      animateInteractiveHoverLift(el, false, getMotionConfig().hoverLiftScale);
    },
    [onPointerLeave],
  );

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      onPointerDown?.(event);
      if (disabled || event.defaultPrevented) return;
      const el = liftRef.current;
      if (!el || prefersReducedInteractiveHoverLift()) return;
      void animateInteractivePressSqueeze(el).then(() => {
        const shell = liftRef.current;
        if (
          !shell ||
          shouldSkipInteractiveHoverLift() ||
          !hoverInsideRef.current
        ) {
          return;
        }
        animateInteractiveHoverLift(shell, true, getMotionConfig().hoverLiftScale);
      });
    },
    [disabled, onPointerDown],
  );

  return {
    liftRef,
    handlePointerEnter,
    handlePointerLeave,
    handlePointerDown,
  };
}

export function usePaginationFlip(
  olRef: React.RefObject<HTMLOListElement | null>,
) {
  const prevRectsRef = useRef<Map<string, { x: number; y: number }>>(null!);
  if (!prevRectsRef.current) prevRectsRef.current = new Map();
  const firstRunRef = useRef(true);

  useLayoutEffect(() => {
    const ol = olRef.current;
    if (!ol) return;

    const items = Array.from(ol.children).filter(
      (el): el is HTMLElement => el instanceof HTMLElement,
    );

    let keylessIndex = 0;
    const keyFor = (el: HTMLElement) =>
      el.dataset.flipKey ?? `__keyless_${keylessIndex++}`;

    const reduceMotion = prefersReducedInteractiveHoverLift();
    const nextRects = new Map<string, { x: number; y: number }>();
    const prevRects = prevRectsRef.current;

    for (const el of items) {
      const key = keyFor(el);
      const rect = el.getBoundingClientRect();
      const pos = { x: rect.left, y: rect.top };
      nextRects.set(key, pos);

      if (reduceMotion || firstRunRef.current) continue;

      const prev = prevRects.get(key);
      if (prev) {
        const dx = prev.x - pos.x;
        if (Math.abs(dx) > 0.5) {
          killMotion(el);
          el.style.willChange = "transform";
          void gsap.fromTo(
            el,
            { x: dx },
            {
              x: 0,
              ...motionInteractive(),
              overwrite: "auto",
              onComplete: () => {
                el.style.willChange = "";
              },
            },
          );
        }
      } else {
        killMotion(el);
        void gsap.fromTo(
          el,
          { autoAlpha: 0, scale: 0.82 },
          {
            autoAlpha: 1,
            scale: 1,
            ...motionInteractive(),
            overwrite: "auto",
          },
        );
      }
    }

    prevRectsRef.current = nextRects;
    firstRunRef.current = false;
  });

  useLayoutEffect(() => {
    const ol = olRef.current;
    return () => {
      if (!ol) return;
      for (const el of Array.from(ol.children)) {
        if (el instanceof HTMLElement) killMotion(el);
      }
    };
  }, [olRef]);
}

export function usePaginationContentRef(
  forwardedRef: ForwardedRef<HTMLOListElement>,
) {
  const olRef = useRef<HTMLOListElement>(null);

  const setRefs = useCallback(
    (node: HTMLOListElement | null) => {
      olRef.current = node;
      if (typeof forwardedRef === "function") forwardedRef(node);
      else if (forwardedRef) forwardedRef.current = node;
    },
    [forwardedRef],
  );

  usePaginationFlip(olRef);

  return { olRef, setRefs };
}
