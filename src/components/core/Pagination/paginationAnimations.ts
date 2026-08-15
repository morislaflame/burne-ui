import {
  useCallback,
  useLayoutEffect,
  useRef,
  type ForwardedRef,
  type ReactNode,
  type RefObject,
} from "react";

import { clearWillChangeOnComplete, gsap, killMotion, setWillChangeTransform } from "@/components/core/utils/gsapMotion";
import { usePrefersReducedMotion } from "@/components/core/utils/reducedMotion";
import { mergeForwardedRef } from "@/components/core/utils/mergeRefs";
import { isMotionFeatureEnabledFor, motionInteractiveFor } from "@/components/core/utils/motionConfig";
import { useMotionConfig } from "@/components/core/utils/motionConfigContext";

import type { PaginationMotion } from "./paginationTypes";

export type PaginationFlipIdentity = {
  /** Current page — primary trigger for FLIP when using `Pagination.Pages`. */
  page?: number;
  totalPages?: number;
  siblingCount?: number;
  /** Custom Content children — covers compound ranges without `Pagination.Pages`. */
  children?: ReactNode;
};

/**
 * FLIP page-list items when the visible range changes.
 * Runs only when `page` / list identity changes — not on every Content re-render.
 */
export function usePaginationFlip(
  olRef: RefObject<HTMLOListElement | null>,
  { page, totalPages, siblingCount, children }: PaginationFlipIdentity,
) {
  const config = useMotionConfig();
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
      reduceMotionPreferred || !isMotionFeatureEnabledFor(config, "enablePaginationFlip");
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
          setWillChangeTransform(el, true);
          void gsap.fromTo(
            el,
            { x: dx },
            {
              x: 0,
              ...motionInteractiveFor(config),
              overwrite: "auto",
              onComplete: clearWillChangeOnComplete(el),
            },
          );
        }
      } else {
        killMotion(el);
        setWillChangeTransform(el, true);
        void gsap.fromTo(
          el,
          { opacity: 0, scale: 0.82 },
          {
            opacity: 1,
            scale: 1,
            ...motionInteractiveFor(config),
            overwrite: "auto",
            onComplete: clearWillChangeOnComplete(el),
          },
        );
      }
    }

    prevRectsRef.current = nextRects;
    firstRunRef.current = false;
  }, [config, olRef, reduceMotionPreferred, page, totalPages, siblingCount, children]);

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
  flipIdentity: PaginationFlipIdentity,
) {
  const olRef = useRef<HTMLOListElement>(null);

  const setRefs = useCallback(
    (node: HTMLOListElement | null) => {
      olRef.current = node;
      mergeForwardedRef(forwardedRef, node);
    },
    [forwardedRef],
  );

  usePaginationFlip(olRef, flipIdentity);

  return { olRef, setRefs };
}

export function resolvePaginationControlMotionDefaults(): PaginationMotion {
  return {
    control: {
      pressIn: "pressSqueeze",
      pressOut: false,
    },
  };
}
