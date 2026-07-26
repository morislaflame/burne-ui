import { gsap, killMotion } from "@/components/core/utils/gsapMotion";
import { prefersReducedInteractiveHoverLift } from "@/components/core/utils/hoverInteractiveLift";
import { getMotionConfig, motionInteractive, motionToastDismiss } from "@/components/core/utils/motionConfig";
import { animatePortalClose, animatePortalOpen, applyReducedPortalMotion, isReducedModalMotion, MODAL_PANEL_SCALE_FROM } from "@/components/core/utils/modalSurfaceMotion";
import { toastScrimToken, TOAST_SCRIM_CSS_VAR } from "@/tokens/toastScrim";
import { useBurneLabel } from "@/theme/BurneLabelsProvider";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

import { TOAST_ENTRY_OFFSET_PX, TOAST_MAX_VISIBLE, TOAST_STACK_PEEK_PX, TOAST_STACK_SCALE_STEP } from "./toastAPI";
import { toastViewportWidthPx } from "@/components/core/utils/sizeLayout";
import { toastViewportAriaLabel } from "./toastA11y";
import { ToastClassNamesProvider } from "./toastContext";
import { ToastRoot } from "./Toast";
import { TOAST_STACK_ITEM_CLASS, toastScrimClass, toastStackClass, toastViewportClass } from "./toastStyles";
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

  const capped = Math.min(reverseIdx, TOAST_MAX_VISIBLE - 1);
  const stackScale = 1 - capped * TOAST_STACK_SCALE_STEP;
  const peekY = isTop ? capped * TOAST_STACK_PEEK_PX : -capped * TOAST_STACK_PEEK_PX;
  const stackOpacity = reverseIdx >= TOAST_MAX_VISIBLE ? 0 : 1;

  useLayoutEffect(() => {
    const el = stackRef.current;
    if (!el) return;

    const reduceMotion =
      prefersReducedInteractiveHoverLift() || !getMotionConfig().enableToastStack;

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
      gsap.to(el, {
        y: peekY,
        scale: stackScale,
        autoAlpha: stackOpacity,
        ...motionInteractive(),
        overwrite: "auto",
      });
    }
  }, [entry.variant, peekY, stackOpacity, stackScale]);

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
      className={TOAST_STACK_ITEM_CLASS}
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
  const [heights, setHeights] = useState<Map<string, number>>(new Map());
  const containerRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const prevContainerHRef = useRef(0);

  const onHeightChange = useCallback((id: string, h: number) => {
    setHeights((prev) => {
      const next = new Map(prev);
      next.set(id, h);
      return next;
    });
  }, []);

  const frontHeight = (sorted[0] && heights.get(sorted[0].id)) ?? 0;
  const extraPeek = Math.min(sorted.length - 1, TOAST_MAX_VISIBLE - 1) * TOAST_STACK_PEEK_PX;
  const rawContainerH = frontHeight + extraPeek;
  const containerH = rawContainerH > 0 ? rawContainerH : prevContainerHRef.current;
  if (rawContainerH > 0) prevContainerHRef.current = rawContainerH;

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el || containerH <= 0) return;

    const reduceMotion =
      prefersReducedInteractiveHoverLift() || !getMotionConfig().enableToastStack;

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
  }, [containerH]);

  useLayoutEffect(() => {
    const el = scrimRef.current;
    if (el) gsap.set(el, { opacity: 0 });
  }, []);

  useLayoutEffect(() => {
    const el = scrimRef.current;
    if (!el) return;

    const reduceMotion = prefersReducedInteractiveHoverLift();

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
  }, [sorted, dismissingIds]);

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
          height: containerH || undefined,
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
