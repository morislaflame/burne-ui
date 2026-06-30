import { gsap, killMotion } from "@/components/core/utils/gsapMotion";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
} from "react";

import {
  animateInteractiveHoverLift,
  animateInteractivePressSqueeze,
  prefersReducedInteractiveHoverLift,
  shouldSkipInteractiveHoverLift,
} from "@/components/core/utils/hoverInteractiveLift";
import { firstLevelHoverShadow } from "@/components/core/utils/useShadowMotion";
import {
  animateGlossInteractiveHoverLift,
  animateGlossInteractivePressSqueeze,
  createGlossInteractiveRefCallback,
} from "@/components/core/utils/glossInteractiveMotion";
import { getMotionConfig, motionInteractive } from "@/components/core/utils/motionConfig";

import { centerCoverDiameter, isButtonAsyncLayerActive } from "./buttonAPI";
import type { ButtonAsyncLayerKind, ButtonAsyncState, ExpandRipple, UseButtonAnimationsProps } from "./buttonTypes";
import { BUTTON_VARIANT_HAS_HOVER_SHADOW } from "./buttonStyles";

const BUTTON_ASYNC_LAYER_INIT_ATTR = "data-button-async-layer-init";

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
  animated,
  asyncState,
  isControlled,
  blocked,
  userDisabled,
  groupSegment,
  forwardedRef,
  onPointerEnter,
  onPointerLeave,
}: UseButtonAnimationsProps) {
  const isGloss = variant === "gloss";
  const btnRef = useRef<HTMLButtonElement>(null);
  const contentMotionRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const loaderRef = useRef<HTMLSpanElement>(null);
  const successRef = useRef<HTMLSpanElement>(null);
  const errorRef = useRef<HTMLSpanElement>(null);
  const hoverPointerInsideRef = useRef(false);
  const asyncStateRef = useRef<ButtonAsyncState>("idle");
  const expandId = useRef(0);
  const prevAsyncRef = useRef<ButtonAsyncState>("idle");
  const prevCrossfadeAsyncRef = useRef<ButtonAsyncState | undefined>(undefined);
  const asyncInFlight = useRef(false);

  asyncStateRef.current = asyncState;
  const initialAsyncRef = useRef(asyncState);

  const [expandRipples, setExpandRipples] = useState<ExpandRipple[]>([]);

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

  const bindGlossRef = useMemo(
    () => createGlossInteractiveRefCallback(btnRef, isGloss),
    [isGloss],
  );

  const setRefs = useCallback(
    (node: HTMLButtonElement | null) => {
      bindGlossRef(node);
      btnRef.current = node;
      if (typeof forwardedRef === "function") forwardedRef(node);
      else if (forwardedRef) forwardedRef.current = node;
    },
    [bindGlossRef, forwardedRef],
  );

  const pushExpandRipple = useCallback((tone: "success" | "error") => {
    const el = btnRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const size = centerCoverDiameter(r.width, r.height);
    const id = ++expandId.current;
    setExpandRipples((prev) => [...prev, { id, size, tone }]);
  }, []);

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

  useLayoutEffect(() => {
    const label = labelRef.current;
    const loader = loaderRef.current;
    const success = successRef.current;
    const error = errorRef.current;
    if (!label || !loader || !success || !error) return;

    const reduceMotion =
      prefersReducedInteractiveHoverLift() || !getMotionConfig().enableAsyncButtonCrossfade;
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

  useEffect(() => {
    const el = btnRef.current;
    const content = contentMotionRef.current;
    if (!blocked || (!el && !content)) return;
    hoverPointerInsideRef.current = false;
    if (el) killMotion(el);
    if (content) {
      killMotion(content);
      content.style.transform = "";
    }
  }, [blocked]);

  const btnShadow = useMemo(
    () =>
      BUTTON_VARIANT_HAS_HOVER_SHADOW.has(variant)
        ? firstLevelHoverShadow()
        : undefined,
    [variant],
  );

  const handlePointerEnter = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      onPointerEnter?.(e);
      if (e.defaultPrevented) return;
      if (blocked) return;
      if (shouldSkipInteractiveHoverLift()) return;
      const el = groupSegment ? contentMotionRef.current : btnRef.current;
      if (!el) return;
      hoverPointerInsideRef.current = true;
      if (isGloss && !groupSegment) {
        animateGlossInteractiveHoverLift(el, true);
      } else {
        animateInteractiveHoverLift(el, true, undefined, groupSegment ? undefined : btnShadow);
      }
    },
    [blocked, btnShadow, groupSegment, isGloss, onPointerEnter],
  );

  const handlePointerLeave = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      onPointerLeave?.(e);
      hoverPointerInsideRef.current = false;
      if (blocked) return;
      if (shouldSkipInteractiveHoverLift()) return;
      const el = groupSegment ? contentMotionRef.current : btnRef.current;
      if (!el) return;
      if (isGloss && !groupSegment) {
        animateGlossInteractiveHoverLift(el, false);
      } else {
        animateInteractiveHoverLift(el, false, undefined, groupSegment ? undefined : btnShadow);
      }
    },
    [blocked, btnShadow, groupSegment, isGloss, onPointerLeave],
  );

  const onAnimeDown = useCallback(() => {
    const el = groupSegment ? contentMotionRef.current : btnRef.current;
    if (!animated || !el || asyncState !== "idle") return;
    if (prefersReducedInteractiveHoverLift()) return;
    const afterPress = () => {
      const btn = groupSegment ? contentMotionRef.current : btnRef.current;
      if (!btn || userDisabled || asyncStateRef.current !== "idle") return;
      if (shouldSkipInteractiveHoverLift()) return;
      if (hoverPointerInsideRef.current) {
        if (isGloss && !groupSegment) {
          animateGlossInteractiveHoverLift(btn, true);
        } else {
          animateInteractiveHoverLift(btn, true, undefined, groupSegment ? undefined : btnShadow);
        }
      }
    };

    if (isGloss && !groupSegment) {
      void animateGlossInteractivePressSqueeze(el, hoverPointerInsideRef.current);
      return;
    }

    void animateInteractivePressSqueeze(el).then(afterPress);
  }, [animated, asyncState, btnShadow, groupSegment, isGloss, userDisabled]);

  const dismissExpand = useCallback((id: number) => {
    setExpandRipples((prev) => prev.filter((rp) => rp.id !== id));
  }, []);

  const createAsyncClickHandler = useCallback(
    (
      onClick: ((e: MouseEvent<HTMLButtonElement>) => void) | undefined,
      onAsyncClick: ((e: MouseEvent<HTMLButtonElement>) => Promise<boolean>) | undefined,
      isControlled: boolean,
      internalAsync: ButtonAsyncState,
      setUncontrolledAsync: (next: ButtonAsyncState) => void,
      scheduleAsyncIdleReset: () => void,
    ) =>
      (e: MouseEvent<HTMLButtonElement>) => {
        onClick?.(e);
        if (isControlled || !onAsyncClick || e.defaultPrevented) return;
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
    expandRipples,
    dismissExpand,
    pushExpandRipple,
    handlePointerEnter,
    handlePointerLeave,
    onAnimeDown,
    createAsyncClickHandler,
    asyncInFlight,
  };
}
