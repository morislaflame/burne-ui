import { useMotionConfig } from "@/components/core/utils/motionConfigContext";
import { applyReducedPortalMotion, isReducedModalMotion } from "@/components/core/utils/modalSurfaceMotion";
import { applyToastRootInstant } from "@/components/core/utils/slotMotion/recipes/toastSurface";
import { applyToastStackInstant } from "@/components/core/utils/slotMotion/recipes/toastStackShift";
import { applyToastScrimInstant } from "@/components/core/utils/slotMotion/recipes/toastScrimFade";
import {
  hideNestedEnterSlots,
  killMotionScope,
  mergeMotionSlotMaps,
  mergeMotionRootSiblings,
  splitMotionRootMap,
  scheduleNestedEnterBroadcast,
  useMotionPart,
  waitForLeaveGeneration,
} from "@/components/core/utils/slotMotion";
import { toastScrimToken, TOAST_SCRIM_CSS_VAR } from "@/tokens/toastScrim";
import { useBurneLabel } from "@/theme/BurneLabelsProvider";
import { isKitVariant } from "@/skins/resolveVariantVisual";
import { useApplySkinPortal, useSkinRegistryRevision, useSkinVariant } from "@/skins/skinContext";
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
import { resolveToastMotionDefaults, TOAST_VIEWPORT_MOTION_DEFAULTS } from "./toastMotionDefaults";
import {
  toastScrimClass,
  toastStackClass,
  toastStackItemClass,
  toastStackItemStyle,
  toastViewportClass,
  toastViewportWidthStyle,
} from "./toastStyles";
import type { ToastItemWrapperProps, ToastViewportProps } from "./toastTypes";
import { KIT_TOAST_VARIANTS } from "./toastTypes";
 
/**
 * Slot motion for Toast — look here first.
 *
 * DOM slots: `root` (enter/leave surface), `indicator`, `title`, `description`,
 * `action`, `close`, `stackItem` (peek), `scrim` (viewport). `message` / `content`
 * are `display: contents`. Viewport height is `--toast-stack-height`, not a tween.
 *
 * Host: `ToastItemWrapper` plays `enter` / `leave` on `root` and broadcasts
 * nested slots (`scheduleNestedEnterBroadcast`). Nested parts do not own mount enter.
 * Defaults wrap the item host (`TOAST_MOTION_DEFAULTS`).
 * `Toast.Provider` / `add().motion` pass the map (like Dialog root).
 */
export const TOAST_MOTION_HOST_SLOTS = ["root"] as const;

/** `stackItem` is the card shell, not nested content. The host plays enter / change. */
const TOAST_NESTED_ENTER_EXCLUDE = ["root", "stackItem"] as const;
 
export { TOAST_MOTION_DEFAULTS } from "./toastMotionDefaults";
 
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
  const config = useMotionConfig();
  const scope = useToastMotionScope();
  const animRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const isMountedRef = useRef(false);
  const slideDir = isTop ? -TOAST_ENTRY_OFFSET_PX : TOAST_ENTRY_OFFSET_PX;
 
  const { setRef: setRootPartRef } = useMotionPart<HTMLDivElement>({
    scope,
    slot: "root",
  });
  const { setRef: setStackPartRef } = useMotionPart<HTMLDivElement>({
    scope,
    slot: "stackItem",
    pointerPhases: false,
  });
  const setStackRef = useCallback(
    (node: HTMLDivElement | null) => {
      stackRef.current = node;
      setStackPartRef(node);
    },
    [setStackPartRef],
  );
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

    const stack = { peekY, scale: stackScale, opacity: stackOpacity };
    const isFirstMount = !isMountedRef.current;
    isMountedRef.current = true;
    const phase =
      isFirstMount && isKitVariant(entry.variant, KIT_TOAST_VARIANTS) ? "enter" : "change";
    const value = scope.resolve("stackItem", phase);
    if (value === false || value === undefined) {
      applyToastStackInstant(el, stack);
      return;
    }
    scope.play("stackItem", phase, { el, params: { toastStack: stack } });
  }, [entry.variant, peekY, scope, stackOpacity, stackScale]);
 
  useLayoutEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    // Measured stack geometry (peek / viewport height), not an enter-layout flush.
    onHeightChange(entry.id, el.offsetHeight);
    if (typeof ResizeObserver === "undefined") return;
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
    if (value === false || isReducedModalMotion(config)) {
      if (value === false) applyToastRootInstant(el, true, slideDir);
      else applyReducedPortalMotion(el);
      return;
    }
    hideNestedEnterSlots(scope, TOAST_NESTED_ENTER_EXCLUDE);
    scope.play("root", "enter", { el });
    const frame = scheduleNestedEnterBroadcast(scope, TOAST_NESTED_ENTER_EXCLUDE);
    return () => cancelAnimationFrame(frame);
  }, [config, scope, slideDir]);
 
  useEffect(() => {
    if (!isDismissing) return;
    const el = animRef.current;
    if (!el) return;
    if (isReducedModalMotion(config)) {
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
    const leaveWait = waitForLeaveGeneration({
      runs: [run],
      extra,
      onComplete: () => onRemoveFinal(entry.id),
      onKill: () => killMotionScope(scope),
    });
    return () => {
      leaveWait.kill();
    };
  }, [config, entry.id, isDismissing, onRemoveFinal, scope, slideDir]);
 
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
      ref={setStackRef}
      aria-hidden={!isVisible || undefined}
      className={toastStackItemClass(mergedClassNames.stackItem)}
      style={toastStackItemStyle({
        origin: isTop ? "top center" : "bottom center",
        zIndex: TOAST_MAX_VISIBLE + 1 - reverseIdx,
        pointerEvents: reverseIdx === 0 ? "auto" : "none",
      })}
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
  const toastVariant = useSkinVariant(entry.variant);
  const skinRevision = useSkinRegistryRevision();
  const motionDefaults = useMemo(() => {
    void skinRevision;
    return resolveToastMotionDefaults(toastVariant);
  }, [skinRevision, toastVariant]);
  const mergedMotion = useMemo(() => {
    const mergedSlots = mergeMotionSlotMaps(providerMotion, entry.motion);
    const siblings = mergeMotionRootSiblings(
      splitMotionRootMap(providerMotion),
      splitMotionRootMap(entry.motion),
    );
    return { ...mergedSlots, ...siblings };
  }, [entry.motion, providerMotion]);
 
  return (
    <ToastMotionProvider
      motion={mergedMotion}
      defaults={motionDefaults}
      params={{ isTop, slideDir }}
      controller={entry.motionController}
      motionState={entry.motionState}
      motionPayload={entry.motionPayload}
      playInitialState={entry.playInitialState}
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
 
/** Layout, not a tween. Same exception class as `searchExpand`: the stack shell tracks the front card. */
function applyToastStackContainerHeight(el: HTMLElement, containerH: number) {
  if (containerH <= 0) return;
  el.style.setProperty("--toast-stack-height", `${containerH}px`);
}
 
function ToastScrim({
  isTop,
  sorted,
  dismissingIds,
  className,
}: {
  isTop: boolean;
  sorted: ToastViewportProps["sorted"];
  dismissingIds: ToastViewportProps["dismissingIds"];
  className?: string;
}) {
  const scope = useToastMotionScope();
  const firstRef = useRef(true);
  const part = useMotionPart<HTMLDivElement>({
    scope,
    slot: "scrim",
    pointerPhases: false,
  });

  useLayoutEffect(() => {
    const el = part.targetRef.current;
    if (!el) return;

    const fromZero = firstRef.current;
    firstRef.current = false;
    const isLastDismissing =
      sorted.length === 1 && dismissingIds.has(sorted[0]?.id ?? "");
    const phase = isLastDismissing ? "leave" : "enter";
    const scrim = { opacity: isLastDismissing ? 0 : 1, dismiss: isLastDismissing, fromZero };
    const value = scope.resolve("scrim", phase);
    if (value === false || value === undefined) {
      applyToastScrimInstant(el, scrim.opacity);
      return;
    }
    scope.play("scrim", phase, { el, params: { toastScrim: scrim } });
  }, [dismissingIds, part.targetRef, scope, sorted]);

  return (
    <div
      ref={part.setRef}
      aria-hidden
      className={toastScrimClass(className)}
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
  );
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
  useApplySkinPortal(containerRef);
  const prevContainerHRef = useRef(0);
  const stackMetaRef = useRef({
    frontId: sorted[0]?.id as string | undefined,
    count: sorted.length,
  });
  // react-doctor-disable-next-line react-doctor/no-ref-current-in-render -- latest value so child layout effects see this render; an effect runs too late
  stackMetaRef.current = { frontId: sorted[0]?.id, count: sorted.length };
 
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

  return (
    <ToastMotionProvider motion={motion} defaults={TOAST_VIEWPORT_MOTION_DEFAULTS}>
    <div
      role="region"
      aria-label={toastViewportAriaLabel(placement, toastNotificationsLabel)}
      className={toastViewportClass({ placement, slotClass: classNames?.viewport })}
      style={toastViewportWidthStyle(toastViewportWidthPx(sorted, defaultSize))}
    >
      <ToastScrim
        isTop={isTop}
        sorted={sorted}
        dismissingIds={dismissingIds}
        className={classNames?.scrim}
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
    </ToastMotionProvider>
  );
}
 