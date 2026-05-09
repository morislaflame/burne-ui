/**
 * Hover-подъём и squeeze при нажатии — anime.js; константы см. `motionTokens.ts`.
 */

import { animate, remove } from "animejs";
import {
  useEffect,
  type MutableRefObject,
  type RefObject,
} from "react";

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

/** `remove(target)` затем плавное масштабирование только по scale (без смещения). */
export function animateInteractiveHoverLift(
  element: HTMLElement,
  lifted: boolean,
): void {
  remove(element);
  animate(element, {
    scale: lifted ? MOTION_HOVER_LIFT_SCALE : 1,
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

/**
 * Подъём при наведении: `pointerenter`/`pointerleave` на контейнере, scale на узле `liftedRef`.
 * Для масштабирования **всего** блока (алерт): передайте один и тот же ref в `containerRef` и `liftedRef`.
 *
 * `pointerInsideRef`: опционально для кнопки — после squeeze восстановить hover, если палец всё ещё над блоком.
 */
export function useInteractiveHoverLiftOnContainer(
  containerRef: RefObject<HTMLElement | null>,
  liftedRef: RefObject<HTMLElement | null>,
  enabled: boolean,
  pointerInsideRef?: MutableRefObject<boolean>,
): void {
  useEffect(() => {
    if (!enabled) return;
    const c = containerRef.current;
    if (!c) return;

    const onEnter = () => {
      if (pointerInsideRef) pointerInsideRef.current = true;
      if (prefersReducedInteractiveHoverLift()) return;
      const t = liftedRef.current;
      if (!t) return;
      animateInteractiveHoverLift(t, true);
    };

    const onLeave = () => {
      if (pointerInsideRef) pointerInsideRef.current = false;
      if (prefersReducedInteractiveHoverLift()) return;
      const t = liftedRef.current;
      if (!t) return;
      animateInteractiveHoverLift(t, false);
    };

    c.addEventListener("pointerenter", onEnter);
    c.addEventListener("pointerleave", onLeave);
    return () => {
      c.removeEventListener("pointerenter", onEnter);
      c.removeEventListener("pointerleave", onLeave);
      if (pointerInsideRef) pointerInsideRef.current = false;
      const t = liftedRef.current;
      if (t) remove(t);
    };
  }, [enabled, containerRef, liftedRef, pointerInsideRef]);
}

