/**
 * Slot motion for Button — look here first.
 *
 * DOM slots: `root` (the `<button>`, or the inner content span when `groupSegment`),
 * `label`, `icon`, `text`, `loader`, `success`, `error`
 * (`content` is layout — not a slot, except it carries `root` when `groupSegment`)
 *
 * Host: root (`useButtonAnimations`) plays `hoverIn` / `hoverOut` / `pressIn` / `pressOut`
 * and broadcasts those phases to nested slots (`exclude` root + overlay layers).
 * Defaults: `resolveButtonMotionDefaults` (first-level lift + squeeze). A skin overlays its own recipes.
 * Overlay `loader` / `success` / `error` stay CSS-hidden until the app plays `motion.states`.
 */
import { clearMotionTransform, killMotion } from "@/components/core/utils/gsapMotion";
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
import { isOverlayTriggerOpening } from "@/components/core/utils/overlayTriggerSqueeze";
import {
  killStoredMotion,
  mergeMotionPointerHandlers,
  useMotionPointerPhases,
  useOptionalEnterOnMount,
} from "@/components/core/utils/slotMotion";
import { shadowMotionFor } from "@/components/core/utils/useShadowMotion";
 
import { overlaySkinMotion, usesKitElevationMember } from "@/skins/resolveVariantVisual";

import { useButtonMotionScope } from "./buttonContext";
import type {
  ButtonMotion,
  ButtonVariant,
  UseButtonAnimationsProps,
} from "./buttonTypes";
import { KIT_BUTTON_VARIANTS } from "./buttonTypes";
import { BUTTON_VARIANT_HAS_HOVER_SHADOW } from "./buttonStyles";

import { bindLiftRecipes } from "@/components/core/utils/slotMotion/recipes/bindLift";

bindLiftRecipes();
 
/** Nested pointer broadcast skips overlay layers (app `motion.states` owns their autoAlpha). */
const BUTTON_POINTER_BROADCAST_EXCLUDE = ["root", "loader", "success", "error"] as const;
 
export function resolveButtonMotionDefaults({
  variant,
}: {
  variant: ButtonVariant;
}): ButtonMotion {
  return overlaySkinMotion(
    {
      root: {
        hoverIn: "hoverLiftFirstLevel",
        hoverOut: "hoverLiftFirstLevel",
        pressIn: "pressSqueeze",
        pressOut: false,
      },
    },
    variant,
    KIT_BUTTON_VARIANTS,
    "button",
  );
}
 
export function useButtonAnimations({
  variant,
  disabled,
  blocked,
  groupSegment,
  motion,
  hoverPointerInsideRef,
  forwardedRef,
  onPointerEnter,
  onPointerLeave,
  onPointerOver,
  onPointerOut,
  onPointerDown,
  onPointerUp,
  onKeyDown,
}: UseButtonAnimationsProps) {
  const useContentRef = Boolean(groupSegment);
  const hasHoverShadow =
    usesKitElevationMember(variant, KIT_BUTTON_VARIANTS, BUTTON_VARIANT_HAS_HOVER_SHADOW) && !useContentRef;
  const enabled = !blocked;
  const scope = useButtonMotionScope();
  const btnRef = useRef<HTMLButtonElement>(null);
  const contentMotionRef = useRef<HTMLSpanElement>(null);
  const rootMotionRef = useRef(motion?.root);
  // react-doctor-disable-next-line react-doctor/no-ref-current-in-render -- latest value so child layout effects see this render; an effect runs too late
  rootMotionRef.current = motion?.root;
 
 
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
 
  useOptionalEnterOnMount(
    useContentRef ? null : scope,
    "root",
    btnRef,
  );

  const config = useMotionConfig();
  const btnShadow = useMemo(
    () => (hasHoverShadow ? shadowMotionFor("none") : undefined),
    [hasHoverShadow],
  );
 
  useLayoutEffect(() => {
    if (!enabled || useContentRef) return;
    if (hoverPointerInsideRef.current) return;
    const el = btnRef.current;
    if (btnShadow) initElementShadow(el, shadowNone());
    const enterValue = scope.resolve("root", "enter", rootMotionRef.current);
    const hoverValue = scope.resolve("root", "hoverIn", rootMotionRef.current);
    if ((enterValue == null || enterValue === false) && isKitHoverLiftRecipe(hoverValue)) {
      primeInteractiveScaleRest(el, config);
    }
  }, [btnShadow, config, enabled, hoverPointerInsideRef, scope, useContentRef, variant]);
 
  useEffect(() => {
    if (!enabled) {
      hoverPointerInsideRef.current = false;
    }
    if (!disabled) return;
    const el = btnRef.current;
    const content = contentMotionRef.current;
    if (el) {
      killStoredMotion(el);
      el.style.removeProperty("--el-shadow");
      el.style.removeProperty("box-shadow");
      clearMotionTransform(el);
    }
    if (content) {
      killMotion(content);
      content.style.transform = "";
    }
  }, [disabled, enabled, hoverPointerInsideRef]);
 
  useEffect(() => {
    const contentRef = contentMotionRef;
    return () => {
      if (contentRef.current) killMotion(contentRef.current);
    };
  }, []);
 
  const playRoot = useCallback(
    (phase: "hoverIn" | "hoverOut" | "pressIn" | "pressOut") => {
      if (!enabled) return;
      const el = motionTarget();
      if (el) {
        const value = scope.resolve("root", phase, rootMotionRef.current);
        if (value !== undefined) {
          scope.play("root", phase, { partMotion: rootMotionRef.current, el });
        }
      }
      void scope.playBroadcast(phase, { exclude: [...BUTTON_POINTER_BROADCAST_EXCLUDE] });
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
 
  const handlePointerDown = useCallback(
    (e: PointerEvent<HTMLButtonElement>) => {
      onPointerDown?.(e);
      if (!enabled || e.defaultPrevented) return;
      const node = e.currentTarget;
      // An overlay trigger (`asChild`) runs the press itself and opens after it.
      // Its handler runs after ours, so decide once both have run.
      queueMicrotask(() => {
        if (isOverlayTriggerOpening(node)) return;
        playRoot("pressIn");
      });
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
 
  const pointerHandlers = useMemo(
    () => ({
      onPointerOver: hoverHandlers.onPointerOver,
      onPointerOut: hoverHandlers.onPointerOut,
      onPointerDown: handlePointerDown,
      onPointerUp: handlePointerUp,
    }),
    [handlePointerDown, handlePointerUp, hoverHandlers],
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
    contentMotionRef,
    pointerHandlers,
    handlePointerEnter,
    handlePointerLeave,
    handlePointerDown,
    handlePointerUp,
    handleKeyDown,
  };
}
 