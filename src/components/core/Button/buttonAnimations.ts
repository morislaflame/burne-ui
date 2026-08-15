/**
 * Slot motion for Button — look here first.
 *
 * DOM slots: `root` (the `<button>`, or the inner content span when `groupSegment`)
 * Host: root (`useButtonAnimations`) plays `hoverIn` / `hoverOut` / `pressIn` / `pressOut`.
 * Defaults: `resolveButtonMotionDefaults` (first-level lift + squeeze; gloss recipes when gloss).
 * Async label/loader/success/error crossfade stays internal GSAP — not public phases.
 */
import { gsap, killMotion } from "@/components/core/utils/gsapMotion";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type MouseEvent, type KeyboardEvent, type PointerEvent } from "react";

import { createGlossInteractiveRefCallback } from "@/components/core/utils/glossInteractiveMotion";
import {
  initElementShadow,
  isInteractivePressKey,
  shadowNone,
  shouldSkipInteractiveHoverLift,
} from "@/components/core/utils/hoverInteractiveLift";
import { mergeForwardedRef } from "@/components/core/utils/mergeRefs";
import { isMotionFeatureEnabled, motionInteractive } from "@/components/core/utils/motionConfig";
import { prefersReducedMotion } from "@/components/core/utils/reducedMotion";
import {
  mergeMotionPointerHandlers,
  useMotionPointerPhases,
} from "@/components/core/utils/slotMotion";
import { shadowMotionFor } from "@/components/core/utils/useShadowMotion";

import { useButtonMotionScope } from "./buttonContext";
import { isButtonAsyncLayerActive, centerCoverDiameter } from "./buttonAPI";
import type {
  ButtonAsyncLayerKind,
  ButtonAsyncState,
  ButtonExpandRippleHandle,
  ButtonMotion,
  ButtonVariant,
  UseButtonAnimationsProps,
} from "./buttonTypes";
import { BUTTON_VARIANT_HAS_HOVER_SHADOW } from "./buttonStyles";

const BUTTON_ASYNC_LAYER_INIT_ATTR = "data-button-async-layer-init";

/** Async layer enter/exit scales — intentional feel constants (not in `configureMotion`). */
const BUTTON_ASYNC_LAYER_SCALE: Record<
  ButtonAsyncLayerKind,
  { in: number; out: number }
> = {
  label: { in: 1, out: 0.92 },
  loader: { in: 1, out: 0.85 },
  success: { in: 1, out: 0.85 },
  error: { in: 1, out: 0.85 },
};

function applyButtonAsyncLayerInstant(
  el: HTMLElement,
  state: ButtonAsyncState,
  layer: ButtonAsyncLayerKind,
) {
  const active = isButtonAsyncLayerActive(state, layer);
  const { in: scaleIn, out: scaleOut } = BUTTON_ASYNC_LAYER_SCALE[layer];
  gsap.set(el, {
    autoAlpha: active ? 1 : 0,
    scale: active ? scaleIn : scaleOut,
  });
}

export function createButtonAsyncLayerRefCallback(
  ref: React.RefObject<HTMLElement | null>,
  initialState: ButtonAsyncState,
  layer: ButtonAsyncLayerKind,
) {
  return (node: HTMLElement | null) => {
    ref.current = node;
    if (node && !node.hasAttribute(BUTTON_ASYNC_LAYER_INIT_ATTR)) {
      node.setAttribute(BUTTON_ASYNC_LAYER_INIT_ATTR, "");
      applyButtonAsyncLayerInstant(node, initialState, layer);
    }
  };
}

export function resolveButtonMotionDefaults({
  variant,
}: {
  variant: ButtonVariant;
}): ButtonMotion {
  const isGloss = variant === "gloss";
  return {
    root: {
      hoverIn: isGloss ? "hoverLiftGloss" : "hoverLiftFirstLevel",
      hoverOut: isGloss ? "hoverLiftGloss" : "hoverLiftFirstLevel",
      pressIn: isGloss ? "pressSqueezeGloss" : "pressSqueeze",
      pressOut: false,
    },
  };
}

export function useButtonAnimations({
  variant,
  asyncState,
  isControlled,
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
  const labelRef = useRef<HTMLSpanElement>(null);
  const loaderRef = useRef<HTMLSpanElement>(null);
  const successRef = useRef<HTMLSpanElement>(null);
  const errorRef = useRef<HTMLSpanElement>(null);

  const prevAsyncRef = useRef<ButtonAsyncState>("idle");
  const prevCrossfadeAsyncRef = useRef<ButtonAsyncState | undefined>(undefined);
  const asyncInFlight = useRef(false);
  const expandRippleLayerRef = useRef<ButtonExpandRippleHandle>(null);

  const initialAsyncRef = useRef(asyncState);
  /** First paint uses Tailwind hide; after sync GSAP owns visibility. */
  const [asyncMotionReady, setAsyncMotionReady] = useState(false);

  const bindLabelRef = useMemo(
    () => createButtonAsyncLayerRefCallback(labelRef, initialAsyncRef.current, "label"),
    [],
  );
  const bindLoaderRef = useMemo(
    () => createButtonAsyncLayerRefCallback(loaderRef, initialAsyncRef.current, "loader"),
    [],
  );
  const bindSuccessRef = useMemo(
    () => createButtonAsyncLayerRefCallback(successRef, initialAsyncRef.current, "success"),
    [],
  );
  const bindErrorRef = useMemo(
    () => createButtonAsyncLayerRefCallback(errorRef, initialAsyncRef.current, "error"),
    [],
  );

  const isGloss = variant === "gloss";
  const useContentRef = Boolean(groupSegment);
  const hasHoverShadow = BUTTON_VARIANT_HAS_HOVER_SHADOW.has(variant) && !isGloss && !useContentRef;
  const enabled = !blocked;
  const scope = useButtonMotionScope();
  const btnRef = useRef<HTMLButtonElement>(null);
  const contentMotionRef = useRef<HTMLSpanElement>(null);
  const rootMotionRef = useRef(motion?.root);
  rootMotionRef.current = motion?.root;

  const bindGlossRef = useMemo(
    () => createGlossInteractiveRefCallback(btnRef, isGloss),
    [isGloss],
  );

  const motionTarget = useCallback(
    () => (useContentRef ? contentMotionRef.current : btnRef.current),
    [useContentRef],
  );

  const setRefs = useCallback(
    (node: HTMLButtonElement | null) => {
      bindGlossRef(node);
      btnRef.current = node;
      if (!useContentRef) scope.registerTarget("root", node);
      mergeForwardedRef(forwardedRef, node);
    },
    [bindGlossRef, forwardedRef, scope, useContentRef],
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
      gsap.set(el, { clearProps: "boxShadow,scale,transform" });
    }
    if (content) {
      killMotion(content);
      content.style.transform = "";
    }
  }, [enabled, hoverPointerInsideRef]);

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

  const pushExpandRipple = useCallback((tone: "success" | "error") => {
    const el = btnRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    expandRippleLayerRef.current?.push(tone, centerCoverDiameter(r.width, r.height));
  }, []);

  // Sync expand ripples push with async state transitions
  useLayoutEffect(() => {
    if (!isControlled) return;
    const prev = prevAsyncRef.current;
    if (
      (asyncState === "success" || asyncState === "error") &&
      prev === "loading"
    ) {
      pushExpandRipple(asyncState === "success" ? "success" : "error");
    }
    prevAsyncRef.current = asyncState;
  }, [asyncState, isControlled, pushExpandRipple]);

  // Async layers: CSS hides inactive until ready; GSAP crossfades on state change only
  useLayoutEffect(() => {
    const label = labelRef.current;
    const loader = loaderRef.current;
    const success = successRef.current;
    const error = errorRef.current;
    if (!label || !loader || !success || !error) return;

    const reduceMotion =
      prefersReducedMotion() || !isMotionFeatureEnabled("enableAsyncButtonCrossfade");
    const vars = motionInteractive();

    const layers = [
      { el: label, active: asyncState === "idle", scaleIn: 1, scaleOut: 0.92 },
      { el: loader, active: asyncState === "loading", scaleIn: 1, scaleOut: 0.85 },
      { el: success, active: asyncState === "success", scaleIn: 1, scaleOut: 0.85 },
      { el: error, active: asyncState === "error", scaleIn: 1, scaleOut: 0.85 },
    ] as const;

    if (prevCrossfadeAsyncRef.current === undefined) {
      prevCrossfadeAsyncRef.current = asyncState;
      for (const { el, active, scaleIn, scaleOut } of layers) {
        killMotion(el);
        gsap.set(el, {
          autoAlpha: active ? 1 : 0,
          scale: active ? scaleIn : scaleOut,
        });
      }
      setAsyncMotionReady(true);
      return;
    }

    if (prevCrossfadeAsyncRef.current === asyncState) return;
    prevCrossfadeAsyncRef.current = asyncState;

    for (const { el, active, scaleIn, scaleOut } of layers) {
      killMotion(el);
      if (reduceMotion) {
        gsap.set(el, {
          autoAlpha: active ? 1 : 0,
          scale: active ? scaleIn : scaleOut,
        });
        continue;
      }
      gsap.to(el, {
        autoAlpha: active ? 1 : 0,
        scale: active ? scaleIn : scaleOut,
        ...vars,
        overwrite: "auto",
      });
    }
  }, [asyncState]);

  const createAsyncClickHandler = useCallback(
    (
      onClick: ((e: MouseEvent<HTMLButtonElement>) => void) | undefined,
      onAsyncClick: ((e: MouseEvent<HTMLButtonElement>) => Promise<boolean>) | undefined,
      isControlledArg: boolean,
      internalAsync: ButtonAsyncState,
      setUncontrolledAsync: (next: ButtonAsyncState) => void,
      scheduleAsyncIdleReset: () => void,
    ) =>
      (e: MouseEvent<HTMLButtonElement>) => {
        onClick?.(e);
        if (isControlledArg || !onAsyncClick || e.defaultPrevented) return;
        if (asyncInFlight.current || internalAsync !== "idle") return;
        asyncInFlight.current = true;
        setUncontrolledAsync("loading");
        Promise.resolve(onAsyncClick(e))
          .then((ok) => {
            const next = ok ? "success" : "error";
            setUncontrolledAsync(next);
            pushExpandRipple(next);
            scheduleAsyncIdleReset();
          })
          .catch(() => {
            setUncontrolledAsync("error");
            pushExpandRipple("error");
            scheduleAsyncIdleReset();
          })
          .finally(() => {
            asyncInFlight.current = false;
          });
      },
    [pushExpandRipple],
  );

  return {
    setRefs,
    contentMotionRef,
    bindLabelRef,
    bindLoaderRef,
    bindSuccessRef,
    bindErrorRef,
    expandRippleLayerRef,
    pushExpandRipple,
    pointerHandlers,
    handlePointerEnter,
    handlePointerLeave,
    handlePointerDown,
    handlePointerUp,
    handleKeyDown,
    createAsyncClickHandler,
    asyncInFlight,
    asyncMotionReady,
  };
}
