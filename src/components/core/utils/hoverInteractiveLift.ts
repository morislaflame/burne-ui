/**
 * Hover-подъём и squeeze при нажатии — anime.js; константы см. `motionTokens.ts`.
 * Регистры подъёма по hover совпадают с `Button` (`animateInteractiveHoverLift`, порядок проверок).
 */

import { animate, remove } from "animejs";
import { useEffect, useMemo, type MutableRefObject, type RefObject } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

import {
  MOTION_HOVER_LIFT_SCALE,
  MOTION_INTERACTIVE_EASE,
  MOTION_INTERACTIVE_MS,
  MOTION_PRESS_SQUEEZE_SCALE,
} from "./motionTokens";

/** @deprecated Используйте `MOTION_INTERACTIVE_MS` из `motionTokens` */
export const INTERACTIVE_HOVER_LIFT_MS = MOTION_INTERACTIVE_MS;
/** @deprecated Используйте `MOTION_INTERACTIVE_EASE` */
export const INTERACTIVE_HOVER_LIFT_EASE = MOTION_INTERACTIVE_EASE;
/** @deprecated Используйте `MOTION_HOVER_LIFT_SCALE` */
export const INTERACTIVE_HOVER_LIFT_SCALE = MOTION_HOVER_LIFT_SCALE;

export function prefersReducedInteractiveHoverLift(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * `remove(target)` затем плавное масштабирование только по scale (без смещения).
 * Для более крупного подъёма (напр. бейдж на якоре) передайте `liftScale` без изменения дефолта кнопок.
 */
export function animateInteractiveHoverLift(
  element: HTMLElement,
  lifted: boolean,
  liftScale = MOTION_HOVER_LIFT_SCALE,
): void {
  remove(element);
  animate(element, {
    scale: lifted ? liftScale : 1,
    duration: MOTION_INTERACTIVE_MS,
    ease: MOTION_INTERACTIVE_EASE,
  });
}

/**
 * Короткий «сжимающий» импульс при pointer down (`MOTION_PRESS_SQUEEZE_SCALE`).
 * Возвращает промис окончания анимации.
 */
export function animateInteractivePressSqueeze(element: HTMLElement) {
  remove(element);
  return animate(element, {
    scale: [...MOTION_PRESS_SQUEEZE_SCALE],
    duration: MOTION_INTERACTIVE_MS,
    ease: MOTION_INTERACTIVE_EASE,
  });
}

function cameFromOutsideContainer(root: HTMLElement, related: EventTarget | null): boolean {
  if (related == null) return true;
  if (!(related instanceof Node)) return true;
  return !root.contains(related);
}

/** Возвращённые обработчики вешайте на тот же корень, где был бы `pointer` у Button (`currentTarget`). */
export function useInteractiveHoverLiftContainerHandlers<
  Element extends HTMLElement = HTMLElement,
>(
  liftedRef: RefObject<HTMLElement | null>,
  enabled: boolean,
  pointerInsideRef?: MutableRefObject<boolean>,
  /** По умолчанию `MOTION_HOVER_LIFT_SCALE` из `motionTokens`. */
  liftScale = MOTION_HOVER_LIFT_SCALE,
): {
  onPointerOver: (e: ReactPointerEvent<Element>) => void;
  onPointerOut: (e: ReactPointerEvent<Element>) => void;
} {
  useEffect(() => {
    return () => {
      const t = liftedRef.current;
      if (t) remove(t);
    };
  }, [liftedRef]);

  return useMemo(() => {
    const onPointerOver = (e: ReactPointerEvent<Element>) => {
      if (!enabled) return;
      if (e.defaultPrevented) return;
      const c = e.currentTarget;
      if (!(e.target instanceof Node) || !c.contains(e.target)) return;
      if (!cameFromOutsideContainer(c, e.relatedTarget)) return;
      if (prefersReducedInteractiveHoverLift()) return;
      const t = liftedRef.current;
      if (!t) return;
      if (pointerInsideRef) pointerInsideRef.current = true;
      animateInteractiveHoverLift(t, true, liftScale);
    };

    const onPointerOut = (e: ReactPointerEvent<Element>) => {
      const c = e.currentTarget;
      const rt = e.relatedTarget;
      if (rt instanceof Node && c.contains(rt)) return;

      if (pointerInsideRef) pointerInsideRef.current = false;
      if (!enabled) return;
      if (prefersReducedInteractiveHoverLift()) return;
      const t = liftedRef.current;
      if (!t) return;
      animateInteractiveHoverLift(t, false, liftScale);
    };

    return { onPointerOver, onPointerOut };
  }, [liftedRef, enabled, pointerInsideRef, liftScale]);
}

/**
 * @deprecated Первый аргумент не используйте — оставлен для совместимости. Спредьте результат на корень: `{...handlers}`.
 * Раньше слушатель вешался в `useEffect`; теперь те же правила что у `Button` (`onPointerOver` / `onPointerOut` на элементе).
 */
export function useInteractiveHoverLiftOnContainer(
  containerRef: RefObject<HTMLElement | null>,
  liftedRef: RefObject<HTMLElement | null>,
  enabled: boolean,
  pointerInsideRef?: MutableRefObject<boolean>,
  liftScale?: number,
): {
  onPointerOver: (e: ReactPointerEvent<HTMLElement>) => void;
  onPointerOut: (e: ReactPointerEvent<HTMLElement>) => void;
} {
  void containerRef;
  return useInteractiveHoverLiftContainerHandlers(
    liftedRef,
    enabled,
    pointerInsideRef,
    liftScale,
  );
}
