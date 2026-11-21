import { dataExpandedState } from "@/components/core/utils/dataContract";
import { useMotionConfig } from "@/components/core/utils/motionConfigContext";
import { applyReducedPortalMotion, isReducedModalMotion } from "@/components/core/utils/modalSurfaceMotion";
import { prefersReducedMotion } from "@/components/core/utils/reducedMotion";
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
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
 
import {
  resolveToastStackLayout,
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
  TOAST_SHADOW_SIZE,
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
 * Host: `ToastItemWrapper` plays `enter` / `leave` on the enter wrapper (`root`).
 * Hover lift plays on the card (`ToastRoot`), not this wrapper and not `stackItem`:
 * those nodes already own enter scale and peek scale.
 * Nested parts do not own mount enter (`scheduleNestedEnterBroadcast`).
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
  paused = false,
  stackLayout,
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
    // Peek scale lives here. Card hover is on ToastRoot, not this shell.
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
  const stackScale = stackLayout?.scale ?? 1 - capped * TOAST_STACK_SCALE_STEP;
  const peekY =
    stackLayout?.peekY ?? (isTop ? capped * TOAST_STACK_PEEK_PX : -capped * TOAST_STACK_PEEK_PX);
  const stackOpacity = stackLayout?.opacity ?? (reverseIdx >= TOAST_MAX_VISIBLE ? 0 : 1);
  const isHiddenInStack = stackLayout?.hidden ?? reverseIdx >= TOAST_MAX_VISIBLE;
  const interactive = stackLayout?.interactive ?? reverseIdx === 0;
 
  useLayoutEffect(() => {
    const el = stackRef.current;
    if (!el) return;
    if (isDismissing && isMountedRef.current) return;

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
  }, [entry.variant, isDismissing, peekY, scope, stackOpacity, stackScale]);
 
  useLayoutEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    // Measured stack geometry (peek / viewport height), not an enter-layout flush.
    onHeightChange(entry.id, el.offsetHeight);
    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => {
            onHeightChange(entry.id, el.offsetHeight);
          })
        : undefined;
    ro?.observe(el);
    return () => {
      ro?.disconnect();
      onHeightChange(entry.id, 0);
    };
  }, [entry.id, onHeightChange]);
 
  useLayoutEffect(() => {
    const el = animRef.current;
    if (!el) return;
    const value = scope.resolve("root", "enter");
    if (value === false || isReducedModalMotion(config, prefersReducedMotion())) {
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
    if (isReducedModalMotion(config, prefersReducedMotion())) {
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
 
  const remainingRef = useRef(entry.duration);
  const timerKeyRef = useRef("");
  const timerKey = `${entry.id}:${entry.duration}:${entry.loading}`;
  // react-doctor-disable-next-line react-doctor/no-ref-current-in-render -- reset remaining duration when toast config changes
  if (timerKeyRef.current !== timerKey) {
    // react-doctor-disable-next-line react-doctor/no-ref-current-in-render -- reset remaining duration when toast config changes
    timerKeyRef.current = timerKey;
    // react-doctor-disable-next-line react-doctor/no-ref-current-in-render -- reset remaining duration when toast config changes
    remainingRef.current = entry.duration;
  }

  useEffect(() => {
    if (entry.duration === 0 || isDismissing || entry.loading || paused) return;

    if (remainingRef.current <= 0) {
      onDismiss(entry.id);
      return;
    }

    const startedAt = Date.now();
    const timerId = window.setTimeout(() => {
      remainingRef.current = 0;
      onDismiss(entry.id);
    }, remainingRef.current);

    return () => {
      window.clearTimeout(timerId);
      remainingRef.current = Math.max(0, remainingRef.current - (Date.now() - startedAt));
    };
  }, [entry.id, entry.duration, isDismissing, entry.loading, onDismiss, paused]);
 
  const dismiss = useCallback(() => onDismiss(entry.id), [entry.id, onDismiss]);
 
  const mergedClassNames = { ...providerClassNames, ...entry.classNames };
 
  return (
    <div
      ref={setStackRef}
      aria-hidden={isHiddenInStack || undefined}
      inert={isHiddenInStack ? true : undefined}
      className={toastStackItemClass(mergedClassNames.stackItem)}
      style={toastStackItemStyle({
        origin: isTop ? "top center" : "bottom center",
        zIndex: Math.max(total, TOAST_MAX_VISIBLE) + 1 - reverseIdx,
        pointerEvents: !isDismissing && interactive ? "auto" : "none",
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
  paused,
  stackLayout,
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
      params={{ isTop, slideDir, shadowSize: TOAST_SHADOW_SIZE }}
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
        paused={paused}
        stackLayout={stackLayout}
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
  const [heights, setHeights] = useState<Record<string, number>>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const hoveredRef = useRef(false);
  const focusedRef = useRef(false);
  const [stackPaused, setStackPaused] = useState(false);
  useApplySkinPortal(containerRef);
  const prevContainerHRef = useRef(0);
  const effectivePaused = sorted.length > 0 && stackPaused;

  useEffect(() => {
    if (sorted.length === 0) {
      hoveredRef.current = false;
      focusedRef.current = false;
    }
  }, [sorted.length]);

  const onHeightChange = useCallback((id: string, h: number) => {
    setHeights((prev) => {
      if (h <= 0) {
        if (!(id in prev)) return prev;
        const { [id]: _removed, ...rest } = prev;
        return rest;
      }
      return prev[id] === h ? prev : { ...prev, [id]: h };
    });
  }, []);

  const stackLayout = useMemo(
    () =>
      resolveToastStackLayout({
        sorted,
        dismissingIds,
        heights,
        isTop,
        paused: effectivePaused,
      }),
    [dismissingIds, effectivePaused, heights, isTop, sorted],
  );

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const raw = stackLayout.containerHeight;
    const containerH = raw > 0 ? raw : prevContainerHRef.current;
    if (raw > 0) prevContainerHRef.current = raw;
    applyToastStackContainerHeight(el, containerH);
  }, [stackLayout.containerHeight]);

  return (
    <ToastMotionProvider motion={motion} defaults={TOAST_VIEWPORT_MOTION_DEFAULTS}>
    <div
      role="region"
      aria-label={toastViewportAriaLabel(placement, toastNotificationsLabel)}
      className={toastViewportClass({ placement, slotClass: classNames?.viewport })}
      style={toastViewportWidthStyle(toastViewportWidthPx(sorted, defaultSize))}
      onPointerEnter={(e) => {
        if (e.pointerType === "touch") return;
        hoveredRef.current = true;
        setStackPaused(true);
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === "touch") return;
        hoveredRef.current = false;
        if (!focusedRef.current) setStackPaused(false);
      }}
      onFocus={() => {
        focusedRef.current = true;
        setStackPaused(true);
      }}
      onBlur={(e) => {
        if (e.relatedTarget instanceof Node && e.currentTarget.contains(e.relatedTarget)) {
          return;
        }
        focusedRef.current = false;
        if (!hoveredRef.current) setStackPaused(false);
      }}
    >
      <ToastScrim
        isTop={isTop}
        sorted={sorted}
        dismissingIds={dismissingIds}
        className={classNames?.scrim}
      />
      <div
        ref={containerRef}
        className={toastStackClass(classNames?.stack, stackLayout.expanded)}
        style={{
          alignItems: isTop ? "start" : "end",
        }}
        data-state={dataExpandedState(stackLayout.expanded)}
      >
        {sorted.map((entry, reverseIdx) => (
          <ToastItemWrapper
            key={entry.id}
            entry={entry}
            reverseIdx={reverseIdx}
            total={sorted.length}
            isTop={isTop}
            isDismissing={dismissingIds.has(entry.id)}
            paused={effectivePaused}
            stackLayout={stackLayout.items.get(entry.id)}
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
 