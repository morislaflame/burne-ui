/**
 * Slot motion for ToggleButton — look here first.
 *
 * DOM slots: `root` (the `<button>`, or the inner content span when `groupSegment`),
 * `fill`, `content`, `label`, `iconStart`, `iconEnd`, `text`
 * Host: root (`useToggleButtonAnimations`) plays `hoverIn` / `hoverOut` / `pressIn` / `pressOut`.
 * Fill `check` / `uncheck` plays from the fill hook (coordinated with squeeze release).
 * Nested `iconStart` / `iconEnd` use `playBroadcast` with exclude so one node
 * does not play twice. Defaults: `resolveToggleButtonMotionDefaults`.
 */
import { gsap, killMotion } from "@/components/core/utils/gsapMotion";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, type KeyboardEvent, type PointerEvent } from "react";
 
import {
  initElementShadow,
  isInteractivePressKey,
  shadowNone,
  shouldSkipInteractiveHoverLift,
} from "@/components/core/utils/hoverInteractiveLift";
import { mergeForwardedRef } from "@/components/core/utils/mergeRefs";
import { isMotionFeatureEnabledFor } from "@/components/core/utils/motionConfig";
import { useMotionConfig } from "@/components/core/utils/motionConfigContext";
import { prefersReducedMotion } from "@/components/core/utils/reducedMotion";
import {
  mergeMotionPointerHandlers,
  useMotionPointerPhases,
  type MotionValue,
} from "@/components/core/utils/slotMotion";
import { shadowMotionFor } from "@/components/core/utils/useShadowMotion";
import { isKitVariant, overlaySkinMotion } from "@/skins/resolveVariantVisual";
 
import { useToggleButtonMotionScope } from "./toggleButtonContext";
import type {
  ToggleButtonMotion,
  ToggleButtonVariant,
  UseToggleButtonAnimationsProps,
} from "./toggleButtonTypes";
import { KIT_TOGGLE_BUTTON_VARIANTS } from "./toggleButtonTypes";
import {
  applyToggleButtonFillInstant,
  useToggleButtonFillAnimation,
} from "./useToggleButtonFillAnimation";
 
function isKitPressSqueeze(value: MotionValue | undefined): boolean {
  if (typeof value === "string") {
    return value === "pressSqueeze";
  }
  if (value && typeof value === "object" && "recipe" in value) {
    const recipe = (value as { recipe?: unknown }).recipe;
    return recipe === "pressSqueeze";
  }
  return false;
}
 
export function resolveToggleButtonMotionDefaults({
  variant,
}: {
  variant: ToggleButtonVariant;
}): ToggleButtonMotion {
  return overlaySkinMotion(
    {
      root: {
        hoverIn: "hoverLiftFirstLevel",
        hoverOut: "hoverLiftFirstLevel",
        pressIn: "pressSqueeze",
        pressOut: false,
      },
      fill: {
        check: "selectionFill",
        uncheck: "selectionFill",
      },
    },
    variant,
    KIT_TOGGLE_BUTTON_VARIANTS,
    "toggleButton",
  );
}
 
export function useToggleButtonAnimations({
  disabled,
  variant,
  groupSegment,
  forwardedRef,
  pressed,
  motion,
  hoverPointerInsideRef,
  onReleaseStartRef,
  onFillStart,
  onPointerEnter,
  onPointerLeave,
  onPointerOver,
  onPointerOut,
  onPointerDown,
  onPointerUp,
  onKeyDown,
}: UseToggleButtonAnimationsProps) {
  const config = useMotionConfig();
  const fillRef = useRef<HTMLSpanElement>(null);
  const deferFillFromPressRef = useRef(false);
  const pendingFillRef = useRef<boolean | null>(null);
  const pressReleaseStartedRef = useRef(false);
 
  const scope = useToggleButtonMotionScope();
  const rootMotionRef = useRef(motion?.root);
  // react-doctor-disable-next-line react-doctor/no-ref-current-in-render -- latest value so child layout effects see this render; an effect runs too late
  rootMotionRef.current = motion?.root;
  const fillMotionRef = useRef(motion?.fill);
  // react-doctor-disable-next-line react-doctor/no-ref-current-in-render -- latest value so child layout effects see this render; an effect runs too late
  fillMotionRef.current = motion?.fill;
 
  const playFill = useCallback(
    (fill: HTMLElement, next: boolean, reduceMotion: boolean) => {
      const phase = next ? "check" : "uncheck";
      const fillOff =
        reduceMotion || !isMotionFeatureEnabledFor(config, "enableToggleButtonFill");
      const value = scope.resolve("fill", phase, fillMotionRef.current);
      if (fillOff || value === false || value === undefined) {
        applyToggleButtonFillInstant(fill, next);
      } else {
        scope.play("fill", phase, { partMotion: fillMotionRef.current, el: fill });
      }
      void scope.playBroadcast(phase, { exclude: ["root", "fill", "content"] });
    },
    [config, scope],
  );
 
  const { animateTo, bindFillRef, displayPressed } = useToggleButtonFillAnimation(
    pressed,
    fillRef,
    {
      deferFillFromPressRef,
      onFillStart,
      playFill,
    },
  );
 
  const clearPressFillCoordination = useCallback(() => {
    deferFillFromPressRef.current = false;
    pendingFillRef.current = null;
    pressReleaseStartedRef.current = false;
  }, []);
 
  const runPendingFill = useCallback(() => {
    const next = pendingFillRef.current;
    if (next === null) return;
    pendingFillRef.current = null;
    deferFillFromPressRef.current = false;
    animateTo(next);
  }, [animateTo]);
 
  onReleaseStartRef.current = () => {
    pressReleaseStartedRef.current = true;
    runPendingFill();
  };
 
  const reduceMotion = prefersReducedMotion();
  const shouldCoordinateFill = !disabled && !reduceMotion;
 
  const useContentRef = Boolean(groupSegment);
  const hasHoverShadow = isKitVariant(variant, KIT_TOGGLE_BUTTON_VARIANTS) && !useContentRef;
  const enabled = !disabled;
  const btnRef = useRef<HTMLButtonElement>(null);
  const contentMotionRef = useRef<HTMLSpanElement>(null);
 
  const motionTarget = useCallback(
    () => (useContentRef ? contentMotionRef.current : btnRef.current),
    [useContentRef],
  );
 
  const setRefs = useCallback(
    (node: HTMLButtonElement | null) => {
      btnRef.current = node;
      if (!useContentRef) scope.registerTarget("root", node);
      mergeForwardedRef(forwardedRef, node);
    },
    [forwardedRef, scope, useContentRef],
  );
 
  const btnShadow = useMemo(
    () => (hasHoverShadow ? shadowMotionFor("none") : undefined),
    [hasHoverShadow],
  );
 
  useLayoutEffect(() => {
    if (!enabled || !btnShadow || useContentRef) return;
    initElementShadow(btnRef.current, shadowNone());
  }, [btnShadow, enabled, useContentRef]);
 
  useEffect(() => {
    if (enabled) return;
    hoverPointerInsideRef.current = false;
    const el = btnRef.current;
    const content = contentMotionRef.current;
    if (el) {
      killMotion(el);
      el.style.removeProperty("--el-shadow");
      el.style.removeProperty("box-shadow");
      gsap.set(el, { clearProps: "scale,transform" });
    }
    if (content) {
      killMotion(content);
      content.style.transform = "";
    }
  }, [enabled, hoverPointerInsideRef]);
 
  useEffect(() => {
    const contentRef = contentMotionRef;
    const fill = fillRef;
    return () => {
      if (contentRef.current) killMotion(contentRef.current);
      if (fill.current) killMotion(fill.current);
    };
  }, []);
 
  const playRoot = useCallback(
    (phase: "hoverIn" | "hoverOut" | "pressIn" | "pressOut") => {
      if (!enabled) return;
      const el = motionTarget();
      if (!el) return;
      const value = scope.resolve("root", phase, rootMotionRef.current);
      if (value === undefined) return;
      scope.play("root", phase, { partMotion: rootMotionRef.current, el });
    },
    [enabled, motionTarget, scope],
  );
 
  const motionPointer = useMotionPointerPhases<HTMLButtonElement>({
    enabled,
    targetRef: btnRef,
    pointerInsideRef: hoverPointerInsideRef,
    skipHover: shouldSkipInteractiveHoverLift,
    onHoverIn: () => playRoot("hoverIn"),
    onHoverOut: () => playRoot("hoverOut"),
  });
 
  const hoverHandlers = useMemo(
    () =>
      mergeMotionPointerHandlers(
        onPointerOver,
        onPointerOut,
        motionPointer.onPointerOver,
        motionPointer.onPointerOut,
      ),
    [motionPointer.onPointerOut, motionPointer.onPointerOver, onPointerOut, onPointerOver],
  );
 
  const beginPressFillCoordination = useCallback(() => {
    if (!shouldCoordinateFill) return;
    deferFillFromPressRef.current = true;
    pressReleaseStartedRef.current = false;
    pendingFillRef.current = null;
  }, [shouldCoordinateFill]);
 
  const handlePointerDown = useCallback(
    (e: PointerEvent<HTMLButtonElement>) => {
      onPointerDown?.(e);
      if (!enabled || e.defaultPrevented) return;
      const pressIn = scope.resolve("root", "pressIn", rootMotionRef.current);
      if (isKitPressSqueeze(pressIn)) {
        beginPressFillCoordination();
      }
      playRoot("pressIn");
    },
    [beginPressFillCoordination, enabled, onPointerDown, playRoot, scope],
  );
 
  const handlePointerUp = useCallback(
    (e: PointerEvent<HTMLButtonElement>) => {
      onPointerUp?.(e);
      if (!enabled || e.defaultPrevented) return;
      playRoot("pressOut");
    },
    [enabled, onPointerUp, playRoot],
  );
 
  const handlePointerEnter = useCallback(
    (e: PointerEvent<HTMLButtonElement>) => {
      onPointerEnter?.(e);
    },
    [onPointerEnter],
  );
 
  const handlePointerLeave = useCallback(
    (e: PointerEvent<HTMLButtonElement>) => {
      onPointerLeave?.(e);
      clearPressFillCoordination();
    },
    [clearPressFillCoordination, onPointerLeave],
  );
 
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>) => {
      onKeyDown?.(e);
      if (!enabled || e.defaultPrevented || !isInteractivePressKey(e)) return;
      const pressIn = scope.resolve("root", "pressIn", rootMotionRef.current);
      if (isKitPressSqueeze(pressIn)) {
        beginPressFillCoordination();
      }
      playRoot("pressIn");
    },
    [beginPressFillCoordination, enabled, onKeyDown, playRoot, scope],
  );
 
  const queueFillOnClick = useCallback(
    (next: boolean) => {
      if (!shouldCoordinateFill || !deferFillFromPressRef.current) {
        animateTo(next);
        return;
      }
 
      pendingFillRef.current = next;
 
      if (pressReleaseStartedRef.current) {
        runPendingFill();
      }
    },
    [animateTo, runPendingFill, shouldCoordinateFill],
  );
 
  return {
    setRefs,
    contentMotionRef,
    handlePointerEnter,
    handlePointerLeave,
    handlePointerDown,
    handlePointerUp,
    handleKeyDown,
    pointerHandlers: hoverHandlers,
    bindFillRef,
    queueFillOnClick,
    displayPressed,
  };
}
