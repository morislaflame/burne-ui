import { clearWillChangeOnComplete, gsap, killMotion, setWillChangeTransform } from "@/components/core/utils/gsapMotion";
import { prefersReducedMotion, usePrefersReducedMotion } from "@/components/core/utils/reducedMotion";
import { isMotionFeatureEnabled, motionInteractive, motionToastDismiss } from "@/components/core/utils/motionConfig";
import { animatePortalClose, animatePortalOpen, applyReducedPortalMotion, isReducedModalMotion, MODAL_PANEL_SCALE_FROM } from "@/components/core/utils/modalSurfaceMotion";
import { toastScrimToken, TOAST_SCRIM_CSS_VAR } from "@/tokens/toastScrim";
import { useBurneLabel } from "@/theme/BurneLabelsProvider";
import { useCallback, useEffect, useLayoutEffect, useRef } from "react";

import {
  resolveToastStackContainerHeight,
  TOAST_ENTRY_OFFSET_PX,
  TOAST_MAX_VISIBLE,
  TOAST_STACK_PEEK_PX,
  TOAST_STACK_SCALE_STEP,
} from "./toastAPI";
import { toastViewportWidthPx } from "@/components/core/utils/sizeLayout";
import { toastViewportAriaLabel } from "./toastA11y";
import { ToastClassNamesProvider } from "./toastContext";
import { ToastRoot } from "./Toast";
import { toastScrimClass, toastStackClass, toastViewportClass } from "./toastStyles";
import type { ToastItemWrapperProps, ToastViewportProps } from "./toastTypes";

export function ToastItemWrapper({
  entry,
  reverseIdx,
  total,
  isTop,
  isDismissing,
  onDismiss,
  onRemoveFinal,
  onHeightChange,
  providerClassNames,
}: ToastItemWrapperProps) {
  const animRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const isMountedRef = useRef(false);
  const reduceMotionPreferred = usePrefersReducedMotion();

  const capped = Math.min(reverseIdx, TOAST_MAX_VISIBLE - 1);
  const stackScale = 1 - capped * TOAST_STACK_SCALE_STEP;
  const peekY = isTop ? capped * TOAST_STACK_PEEK_PX : -capped * TOAST_STACK_PEEK_PX;
  const stackOpacity = reverseIdx >= TOAST_MAX_VISIBLE ? 0 : 1;

  useLayoutEffect(() => {
    const el = stackRef.current;
    if (!el) return;

    const reduceMotion =
      reduceMotionPreferred || !isMotionFeatureEnabled("enableToastStack");

    const isFirstMount = !isMountedRef.current;
    isMountedRef.current = true;

    killMotion(el);

    if (reduceMotion) {
      gsap.set(el, {
        y: peekY,
        scale: stackScale,
        autoAlpha: stackOpacity,
      });
      return;
    }

    if (isFirstMount && entry.variant !== "gloss") {
      gsap.fromTo(
        el,
        { opacity: 0 },
        { opacity: stackOpacity, ...motionInteractive(), overwrite: "auto" },
      );
    } else {
      setWillChangeTransform(el, true);
      gsap.to(el, {
        y: peekY,
        scale: stackScale,
        autoAlpha: stackOpacity,
        ...motionInteractive(),
        overwrite: "auto",
        onComplete: clearWillChangeOnComplete(el),
      });
    }
  }, [entry.variant, peekY, reduceMotionPreferred, stackOpacity, stackScale]);

  useLayoutEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    onHeightChange(entry.id, el.offsetHeight);
    const ro = new ResizeObserver(() => {
      onHeightChange(entry.id, el.offsetHeight);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [entry.id, onHeightChange]);

  useLayoutEffect(() => {
    const el = animRef.current;
    if (!el) return;
    if (isReducedModalMotion()) {
      applyReducedPortalMotion(el);
      return;
    }
    const slideDir = isTop ? -TOAST_ENTRY_OFFSET_PX : TOAST_ENTRY_OFFSET_PX;
    animatePortalOpen({
      surface: el,
      vars: { ...motionInteractive(), overwrite: "auto" },
      from: { y: slideDir, scale: MODAL_PANEL_SCALE_FROM },
      to: { y: 0, scale: 1 },
    });
  }, [isTop]);

  useEffect(() => {
    if (!isDismissing) return;
    const el = animRef.current;
    if (!el) return;
    if (isReducedModalMotion()) {
      onRemoveFinal(entry.id);
      return;
    }
    const slideDir = isTop ? -TOAST_ENTRY_OFFSET_PX : TOAST_ENTRY_OFFSET_PX;
    killMotion(el);
    animatePortalClose({
      surface: el,
      vars: { ...motionToastDismiss(), overwrite: "auto" },
      exit: { y: slideDir },
      onComplete: () => onRemoveFinal(entry.id),
    });
  }, [isDismissing, isTop, entry.id, onRemoveFinal]);

  useEffect(() => {
    if (entry.timeout === 0 || isDismissing || entry.loading) return;

    let remaining = entry.timeout;
    let startedAt: number | null = Date.now();
    let timerId: number | undefined;
    let paused = false;

    const clear = () => {
      if (timerId != null) {
        window.clearTimeout(timerId);
        timerId = undefined;
      }
    };

    const arm = () => {
      clear();
      startedAt = Date.now();
      timerId = window.setTimeout(() => onDismiss(entry.id), remaining);
    };

    const pause = () => {
      if (paused || startedAt == null) return;
      paused = true;
      remaining = Math.max(0, remaining - (Date.now() - startedAt));
      startedAt = null;
      clear();
    };

    const resume = () => {
      if (!paused) return;
      paused = false;
      if (remaining <= 0) {
        onDismiss(entry.id);
        return;
      }
      arm();
    };

    arm();

    const node = stackRef.current;
    const onPointerEnter = () => pause();
    const onPointerLeave = () => resume();
    const onFocusIn = () => pause();
    const onFocusOut = (e: FocusEvent) => {
      if (node && e.relatedTarget instanceof Node && node.contains(e.relatedTarget)) {
        return;
      }
      resume();
    };

    node?.addEventListener("pointerenter", onPointerEnter);
    node?.addEventListener("pointerleave", onPointerLeave);
    node?.addEventListener("focusin", onFocusIn);
    node?.addEventListener("focusout", onFocusOut);

    return () => {
      clear();
      node?.removeEventListener("pointerenter", onPointerEnter);
      node?.removeEventListener("pointerleave", onPointerLeave);
      node?.removeEventListener("focusin", onFocusIn);
      node?.removeEventListener("focusout", onFocusOut);
    };
  }, [entry.id, entry.timeout, isDismissing, entry.loading, onDismiss]);

  const dismiss = useCallback(() => onDismiss(entry.id), [entry.id, onDismiss]);

  const isVisible = reverseIdx < total;
  const mergedClassNames = { ...providerClassNames, ...entry.classNames };

  return (
    <div
      ref={stackRef}
      aria-hidden={!isVisible || undefined}
      style={{
        gridColumn: 1,
        gridRow: 1,
        transformOrigin: isTop ? "top center" : "bottom center",
        zIndex: TOAST_MAX_VISIBLE + 1 - reverseIdx,
        pointerEvents: reverseIdx === 0 ? "auto" : "none",
      }}
    >
      <div ref={animRef}>
        <ToastClassNamesProvider classNames={mergedClassNames}>
          <ToastRoot
            ref={cardRef}
            status={entry.status}
            variant={entry.variant}
            size={entry.size}
            title={entry.title}
            description={entry.description}
            action={entry.action}
            loading={entry.loading}
            onClose={dismiss}
          />
        </ToastClassNamesProvider>
      </div>
    </div>
  );
}

function applyToastStackContainerHeight(el: HTMLElement, containerH: number) {
  if (containerH <= 0) return;

  const reduceMotion =
    prefersReducedMotion() || !isMotionFeatureEnabled("enableToastStack");

  killMotion(el);

  if (reduceMotion) {
    el.style.height = `${containerH}px`;
    return;
  }

  gsap.to(el, {
    height: containerH,
    ...motionInteractive(),
    overwrite: "auto",
  });
}

export function ToastViewport({
  placement,
  sorted,
  dismissingIds,
  onDismiss,
  onRemoveFinal,
  classNames,
  defaultSize = "base",
}: ToastViewportProps) {
  const isTop = placement.startsWith("top");
  const toastNotificationsLabel = useBurneLabel("toastNotifications");
  const heightsRef = useRef<Map<string, number>>(null!);
  if (!heightsRef.current) heightsRef.current = new Map();
  const containerRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const prevContainerHRef = useRef(0);
  const stackMetaRef = useRef({
    frontId: sorted[0]?.id as string | undefined,
    count: sorted.length,
  });
  stackMetaRef.current = { frontId: sorted[0]?.id, count: sorted.length };
  const reduceMotionPreferred = usePrefersReducedMotion();

  const syncContainerHeight = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    const { frontId, count } = stackMetaRef.current;
    const frontHeight =
      frontId != null ? (heightsRef.current.get(frontId) ?? 0) : 0;
    const raw = resolveToastStackContainerHeight(frontHeight, count);
    const containerH = raw > 0 ? raw : prevContainerHRef.current;
    if (raw > 0) prevContainerHRef.current = raw;

    applyToastStackContainerHeight(el, containerH);
  }, []);

  const onHeightChange = useCallback(
    (id: string, h: number) => {
      if (heightsRef.current.get(id) === h) return;
      heightsRef.current.set(id, h);
      // Container height depends only on the front card + stack depth.
      if (id === stackMetaRef.current.frontId) {
        syncContainerHeight();
      }
    },
    [syncContainerHeight],
  );

  useLayoutEffect(() => {
    const liveIds = new Set(sorted.map((entry) => entry.id));
    for (const id of heightsRef.current.keys()) {
      if (!liveIds.has(id)) heightsRef.current.delete(id);
    }
    syncContainerHeight();
  }, [sorted, syncContainerHeight]);

  useLayoutEffect(() => {
    const el = scrimRef.current;
    if (el) gsap.set(el, { opacity: 0 });
  }, []);

  useLayoutEffect(() => {
    const el = scrimRef.current;
    if (!el) return;

    const reduceMotion = reduceMotionPreferred;

    const isLastDismissing =
      sorted.length === 1 && dismissingIds.has(sorted[0]?.id ?? "");

    killMotion(el);

    if (reduceMotion) {
      gsap.set(el, { opacity: isLastDismissing ? 0 : 1 });
      return;
    }

    if (isLastDismissing) {
      gsap.to(el, { opacity: 0, ...motionToastDismiss(), overwrite: "auto" });
    } else {
      gsap.to(el, { opacity: 1, ...motionInteractive(), overwrite: "auto" });
    }
  }, [sorted, dismissingIds, reduceMotionPreferred]);

  return (
    <div
      role="region"
      aria-label={toastViewportAriaLabel(placement, toastNotificationsLabel)}
      className={toastViewportClass({ placement, slotClass: classNames?.viewport })}
      style={{ width: toastViewportWidthPx(sorted, defaultSize) }}
    >
      <div
        ref={scrimRef}
        aria-hidden
        className={toastScrimClass(classNames?.scrim)}
        style={{
          [isTop ? "top" : "bottom"]: `calc(-1 * ${toastScrimToken(TOAST_SCRIM_CSS_VAR.offsetY)})`,
          left: `calc(-1 * ${toastScrimToken(TOAST_SCRIM_CSS_VAR.insetX)})`,
          right: `calc(-1 * ${toastScrimToken(TOAST_SCRIM_CSS_VAR.insetX)})`,
          height: toastScrimToken(TOAST_SCRIM_CSS_VAR.height),
          background: isTop
            ? toastScrimToken(TOAST_SCRIM_CSS_VAR.gradientTop)
            : toastScrimToken(TOAST_SCRIM_CSS_VAR.gradientBottom),
          maskImage: toastScrimToken(TOAST_SCRIM_CSS_VAR.mask),
          WebkitMaskImage: toastScrimToken(TOAST_SCRIM_CSS_VAR.mask),
        }}
      />
      <div
        ref={containerRef}
        className={toastStackClass(classNames?.stack)}
        style={{
          alignItems: isTop ? "start" : "end",
        }}
      >
        {sorted.map((entry, reverseIdx) => (
          <ToastItemWrapper
            key={entry.id}
            entry={entry}
            reverseIdx={reverseIdx}
            total={sorted.length}
            isTop={isTop}
            isDismissing={dismissingIds.has(entry.id)}
            onDismiss={onDismiss}
            onRemoveFinal={onRemoveFinal}
            onHeightChange={onHeightChange}
            providerClassNames={classNames}
          />
        ))}
      </div>
    </div>
  );
}
