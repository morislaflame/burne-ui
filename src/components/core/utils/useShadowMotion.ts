/**
 * Унифицированные паттерны тени + hover-lift через `--el-shadow` и `animate-shadow`.
 *
 * 1-й уровень (Button): `firstLevelHoverShadow()` — none → sm.
 * 2-й уровень интерактивный (Alert, Badge, поля): `secondLevelShadow()` — sm → md.
 * 2-й уровень статичный (Tooltip, Popover): `usePersistentElShadow` — sm без hover.
 */

import { useCallback, useLayoutEffect, useMemo, type MutableRefObject, type RefObject } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

import {
  animateInteractiveHoverLift,
  initElementShadow,
  shadowMd,
  shadowSm,
  shouldSkipInteractiveHoverLift,
  useInteractiveHoverLiftContainerHandlers,
  type HoverShadowConfig,
} from "./hoverInteractiveLift";

/** Класс для JS-анимируемой тени и scale-lift. */
export const SHADOW_LIFT_MOTION_CLASS =
  "animate-shadow will-change-transform origin-center";

/** Hover-only: покой `--shadow-none`, hover `--shadow-sm` (Button, ToggleButton). */
export function firstLevelHoverShadow(): HoverShadowConfig {
  return { hover: shadowSm() };
}

/** Второй уровень интерактивный: покой sm, hover md (Alert, Badge, Input). */
export function secondLevelShadow(): HoverShadowConfig {
  return { idle: shadowSm(), hover: shadowMd() };
}

/**
 * Постоянная `--el-shadow` без hover-lift (Tooltip, Popover).
 * `resolveShadow` пересчитывается при изменении `syncKey` (напр. expanded у SearchInput).
 */
export function usePersistentElShadow(
  ref: RefObject<HTMLElement | null>,
  enabled: boolean,
  resolveShadow: () => string = shadowSm,
  syncKey?: unknown,
): void {
  useLayoutEffect(() => {
    if (!enabled) return;
    initElementShadow(ref.current, resolveShadow());
  }, [enabled, ref, resolveShadow, syncKey]);
}

export type UseSecondLevelShadowOptions = {
  liftScale?: number;
  pointerInsideRef?: MutableRefObject<boolean>;
  /** Переопределить idle (SearchInput: collapsed → none). */
  resolveIdle?: () => string;
  /** Ключ для пересчёта idle-тени (expanded и т.п.). */
  idleSyncKey?: unknown;
};

/**
 * 2-й уровень: init sm + handlers на том же элементе (Alert, self-lift Badge).
 */
export function useSecondLevelShadow(
  targetRef: RefObject<HTMLElement | null>,
  enabled: boolean,
  options?: UseSecondLevelShadowOptions,
) {
  const shadow = useMemo(() => secondLevelShadow(), []);
  const resolveIdle = options?.resolveIdle ?? shadowSm;

  useLayoutEffect(() => {
    if (!enabled) return;
    initElementShadow(targetRef.current, resolveIdle());
  }, [enabled, targetRef, resolveIdle, options?.idleSyncKey]);

  const onPointerEnter = useCallback(
    (e: ReactPointerEvent<HTMLElement>) => {
      if (!enabled || e.defaultPrevented) return;
      const el = targetRef.current;
      if (!el || shouldSkipInteractiveHoverLift()) return;
      animateInteractiveHoverLift(el, true, options?.liftScale, shadow);
    },
    [enabled, options?.liftScale, shadow, targetRef],
  );

  const onPointerLeave = useCallback(
    (_e: ReactPointerEvent<HTMLElement>) => {
      if (!enabled) return;
      const el = targetRef.current;
      if (!el || shouldSkipInteractiveHoverLift()) return;
      animateInteractiveHoverLift(el, false, options?.liftScale, shadow);
    },
    [enabled, options?.liftScale, shadow, targetRef],
  );

  return {
    motionClass: enabled ? SHADOW_LIFT_MOTION_CLASS : "",
    shadow,
    onPointerEnter,
    onPointerLeave,
  };
}

/**
 * 2-й уровень: init на `liftedRef`, handlers на контейнере (Badge.Anchor).
 */
export function useSecondLevelShadowContainer(
  liftedRef: RefObject<HTMLElement | null>,
  enabled: boolean,
  options?: UseSecondLevelShadowOptions,
) {
  const shadow = useMemo(() => secondLevelShadow(), []);
  const resolveIdle = options?.resolveIdle ?? shadowSm;

  useLayoutEffect(() => {
    if (!enabled) return;
    initElementShadow(liftedRef.current, resolveIdle());
  }, [enabled, liftedRef, resolveIdle, options?.idleSyncKey]);

  const containerHandlers = useInteractiveHoverLiftContainerHandlers(
    liftedRef,
    enabled,
    options?.pointerInsideRef,
    options?.liftScale,
    shadow,
  );

  return {
    motionClass: enabled ? SHADOW_LIFT_MOTION_CLASS : "",
    shadow,
    ...containerHandlers,
  };
}
