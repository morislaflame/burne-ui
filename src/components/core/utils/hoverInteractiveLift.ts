/**
 * Hover-подъём и squeeze при нажатии — только через anime.js (общие timing / ease).
 */

import { animate, remove } from "animejs";
import {
  useEffect,
  type MutableRefObject,
  type RefObject,
} from "react";

export const INTERACTIVE_HOVER_LIFT_MS = 280;
export const INTERACTIVE_HOVER_LIFT_EASE = "out(2)" as const;

export const INTERACTIVE_HOVER_LIFT_SCALE = 1.015;

/** Squeeze как у Button: ключевые кадры шкалы по оси центра. */
const PRESS_SQUEEZE_KEYS = [1, 0.99, 1] as const;

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
    scale: lifted ? INTERACTIVE_HOVER_LIFT_SCALE : 1,
    duration: INTERACTIVE_HOVER_LIFT_MS,
    ease: INTERACTIVE_HOVER_LIFT_EASE,
  });
}

/**
 * Короткий «сжимающий» импульс при pointer down (`scale`: 1 → 0.97 → 1), как у `Button`.
 * Возвращает промис окончания анимации.
 */
export function animateInteractivePressSqueeze(element: HTMLElement) {
  remove(element);
  return animate(element, {
    scale: [...PRESS_SQUEEZE_KEYS],
    duration: INTERACTIVE_HOVER_LIFT_MS,
    ease: INTERACTIVE_HOVER_LIFT_EASE,
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
