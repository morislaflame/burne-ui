/**
 * Hover-подъём и squeeze при нажатии — GSAP; константы см. `motionTokens.ts`.
 * Регистры подъёма по hover совпадают с `Button` (`animateInteractiveHoverLift`, `shouldSkipInteractiveHoverLift`).
 */

import { useEffect, useMemo, type MutableRefObject, type RefObject } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

import { gsap, killMotion } from "./gsapMotion";
import { getMotionConfig } from "./motionConfig";
import { SHADOW_CSS_VAR, type ShadowSize } from "@/tokens/shadows";

/**
 * Значения `box-shadow` для анимации при hover.
 * `null` означает «не анимировать тень» (для outline / ghost вариантов).
 * Берём из CSS-переменных (поддерживают тему), но GSAP требует конкретную строку —
 * поэтому передаём их явно через `getComputedStyle` при вызове.
 */
export interface HoverShadowConfig {
  /**
   * box-shadow в покое (второй уровень — sm; hover-only — см. `shadowNone`).
   * Если undefined — используется `shadowNone()` (не `none`: иначе transition не работает).
   */
  idle?: string;
  /** box-shadow при hover. */
  hover: string;
}

/** Считывает CSS-переменную тени с корня документа. */
function readShadowVar(varName: string): string {
  if (typeof window === "undefined") return "none";
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim() || "none";
}

/** «Пустая» тень: визуально как без тени, но интерполируется с `--shadow-sm`. */
export const shadowNone = () => readShadowVar("--shadow-none");

export const shadowSm = () => readShadowVar(SHADOW_CSS_VAR.sm);
export const shadowMd = () => readShadowVar(SHADOW_CSS_VAR.md);
export const shadowLg = () => readShadowVar(SHADOW_CSS_VAR.lg);

/** Значение `box-shadow` для ступени тени из текущей темы. */
export function readShadowSize(size: ShadowSize): string {
  if (size === "none") return shadowNone();
  return readShadowVar(SHADOW_CSS_VAR[size]);
}

/**
 * Выставляет `--el-shadow` на элементе (inline, перекрывает локальный сброс `animate-shadow`).
 * Вызывайте после маунта для компонентов с постоянной тенью (Alert, Badge, Tooltip).
 * Для hover-only тени достаточно класса `animate-shadow` (idle = `--shadow-none`).
 */
export function initElementShadow(element: HTMLElement | null, shadow: string): void {
  if (!element) return;
  element.style.setProperty("--el-shadow", shadow);
}


export function prefersReducedInteractiveHoverLift(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Viewport ≤ tablet (Tailwind `lg`), touch без hover или coarse pointer — без hover-lift. */
const HOVER_LIFT_TOUCH_VIEWPORT_MQL =
  "(max-width: 1024px), (hover: none), (pointer: coarse)";

function isTouchOrNarrowViewport(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia(HOVER_LIFT_TOUCH_VIEWPORT_MQL).matches;
}

/** Hover-подъём и смена тени: off при reduced-motion, touch и viewport ≤ tablet. */
export function shouldSkipInteractiveHoverLift(): boolean {
  return prefersReducedInteractiveHoverLift() || isTouchOrNarrowViewport() || !getMotionConfig().enableHoverLift;
}

// ─── Adaptive scale helpers ────────────────────────────────────────────────────
//
// Вместо фиксированного процента сжатия/подъёма используем фиксированное
// абсолютное смещение в пикселях. Это даёт правильное ощущение на любом размере:
//
//   scale_delta = TARGET_PX / max(width, height)
//
// Маленькая кнопка  (120 × 36): delta = 2.4 / 120 = 0.020 → squeeze 0.980
// Широкий инпут    (280 × 40): delta = 2.4 / 280 = 0.009 → squeeze 0.991
// Disclosure       (500 × 48): delta = 2.4 / 500 = 0.005 → squeeze 0.995
// Полноэкранный    (1200 × 60): delta = 2.4 / 1200 = 0.002 → squeeze 0.998
//
// Верхняя граница = исходный фиксированный дефолт (сохраняет поведение малых кнопок).
// Нижняя граница = всегда заметное, но не нулевое движение.

/** Абсолютное пиксельное смещение — «ощущение» сжатия в px с каждой стороны. */
const ADAPTIVE_SQUEEZE_TARGET_PX = 2.4;
/** Минимально заметное сжатие (очень большие элементы). */
const ADAPTIVE_SQUEEZE_MIN_DELTA = 0.003;

/** Абсолютное пиксельное смещение для hover-подъёма. */
const ADAPTIVE_LIFT_TARGET_PX = 1.8;
/** Минимально заметный подъём. */
const ADAPTIVE_LIFT_MIN_DELTA = 0.002;

/**
 * Возвращает scale < 1 для squeeze, адаптированный под фактический размер элемента.
 * Все компоненты автоматически используют его через `animateInteractivePressSqueeze`.
 */
function adaptiveSqueezeScale(element: HTMLElement): number {
  const { width, height } = element.getBoundingClientRect();
  const maxDim = Math.max(width, height, 1);
  const baseDelta = 1 - (getMotionConfig().pressSqueezeScale[1] as number);
  const delta = Math.min(
    Math.max(ADAPTIVE_SQUEEZE_TARGET_PX / maxDim, ADAPTIVE_SQUEEZE_MIN_DELTA),
    baseDelta,
  );
  return 1 - delta;
}

/**
 * Возвращает scale > 1 для hover-lift, адаптированный под фактический размер элемента.
 * Передайте явный `liftScale`, чтобы переопределить (напр. Badge.Anchor).
 */
function adaptiveHoverLiftScale(element: HTMLElement): number {
  const { width, height } = element.getBoundingClientRect();
  const maxDim = Math.max(width, height, 1);
  const delta = Math.min(
    Math.max(ADAPTIVE_LIFT_TARGET_PX / maxDim, ADAPTIVE_LIFT_MIN_DELTA),
    getMotionConfig().hoverLiftScale - 1,
  );
  return 1 + delta;
}

// ─── Animation functions ───────────────────────────────────────────────────────

/**
 * Останавливает активные tweens, затем плавно масштабирует только по scale (без смещения).
 * Если `liftScale` не передан — вычисляется адаптивно по размеру элемента.
 * Опционально: `shadow` — конфиг для плавного изменения `box-shadow` вместе со scale.
 */
export function animateInteractiveHoverLift(
  element: HTMLElement,
  lifted: boolean,
  liftScale?: number,
  shadow?: HoverShadowConfig,
): void {
  if (shouldSkipInteractiveHoverLift()) {
    if (!lifted) {
      killMotion(element);
      gsap.set(element, { scale: 1 });
      if (shadow) {
        element.style.setProperty("--el-shadow", shadow.idle ?? shadowNone());
      }
    }
    return;
  }

  killMotion(element);
  const resolvedScale = lifted
    ? (liftScale !== undefined ? liftScale : adaptiveHoverLiftScale(element))
    : 1;
  const cfg = getMotionConfig();
  gsap.to(element, {
    scale: resolvedScale,
    duration: cfg.interactiveDuration / 1000,
    ease: cfg.hoverLiftEase,
    overwrite: "auto",
  });
  if (shadow) {
    const idle = shadow.idle ?? shadowNone();
    element.style.setProperty("--el-shadow", lifted ? shadow.hover : idle);
  }
}

/**
 * Короткий «сжимающий» импульс при pointer down.
 * Степень сжатия автоматически адаптируется к размеру элемента.
 * Возвращает промис окончания анимации.
 */
export function animateInteractivePressSqueeze(element: HTMLElement): Promise<void> {
  if (!getMotionConfig().enablePressSqueeze) {
    return Promise.resolve();
  }
  killMotion(element);
  const s = adaptiveSqueezeScale(element);
  const cfg = getMotionConfig();
  // Чуть длиннее interactive: в anime.js [1, s, 1] шёл одной кривой,
  // а GSAP-keyframes делят время поровну — пик сжатия ощущается резче.
  const total = (cfg.interactiveDuration * 1.15) / 1000;
  return new Promise((resolve) => {
    gsap
      .timeline({ onComplete: () => resolve() })
      .to(element, {
        scale: s,
        duration: total * 0.3,
        ease: "power1.out",
        overwrite: "auto",
      })
      .to(element, {
        scale: 1,
        duration: total * 0.5,
        ease: "sine.inOut",
      });
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
  /** Явный scale подъёма; `undefined` (дефолт) — адаптивный по размеру элемента. */
  liftScale?: number,
  shadow?: HoverShadowConfig,
): {
  onPointerOver: (e: ReactPointerEvent<Element>) => void;
  onPointerOut: (e: ReactPointerEvent<Element>) => void;
} {
  useEffect(() => {
    const t = liftedRef.current;
    return () => {
      if (t) killMotion(t);
    };
  }, [liftedRef]);

  return useMemo(() => {
    const onPointerOver = (e: ReactPointerEvent<Element>) => {
      if (!enabled) return;
      if (e.defaultPrevented) return;
      const c = e.currentTarget;
      if (!(e.target instanceof Node) || !c.contains(e.target)) return;
      if (!cameFromOutsideContainer(c, e.relatedTarget)) return;
      if (shouldSkipInteractiveHoverLift()) return;
      const t = liftedRef.current;
      if (!t) return;
      if (pointerInsideRef) pointerInsideRef.current = true;
      animateInteractiveHoverLift(t, true, liftScale, shadow);
    };

    const onPointerOut = (e: ReactPointerEvent<Element>) => {
      const c = e.currentTarget;
      const rt = e.relatedTarget;
      if (rt instanceof Node && c.contains(rt)) return;

      if (pointerInsideRef) pointerInsideRef.current = false;
      if (!enabled) return;
      if (shouldSkipInteractiveHoverLift()) return;
      const t = liftedRef.current;
      if (!t) return;
      animateInteractiveHoverLift(t, false, liftScale, shadow);
    };

    return { onPointerOver, onPointerOut };
  }, [liftedRef, enabled, pointerInsideRef, liftScale, shadow]);
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

