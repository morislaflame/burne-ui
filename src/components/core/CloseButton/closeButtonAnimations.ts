/**
 * Slot motion for CloseButton — look here first.
 *
 * DOM slots: `root` (`<button>`), `icon`
 *
 * Host: root (`useCloseButtonAnimations`) plays hover/press.
 * Defaults: first-level lift + squeeze. A skin overlays its own recipes.
 * Ripple stays kit-internal.
 */
import { clearMotionTransform } from "@/components/core/utils/gsapMotion";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, type KeyboardEvent, type PointerEvent } from "react";
 
import {
  initElementShadow,
  isInteractivePressKey,
  isKitHoverLiftRecipe,
  primeInteractiveScaleRest,
  shadowNone,
  shouldSkipInteractiveHoverLift,
} from "@/components/core/utils/hoverInteractiveLift";
import { mergeForwardedRef } from "@/components/core/utils/mergeRefs";
import { useMotionConfig } from "@/components/core/utils/motionConfigContext";
import { killStoredMotion, mergeMotionPointerHandlers, useMotionPointerPhases } from "@/components/core/utils/slotMotion";
import { shadowMotionFor } from "@/components/core/utils/useShadowMotion";
import { overlaySkinMotion, usesKitElevationMember } from "@/skins/resolveVariantVisual";
 
import { useCloseButtonMotionScope } from "./closeButtonContext";
import { CLOSE_BUTTON_HAS_HOVER_SHADOW } from "./closeButtonStyles";
import type {
  CloseButtonMotion,
  CloseButtonVariant,
  UseCloseButtonAnimationsProps,
} from "./closeButtonTypes";
import { KIT_CLOSE_BUTTON_VARIANTS } from "./closeButtonTypes";

import { bindLiftRecipes } from "@/components/core/utils/slotMotion/recipes/bindLift";

bindLiftRecipes();
 
 
export function resolveCloseButtonMotionDefaults({
  variant,
  disabled,
}: {
  variant: CloseButtonVariant;
  disabled: boolean;
}): CloseButtonMotion {
  const enabled = !disabled;
  return overlaySkinMotion(
    {
      root: {
        hoverIn: enabled ? "hoverLiftFirstLevel" : false,
        hoverOut: enabled ? "hoverLiftFirstLevel" : false,
        pressIn: enabled ? "pressSqueeze" : false,
        pressOut: false,
      },
    },
    variant,
    KIT_CLOSE_BUTTON_VARIANTS,
    "closeButton",
  );
}
 
export function resolveCloseButtonMotionParams({
  variant,
  disabled,
  pointerInside,
}: {
  variant: CloseButtonVariant;
  disabled: boolean;
  pointerInside: React.MutableRefObject<boolean>;
}) {
  return {
    pointerInside,
    hasHoverShadow:
      !disabled && usesKitElevationMember(variant, KIT_CLOSE_BUTTON_VARIANTS, CLOSE_BUTTON_HAS_HOVER_SHADOW),
  };
}
 
export function useCloseButtonAnimations({
  variant,
  disabled,
  forwardedRef,
  motion,
  hoverPointerInsideRef,
  onPointerDown,
  onPointerUp,
  onPointerEnter,
  onPointerLeave,
  onPointerOver,
  onPointerOut,
  onKeyDown,
}: UseCloseButtonAnimationsProps) {
  const enabled = !disabled;
  const hasHoverShadow = usesKitElevationMember(
    variant,
    KIT_CLOSE_BUTTON_VARIANTS,
    CLOSE_BUTTON_HAS_HOVER_SHADOW,
  );
  const btnRef = useRef<HTMLButtonElement>(null);
  const scope = useCloseButtonMotionScope();
  const rootMotionRef = useRef(motion?.root);
  // react-doctor-disable-next-line react-doctor/no-ref-current-in-render -- latest value so child layout effects see this render; an effect runs too late
  rootMotionRef.current = motion?.root;
 
  const setRefs = useCallback(
    (node: HTMLButtonElement | null) => {
      btnRef.current = node;
      scope.registerTarget("root", node);
      mergeForwardedRef(forwardedRef, node);
    },
    [forwardedRef, scope],
  );
 
  const config = useMotionConfig();
  const btnShadow = useMemo(
    () => (hasHoverShadow ? shadowMotionFor("none") : undefined),
    [hasHoverShadow],
  );
 
  useLayoutEffect(() => {
    if (!enabled) return;
    if (hoverPointerInsideRef.current) return;
    const el = btnRef.current;
    if (btnShadow) initElementShadow(el, shadowNone());
    const enterValue = scope.resolve("root", "enter", rootMotionRef.current);
    const hoverValue = scope.resolve("root", "hoverIn", rootMotionRef.current);
    if ((enterValue == null || enterValue === false) && isKitHoverLiftRecipe(hoverValue)) {
      primeInteractiveScaleRest(el, config);
    }
  }, [btnShadow, config, enabled, hoverPointerInsideRef, scope, variant]);

  useEffect(() => {
    if (enabled) return;
    hoverPointerInsideRef.current = false;
    const el = btnRef.current;
    if (el) {
      killStoredMotion(el);
      el.style.removeProperty("--el-shadow");
      el.style.removeProperty("box-shadow");
      clearMotionTransform(el);
    }
    for (const iconEl of scope.getTargets("icon")) {
      killStoredMotion(iconEl);
      clearMotionTransform(iconEl);
    }
  }, [enabled, hoverPointerInsideRef, scope]);
 
  const playRoot = useCallback(
    (phase: "hoverIn" | "hoverOut" | "pressIn" | "pressOut") => {
      if (!enabled) return;
      const el = btnRef.current;
      if (el) {
        const value = scope.resolve("root", phase, rootMotionRef.current);
        if (value !== undefined) {
          scope.play("root", phase, { partMotion: rootMotionRef.current, el });
        }
      }
      void scope.playBroadcast(phase, { exclude: ["root"] });
    },
    [enabled, scope],
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
 
  const handlePointerDown = useCallback(
    (e: PointerEvent<HTMLButtonElement>) => {
      onPointerDown?.(e);
      if (!enabled || e.defaultPrevented) return;
      playRoot("pressIn");
    },
    [enabled, onPointerDown, playRoot],
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
    },
    [onPointerLeave],
  );
 
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>) => {
      onKeyDown?.(e);
      if (!enabled || e.defaultPrevented || !isInteractivePressKey(e)) return;
      playRoot("pressIn");
    },
    [enabled, onKeyDown, playRoot],
  );
 
  return {
    setRefs,
    handlePointerEnter,
    handlePointerLeave,
    handlePointerDown,
    handlePointerUp,
    handleKeyDown,
    pointerHandlers: hoverHandlers,
  };
}
