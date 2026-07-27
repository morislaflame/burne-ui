import { useCallback, useLayoutEffect, useRef, type ForwardedRef } from "react";

import { gsap, killMotion } from "@/components/core/utils/gsapMotion";
import { usePrefersReducedMotion } from "@/components/core/utils/reducedMotion";
import { mergeForwardedRef } from "@/components/core/utils/mergeRefs";
import { isMotionFeatureEnabled, motionInteractive } from "@/components/core/utils/motionConfig";

export function usePaginationFlip(
  olRef: React.RefObject<HTMLOListElement | null>,
) {
  const prevRectsRef = useRef<Map<string, { x: number; y: number }>>(null!);
  if (!prevRectsRef.current) prevRectsRef.current = new Map();
  const firstRunRef = useRef(true);
  const reduceMotionPreferred = usePrefersReducedMotion();

  useLayoutEffect(() => {
    const ol = olRef.current;
    if (!ol) return;

    const items = Array.from(ol.children).filter(
      (el): el is HTMLElement => el instanceof HTMLElement,
    );

    let keylessIndex = 0;
    const keyFor = (el: HTMLElement) =>
      el.dataset.flipKey ?? `__keyless_${keylessIndex++}`;

    const reduceMotion =
      reduceMotionPreferred || !isMotionFeatureEnabled("enablePaginationFlip");
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
      mergeForwardedRef(forwardedRef, node);
    },
    [forwardedRef],
  );

  usePaginationFlip(olRef);

  return { olRef, setRefs };
}
