/**
 * Unified shadow + hover-lift patterns via `--el-shadow` and `animate-shadow`.
 *
 * Level 1 (Button): `firstLevelHoverShadow()` — none → base.
 * Level 2 interactive (Alert, Badge, fields): `secondLevelShadow()` — base → mid.
 * Level 2 static (Tooltip, Popover): `usePersistentElShadow` — base without hover.
 *
 * Values are live `var(--shadow-*)` refs — theme / nested-root updates apply without re-hover.
 */

import { useCallback, useLayoutEffect, useMemo, type MutableRefObject, type RefObject } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

import { animateInteractiveHoverLift, initElementShadow, shadowMid, shadowBase, shouldSkipInteractiveHoverLift, useInteractiveHoverLiftContainerHandlers, type HoverShadowConfig } from "./hoverInteractiveLift";

/** Class for JS-animated shadow and scale-lift. */
export const SHADOW_LIFT_MOTION_CLASS =
  "animate-shadow origin-center";

/** Hover-only: idle `--shadow-none`, hover `--shadow-base` (Button, ToggleButton). */
export function firstLevelHoverShadow(): HoverShadowConfig {
  return { hover: shadowBase() };
}

/** Level 2 interactive: idle small, hover mid (Alert, Badge, Input). */
export function secondLevelShadow(): HoverShadowConfig {
  return { idle: shadowBase(), hover: shadowMid() };
}

/**
 * Persistent `--el-shadow` without hover-lift (Tooltip, Popover).
 * `resolveShadow` is recomputed when `syncKey` changes (e.g. expanded on SearchInput).
 */
export function usePersistentElShadow(
  ref: RefObject<HTMLElement | null>,
  enabled: boolean,
  resolveShadow: () => string = shadowBase,
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
  /** Override idle (SearchInput: collapsed → none). */
  resolveIdle?: () => string;
  /** Key to recompute idle shadow (expanded, etc.). */
  idleSyncKey?: unknown;
};

/**
 * Level 2: init small + handlers on the same element (Alert, self-lift Badge).
 */
export function useSecondLevelShadow(
  targetRef: RefObject<HTMLElement | null>,
  enabled: boolean,
  options?: UseSecondLevelShadowOptions,
) {
  const shadow = useMemo(() => secondLevelShadow(), []);
  const resolveIdle = options?.resolveIdle ?? shadowBase;

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
 * Level 2: init on `liftedRef`, handlers on container (Badge.Anchor).
 */
export function useSecondLevelShadowContainer(
  liftedRef: RefObject<HTMLElement | null>,
  enabled: boolean,
  options?: UseSecondLevelShadowOptions,
) {
  const shadow = useMemo(() => secondLevelShadow(), []);
  const resolveIdle = options?.resolveIdle ?? shadowBase;

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
