import { clearWillChangeOnComplete, gsap, killMotion, setWillChangeTransform } from "@/components/core/utils/gsapMotion";
import { prefersReducedMotion, usePrefersReducedMotion } from "@/components/core/utils/reducedMotion";
import { isMotionFeatureEnabled, motionInteractive, motionToastDismiss } from "@/components/core/utils/motionConfig";
import { applyReducedPortalMotion, isReducedModalMotion } from "@/components/core/utils/modalSurfaceMotion";
import { applyToastRootInstant } from "@/components/core/utils/slotMotion/recipes/toastSurface";
import {
  isMotionVarsObject,
  killMotionTargets,
  mergeMotionSlotMaps,
  useMotionPart,
  type MotionScopeValue,
  type MotionValue,
} from "@/components/core/utils/slotMotion";
import { toastScrimToken, TOAST_SCRIM_CSS_VAR } from "@/tokens/toastScrim";
import { useBurneLabel } from "@/theme/BurneLabelsProvider";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from "react";

import {
  resolveToastStackContainerHeight,
  TOAST_ENTRY_OFFSET_PX,
  TOAST_MAX_VISIBLE,
  TOAST_STACK_PEEK_PX,
  TOAST_STACK_SCALE_STEP,
} from "./toastAPI";
import { toastViewportWidthPx } from "@/components/core/utils/sizeLayout";
import { toastViewportAriaLabel } from "./toastA11y";
import {
  ToastClassNamesProvider,
  ToastMotionProvider,
  useToastMotionScope,
} from "./toastContext";
import { ToastRoot } from "./Toast";
import { toastScrimClass, toastStackClass, toastViewportClass } from "./toastStyles";
import type { ToastItemWrapperProps, ToastMotion, ToastViewportProps } from "./toastTypes";

/**
 * Slot motion for Toast — look here first.
 *
 * DOM slots: `root` (enter/leave surface), `indicator`, `title`, `description`,
 * `action`, `close`. `message` / `content` are `display: contents`. Stack peek,
 * viewport height and scrim stay kit-internal.
 *
 * Host: `ToastItemWrapper` plays `enter` / `leave` on `root` and broadcasts
 * nested slots. Defaults wrap the item host (`TOAST_MOTION_DEFAULTS`).
 * `Toast.Provider` / `add().motion` pass the map (like Dialog root).
 */
export const TOAST_MOTION_HOST_SLOTS = ["root"] as const;

export const TOAST_MOTION_DEFAULTS: ToastMotion = {
  root: { enter: "toastSurfaceEnter", leave: "toastSurfaceLeave" },
};

function enterHidesFirstPaint(value: MotionValue | undefined): boolean {
  if (value === undefined || value === false) return false;
  return isMotionVarsObject(value) && value.autoAlpha !== undefined;
}

function hideNestedEnterSlots(scope: MotionScopeValue, exclude: readonly string[]): void {
  const skip = new Set(exclude);
  const targets = scope.getTargets();
  const slots = new Set([
    ...Object.keys(scope.getDefaults() ?? {}),
    ...Object.keys(scope.getRootMotion() ?? {}),
    ...Object.keys(targets),
  ]);
  for (const slot of slots) {
    if (skip.has(slot)) continue;
    const el = targets[slot];
    if (!el) continue;
    if (!enterHidesFirstPaint(scope.resolve(slot, "enter"))) continue;
    gsap.set(el, { autoAlpha: 0, force3D: false });
  }
}

function ToastItemMotionHost({
  entry,
  reverseIdx,
  total,
  isTop,
  isDismissing,
  onDismiss,
  onRemoveFinal,
  onHeightChange,
  providerClassNames,
}: Omit<ToastItemWrapperProps, "providerMotion">) {
  const scope = useToastMotionScope();
  const animRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const isMountedRef = useRef(false);
  const reduceMotionPreferred = usePrefersReducedMotion();
  const slideDir = isTop ? -TOAST_ENTRY_OFFSET_PX : TOAST_ENTRY_OFFSET_PX;

  const { setRef: setRootPartRef } = useMotionPart<HTMLDivElement>({
    scope,
    slot: "root",
  });
  const setAnimRef = useCallback(
    (node: HTMLDivElement | null) => {
      animRef.current = node;
      setRootPartRef(node);
    },
    [setRootPartRef],
  );

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
    const value = scope.resolve("root", "enter");
    if (value === false || isReducedModalMotion()) {
      if (value === false) applyToastRootInstant(el, true, slideDir);
      else applyReducedPortalMotion(el);
      return;
    }
    hideNestedEnterSlots(scope, TOAST_MOTION_HOST_SLOTS);
    scope.play("root", "enter", { el });
    const frame = requestAnimationFrame(() => {
      void el.offsetHeight;
      void scope.playBroadcast("enter", { exclude: [...TOAST_MOTION_HOST_SLOTS] });
    });
    return () => cancelAnimationFrame(frame);
  }, [scope, slideDir]);

  useEffect(() => {
    if (!isDismissing) return;
    const el = animRef.current;
    if (!el) return;
    let cancelled = false;
    if (isReducedModalMotion()) {
      onRemoveFinal(entry.id);
      return undefined;
    }
    const value = scope.resolve("root", "leave");
    if (value === false) {
      applyToastRootInstant(el, false, slideDir);
    }
    const run = scope.play("root", "leave", { el, waitForComplete: true });
    const extra = scope.playBroadcast("leave", {
      exclude: [...TOAST_MOTION_HOST_SLOTS],
      waitForComplete: true,
    });
    void Promise.all([run.finished, extra]).then(() => {
      if (!cancelled) onRemoveFinal(entry.id);
    });
    return () => {
      cancelled = true;
      run.animation?.kill();
      killMotionTargets(scope.getTargets());
    };
  }, [entry.id, isDismissing, onRemoveFinal, scope, slideDir]);

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
      <div ref={setAnimRef}>
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
  providerMotion,
}: ToastItemWrapperProps) {
  const slideDir = isTop ? -TOAST_ENTRY_OFFSET_PX : TOAST_ENTRY_OFFSET_PX;
  const mergedMotion = useMemo(
    () => mergeMotionSlotMaps(providerMotion, entry.motion) as ToastMotion | undefined,
    [entry.motion, providerMotion],
  );

  return (
    <ToastMotionProvider
      motion={mergedMotion}
      defaults={TOAST_MOTION_DEFAULTS}
      params={{ isTop, slideDir }}
    >
      <ToastItemMotionHost
        entry={entry}
        reverseIdx={reverseIdx}
        total={total}
        isTop={isTop}
        isDismissing={isDismissing}
        onDismiss={onDismiss}
        onRemoveFinal={onRemoveFinal}
        onHeightChange={onHeightChange}
        providerClassNames={providerClassNames}
      />
    </ToastMotionProvider>
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
  motion,
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
            providerMotion={motion}
          />
        ))}
      </div>
    </div>
  );
}
