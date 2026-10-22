/**
 * Kit-internal FLIP for the Pagination pages list (`usePaginationFlip`).
 * Public slots: `previous`, `next`, `page` (repeated), `pageActive`,
 * `previousIcon` / `nextIcon`, `summary` (`change` when `page` moves), `ellipsis`.
 * All of them register on the root scope, on the same node as `classNames`.
 * Press on a nav button plays that button and the icon inside it.
 * FLIP on `<ol>` stays kit-internal (`usePaginationFlip`).
 * Not slots: `content` / `item` / `pageText`.
 */
import {
  useCallback,
  useLayoutEffect,
  useRef,
  type ForwardedRef,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type RefObject,
} from "react";
 
import { clearWillChangeOnComplete, gsap, killMotion, setWillChangeTransform } from "@/components/core/utils/gsapMotion";
import { usePrefersReducedMotion } from "@/components/core/utils/reducedMotion";
import { mergeForwardedRef } from "@/components/core/utils/mergeRefs";
import { isMotionFeatureEnabledFor, motionInteractiveFor } from "@/components/core/utils/motionConfig";
import { useMotionConfig } from "@/components/core/utils/motionConfigContext";
import { hasPointerPhases, useMotionPart, useOptionalEnterOnMount, useSlotPhaseOnChange } from "@/components/core/utils/slotMotion";
import type { MotionScopeValue } from "@/components/core/utils/slotMotion";
 
import {
  useOptionalPagination,
  useOptionalPaginationMotionScope,
} from "./paginationContext";
import type { PaginationButtonSlot, PaginationMotion, PaginationPartMotion, PaginationSummaryPartMotion } from "./paginationTypes";

import { bindLiftRecipes } from "@/components/core/utils/slotMotion/recipes/bindLift";

bindLiftRecipes();
 
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
    const tweens: gsap.core.Tween[] = [];

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
          tweens.push(gsap.fromTo(
            el,
            { x: dx },
            {
              x: 0,
              ...motionInteractiveFor(config),
              overwrite: "auto",
              onComplete: clearWillChangeOnComplete(el),
            },
          ));
        }
      } else {
        killMotion(el);
        setWillChangeTransform(el, true);
        tweens.push(gsap.fromTo(
          el,
          { opacity: 0, scale: 0.82 },
          {
            opacity: 1,
            scale: 1,
            ...motionInteractiveFor(config),
            overwrite: "auto",
            onComplete: clearWillChangeOnComplete(el),
          },
        ));
      }
    }

    prevRectsRef.current = nextRects;
    firstRunRef.current = false;
    return () => {
      for (const tween of tweens) tween.kill();
    };
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
 
const PAGINATION_BUTTON_PRESS = {
  pressIn: "pressSqueeze" as const,
  pressOut: false as const,
};

export function resolvePaginationMotionDefaults(): PaginationMotion {
  return {
    previous: { ...PAGINATION_BUTTON_PRESS },
    next: { ...PAGINATION_BUTTON_PRESS },
    page: { ...PAGINATION_BUTTON_PRESS },
  };
}

/** Press one nav button and the chevron inside it. Other pages stay still. */
export function playPaginationButtonPhase(
  scope: MotionScopeValue | null,
  slot: PaginationButtonSlot,
  phase: "pressIn" | "pressOut",
  el: HTMLElement,
  partMotion?: PaginationPartMotion,
) {
  if (!scope) return;
  const value = scope.resolve(slot, phase, partMotion);
  if (value !== undefined) {
    scope.play(slot, phase, { partMotion, el });
  }
  const iconSlot = slot === "previous" ? "previousIcon" : slot === "next" ? "nextIcon" : null;
  if (!iconSlot) return;
  for (const icon of scope.getTargets(iconSlot)) {
    if (el.contains(icon)) scope.play(iconSlot, phase, { el: icon });
  }
}
 
export function usePaginationPageActiveSlot(
  motion: PaginationPartMotion | undefined,
  forwardedRef: ForwardedRef<HTMLElement> | undefined,
  enabled: boolean,
) {
  const scope = useOptionalPaginationMotionScope();
  const pointer = enabled && hasPointerPhases(motion ?? scope?.getRootMotion()?.pageActive);
  return useMotionPart<HTMLElement>({
    scope,
    slot: "pageActive",
    motion: enabled ? motion : undefined,
    forwardedRef: enabled ? forwardedRef : undefined,
    pointerPhases: pointer,
  });
}

export function usePaginationSummarySlot(
  motion?: PaginationSummaryPartMotion,
  forwardedRef?: ForwardedRef<HTMLDivElement>,
) {
  const ctx = useOptionalPagination();
  const scope = useOptionalPaginationMotionScope();
  const part = useMotionPart<HTMLDivElement>({
    scope,
    slot: "summary",
    motion,
    forwardedRef,
  });
  useSlotPhaseOnChange(scope, "summary", ctx?.page, {
    skipFirst: true,
    target: part.targetRef,
  });
  return part;
}
 
export function usePaginationEllipsisSlot(
  {
    motion,
    forwardedRef,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
  }: {
    motion?: PaginationPartMotion;
    forwardedRef?: ForwardedRef<HTMLSpanElement>;
    onPointerOver?: (e: ReactPointerEvent<HTMLSpanElement>) => void;
    onPointerOut?: (e: ReactPointerEvent<HTMLSpanElement>) => void;
    onPointerDown?: (e: ReactPointerEvent<HTMLSpanElement>) => void;
    onPointerUp?: (e: ReactPointerEvent<HTMLSpanElement>) => void;
  } = {},
) {
  const scope = useOptionalPaginationMotionScope();
  const pointer = hasPointerPhases(motion ?? scope?.getRootMotion()?.ellipsis);
  const part = useMotionPart<HTMLSpanElement>({
    scope,
    slot: "ellipsis",
    motion,
    forwardedRef,
    pointerPhases: pointer,
    pressPhases: pointer,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
  });
  useOptionalEnterOnMount(scope, "ellipsis", part.targetRef);
  return part;
}
 