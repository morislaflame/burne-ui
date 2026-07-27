import { gsap, killMotion } from "@/components/core/utils/gsapMotion";
import { useCallback, useLayoutEffect, useMemo, useRef, type MouseEvent } from "react";

import { useFirstLevelInteractiveMotion } from "@/components/core/utils/useFirstLevelInteractiveMotion";
import { isMotionFeatureEnabled, motionInteractive } from "@/components/core/utils/motionConfig";
import { prefersReducedMotion } from "@/components/core/utils/reducedMotion";

import { isButtonAsyncLayerActive, centerCoverDiameter } from "./buttonAPI";
import type {
  ButtonAsyncLayerKind,
  ButtonAsyncState,
  ButtonExpandRippleHandle,
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

export function useButtonAnimations({
  variant,
  asyncState,
  isControlled,
  blocked,
  groupSegment,
  forwardedRef,
  onPointerEnter,
  onPointerLeave,
  onPointerDown,
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

  // Shared interactive motion (hover lift, press squeeze, refs merge)
  const motionRefs = useFirstLevelInteractiveMotion({
    isGloss: variant === "gloss",
    enabled: !blocked,
    hasHoverShadow: BUTTON_VARIANT_HAS_HOVER_SHADOW.has(variant),
    useContentRef: !!groupSegment,
    forwardedRef,
    onPointerEnter,
    onPointerLeave,
    onPointerDown,
  });

  const pushExpandRipple = useCallback((tone: "success" | "error") => {
    const el = motionRefs.btnRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    expandRippleLayerRef.current?.push(tone, centerCoverDiameter(r.width, r.height));
  }, [motionRefs.btnRef]);

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

  // Async crossfade between label / loader / success / error layers
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
    setRefs: motionRefs.setRefs,
    contentMotionRef: motionRefs.contentMotionRef,
    bindLabelRef,
    bindLoaderRef,
    bindSuccessRef,
    bindErrorRef,
    expandRippleLayerRef,
    pushExpandRipple,
    handlePointerEnter: motionRefs.handlePointerEnter,
    handlePointerLeave: motionRefs.handlePointerLeave,
    handlePointerDown: motionRefs.handlePointerDown,
    createAsyncClickHandler,
    asyncInFlight,
  };
}
