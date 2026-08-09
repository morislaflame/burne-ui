/**
 * Unified shadow + hover-lift patterns via `--el-shadow` and `animate-shadow`.
 *
 * Rest elevation and hover motion are independent:
 * - `enabled` → persistent rest `--el-shadow` + `animate-shadow` class
 * - `interactive` → pointer handlers + GSAP lift/press (defaults to `enabled`)
 *
 * Each rest size has its own hover/press tokens (not cross-tier base→mid):
 * - Level 1 (Button): `shadowMotionFor("none")` — none → `--shadow-lift` → none
 * - Level 2 (Alert, Badge, fields): `shadowMotionFor("small"|"base"|"mid"|"large")`
 * - Static (Tooltip, Popover): `usePersistentElShadow` — rest only
 *
 * At rest CSS paints `var(--el-shadow)` (knobs live). Lift/press probe used
 * shadows and GSAP-tween inline `boxShadow`, then release back to CSS.
 */

import { useCallback, useLayoutEffect, useMemo, type MutableRefObject, type RefObject } from "react";

import {
  animateInteractiveHoverLift,
  initElementShadow,
  shadowBase,
  shadowCssVar,
  shadowNone,
  shouldSkipInteractiveHoverLift,
  useInteractiveHoverLiftContainerHandlers,
  type HoverShadowConfig,
} from "./hoverInteractiveLift";
import { gsap, killMotion } from "./gsapMotion";
import { useContainerPointerHoverHandlers } from "./useContainerPointerHoverHandlers";
import type { ShadowSize } from "@/tokens/shadows";

/** Class for JS-animated shadow and scale-lift. */
export const SHADOW_LIFT_MOTION_CLASS =
  "animate-shadow origin-center";

/**
 * Idle / hover / press refs for a rest shadow size.
 * `none` uses dedicated `--shadow-lift` on hover (not `--shadow-base`).
 */
export function shadowMotionFor(size: ShadowSize = "base"): HoverShadowConfig {
  if (size === "none") {
    return {
      idle: shadowNone(),
      hover: shadowCssVar("none", "hover"),
      press: shadowNone(),
    };
  }
  return {
    idle: shadowCssVar(size, "rest"),
    hover: shadowCssVar(size, "hover"),
    press: shadowCssVar(size, "press"),
  };
}

/** @deprecated Prefer `shadowMotionFor("none")`. */
export function firstLevelHoverShadow(): HoverShadowConfig {
  return shadowMotionFor("none");
}

/** @deprecated Prefer `shadowMotionFor(size)`. Default `base`. */
export function secondLevelShadow(size: ShadowSize = "base"): HoverShadowConfig {
  return shadowMotionFor(size);
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
  /**
   * Rest shadow size — hover/press from the same family (`none` → `--shadow-lift`).
   * @default "base"
   */
  shadowSize?: ShadowSize;
  /** Override idle token (rare); default = rest for `shadowSize`. */
  resolveIdle?: () => string;
  /** Key to recompute idle shadow (expanded, etc.). */
  idleSyncKey?: unknown;
  /**
   * Hover/press GSAP motion. Rest elevation still applies when `enabled`.
   * @default true (same as `enabled`)
   */
  interactive?: boolean;
};

function resetLiftScale(element: HTMLElement | null): void {
  if (!element) return;
  killMotion(element);
  gsap.set(element, { scale: 1, force3D: false });
}

/**
 * Level 2: persistent rest shadow + optional guarded pointerover/out.
 * Handlers ignore moves between descendants (`cameFromOutsideContainer`).
 */
export function useSecondLevelShadow(
  targetRef: RefObject<HTMLElement | null>,
  enabled: boolean,
  options?: UseSecondLevelShadowOptions,
) {
  const shadowSize = options?.shadowSize ?? "base";
  const interactive = enabled && (options?.interactive ?? true);
  const shadow = useMemo(() => shadowMotionFor(shadowSize), [shadowSize]);
  const idleShadow = options?.resolveIdle?.() ?? shadow.idle ?? shadowNone();
  const liftScale = options?.liftScale;

  useLayoutEffect(() => {
    if (!enabled) return;
    initElementShadow(targetRef.current, idleShadow);
  }, [enabled, targetRef, idleShadow, options?.idleSyncKey]);

  useLayoutEffect(() => {
    if (!enabled || interactive) return;
    const el = targetRef.current;
    resetLiftScale(el);
    initElementShadow(el, idleShadow);
  }, [enabled, interactive, targetRef, idleShadow]);

  const onEnter = useCallback(
    (el: HTMLElement) => {
      animateInteractiveHoverLift(el, true, liftScale, shadow);
    },
    [liftScale, shadow],
  );

  const onLeave = useCallback(
    (el: HTMLElement) => {
      animateInteractiveHoverLift(el, false, liftScale, shadow);
    },
    [liftScale, shadow],
  );

  const { onPointerOver, onPointerOut } = useContainerPointerHoverHandlers({
    enabled: interactive,
    targetRef,
    pointerInsideRef: options?.pointerInsideRef,
    skipHover: shouldSkipInteractiveHoverLift,
    onEnter,
    onLeave,
  });

  return {
    motionClass: enabled ? SHADOW_LIFT_MOTION_CLASS : "",
    shadow,
    onPointerOver,
    onPointerOut,
    /** Alias of guarded `onPointerOver` — safe on `pointerenter` or `pointerover`. */
    onPointerEnter: onPointerOver,
    /** Alias of guarded `onPointerOut` — safe on `pointerleave` or `pointerout`. */
    onPointerLeave: onPointerOut,
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
  const shadowSize = options?.shadowSize ?? "base";
  const interactive = enabled && (options?.interactive ?? true);
  const shadow = useMemo(() => shadowMotionFor(shadowSize), [shadowSize]);
  const idleShadow = options?.resolveIdle?.() ?? shadow.idle ?? shadowNone();

  useLayoutEffect(() => {
    if (!enabled) return;
    initElementShadow(liftedRef.current, idleShadow);
  }, [enabled, liftedRef, idleShadow, options?.idleSyncKey]);

  useLayoutEffect(() => {
    if (!enabled || interactive) return;
    const el = liftedRef.current;
    resetLiftScale(el);
    initElementShadow(el, idleShadow);
  }, [enabled, interactive, liftedRef, idleShadow]);

  const containerHandlers = useInteractiveHoverLiftContainerHandlers(
    liftedRef,
    interactive,
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
