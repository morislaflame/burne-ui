import {
  forwardRef,
  useCallback,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { dataValue } from "@/components/core/utils/dataContract";
import { isRtlElement } from "@/components/core/utils/readingDirection";
import { useBurneLabel } from "@/theme/BurneLabelsProvider";

import { useResizableHandleMotion, useResizablePanelMotion } from "./resizableAnimations";
import { useResizableLayout } from "./resizableContext";
import { resizableHandleClass, resizablePanelClass } from "./resizableStyles";
import type { ResizableHandleProps, ResizablePanelProps } from "./resizableTypes";

const DEFAULT_MIN = 8;
const DEFAULT_MAX = 100;

function computePairBounds(
  pairSum: number,
  minBefore: number,
  maxBefore: number,
  minAfter: number,
  maxAfter: number,
): { loBefore: number; hiBefore: number } {
  const loBefore = Math.max(minBefore, pairSum - maxAfter);
  const hiBefore = Math.min(maxBefore, pairSum - minAfter);
  if (loBefore > hiBefore) {
    const mid = Math.min(maxBefore, Math.max(minBefore, pairSum / 2));
    return { loBefore: mid, hiBefore: mid };
  }
  return { loBefore, hiBefore };
}

function clampPair(
  startBefore: number,
  startAfter: number,
  delta: number,
  minBefore: number,
  maxBefore: number,
  minAfter: number,
  maxAfter: number,
) {
  const pairSum = startBefore + startAfter;
  const { loBefore, hiBefore } = computePairBounds(
    pairSum,
    minBefore,
    maxBefore,
    minAfter,
    maxAfter,
  );
  const before = Math.min(hiBefore, Math.max(loBefore, startBefore + delta));
  const after = Math.max(0, pairSum - before);
  return { before, after };
}

export const ResizablePanel = forwardRef<HTMLDivElement, ResizablePanelProps>(function ResizablePanel(
  {
    id: idProp,
    defaultSize,
    minSize = DEFAULT_MIN,
    maxSize = DEFAULT_MAX,
    className = "",
    motion,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
    children,
    ...rest
  },
  ref,
) {
  const generatedId = useId().replace(/:/g, "");
  const id = idProp?.trim() ? idProp : generatedId;
  const layout = useResizableLayout();
  const layoutRef = useRef(layout);
  // react-doctor-disable-next-line react-doctor/no-ref-current-in-render -- latest layout callbacks without re-triggering mount/unmount effect
  layoutRef.current = layout;
  const part = useResizablePanelMotion({
    forwardedRef: ref,
    motion,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
  });
  const size = layout.sizes[id];

  useLayoutEffect(() => {
    layoutRef.current.registerPanel(id, { defaultSize, minSize, maxSize });
  }, [defaultSize, id, maxSize, minSize]);

  useLayoutEffect(() => {
    return () => {
      layoutRef.current.unregisterPanel(id);
    };
  }, [id]);

  return (
    <div
      ref={part.setRef}
      className={resizablePanelClass({
        fixed: size != null,
        slotClass: layout.panelClass,
        className,
      })}
      {...rest}
      {...part.pointerHandlers}
      style={
        size != null
          ? {
              ...rest.style,
              flexGrow: 0,
              flexShrink: 0,
              flexBasis: `calc(${size} * (100% - var(--resizable-handles, 0) * var(--space-small)) / 100)`,
            }
          : rest.style
      }
      id={id}
      data-value={dataValue(id)}
    >
      {children}
    </div>
  );
});

ResizablePanel.displayName = "Resizable.Panel";

export const ResizableHandle = forwardRef<HTMLDivElement, ResizableHandleProps>(function ResizableHandle(
  {
    className = "",
    motion,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
    onPointerMove,
    onPointerCancel,
    onLostPointerCapture,
    onKeyDown,
    ...rest
  },
  ref,
) {
  const layout = useResizableLayout();
  const layoutRef = useRef(layout);
  // react-doctor-disable-next-line react-doctor/no-ref-current-in-render -- latest layout state for pointer/key handlers
  layoutRef.current = layout;
  const drag = useRef<{
    beforeId: string;
    afterId: string;
    startBefore: number;
    startAfter: number;
    startPos: number;
    total: number;
  } | null>(null);
  const [announced, setAnnounced] = useState<number | undefined>();
  const [bounds, setBounds] = useState({ min: DEFAULT_MIN, max: 100 - DEFAULT_MIN, controls: "" });
  const resizeLabel = useBurneLabel("resizePanels");

  const measure = useCallback((root: HTMLElement) => {
    const api = layoutRef.current;
    const horizontal = api.orientation === "horizontal";
    const panels = [...root.children].filter(
      (node): node is HTMLElement =>
        node instanceof HTMLElement && Boolean(node.dataset.value) && node.getAttribute("role") !== "separator",
    );
    const measuredTotal = panels.reduce((sum, node) => {
      const box = node.getBoundingClientRect();
      return sum + (horizontal ? box.width : box.height);
    }, 0);
    const allInSizes = panels.length > 0 && panels.every((node) => node.dataset.value && node.dataset.value in api.sizes);
    const next: Record<string, number> = {};
    if (allInSizes) {
      for (const node of panels) {
        const id = node.dataset.value!;
        next[id] = api.sizes[id] ?? 0;
      }
    } else if (measuredTotal > 0) {
      for (const node of panels) {
        const id = node.dataset.value;
        if (!id) continue;
        const box = node.getBoundingClientRect();
        next[id] = ((horizontal ? box.width : box.height) / measuredTotal) * 100;
      }
    } else {
      const equal = panels.length > 0 ? 100 / panels.length : 100;
      for (const node of panels) {
        const id = node.dataset.value;
        if (id) next[id] = equal;
      }
    }
    return { next, total: measuredTotal > 0 ? measuredTotal : 100 };
  }, []);

  const applyDelta = useCallback((deltaPercent: number) => {
    const current = drag.current;
    const api = layoutRef.current;
    if (!current) return;
    const pair = clampPair(
      current.startBefore,
      current.startAfter,
      deltaPercent,
      api.minOf(current.beforeId),
      api.maxOf(current.beforeId),
      api.minOf(current.afterId),
      api.maxOf(current.afterId),
    );
    api.commit((prev) => ({
      ...prev,
      [current.beforeId]: pair.before,
      [current.afterId]: pair.after,
    }));
    setAnnounced(Math.round(pair.before));
  }, []);

  const readBounds = useCallback((handle: HTMLElement) => {
    const before = handle.previousElementSibling;
    const after = handle.nextElementSibling;
    const root = handle.parentElement;
    if (!(before instanceof HTMLElement) || !(after instanceof HTMLElement) || !root) return;
    const beforeId = before.dataset.value;
    const afterId = after.dataset.value;
    if (!beforeId || !afterId) return;
    const api = layoutRef.current;
    let beforeVal = api.sizes[beforeId];
    let afterVal = api.sizes[afterId];
    if (beforeVal == null || afterVal == null) {
      const { next } = measure(root);
      beforeVal = next[beforeId] ?? 50;
      afterVal = next[afterId] ?? 50;
    }
    const pairSum = beforeVal + afterVal;
    const { loBefore, hiBefore } = computePairBounds(
      pairSum,
      api.minOf(beforeId),
      api.maxOf(beforeId),
      api.minOf(afterId),
      api.maxOf(afterId),
    );
    const min = Math.round(loBefore);
    const max = Math.round(Math.max(loBefore, hiBefore));
    const controls = `${before.id} ${after.id}`;
    setBounds((prev) =>
      prev.min === min && prev.max === max && prev.controls === controls
        ? prev
        : { min, max, controls },
    );
    setAnnounced(Math.round(beforeVal));
  }, [measure]);

  const part = useResizableHandleMotion({
    forwardedRef: ref,
    motion,
    onPointerOver,
    onPointerOut,
    onPointerDown: (event) => {
      onPointerDown?.(event);
      if (event.defaultPrevented || event.button !== 0) return;
      const handle = event.currentTarget;
      const before = handle.previousElementSibling;
      const after = handle.nextElementSibling;
      const root = handle.parentElement;
      if (!(before instanceof HTMLElement) || !(after instanceof HTMLElement) || !root) return;
      const beforeId = before.dataset.value;
      const afterId = after.dataset.value;
      if (!beforeId || !afterId) return;
      const { next, total } = measure(root);
      layoutRef.current.commit(() => next);
      drag.current = {
        beforeId,
        afterId,
        startBefore: next[beforeId] ?? 0,
        startAfter: next[afterId] ?? 0,
        startPos: layoutRef.current.orientation === "horizontal" ? event.clientX : event.clientY,
        total,
      };
      if (typeof handle.setPointerCapture === "function") {
        try {
          handle.setPointerCapture(event.pointerId);
        } catch {
          // Synthetic pointer events in unit tests may lack an active pointerId.
        }
      }
    },
    onPointerUp: (event) => {
      onPointerUp?.(event);
      drag.current = null;
    },
  });

  useLayoutEffect(() => {
    const handle = part.targetRef.current;
    if (handle) readBounds(handle);
  }, [layout.sizes, part.targetRef, readBounds]);

  return (
    /* ARIA separator: keyboard and pointer resize the neighboring panels. */
    /* eslint-disable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex */
    <div
      ref={part.setRef}
      role="separator"
      tabIndex={0}
      aria-label={resizeLabel}
      aria-controls={bounds.controls || undefined}
      aria-orientation={layout.orientation === "horizontal" ? "vertical" : "horizontal"}
      aria-valuemin={bounds.min}
      aria-valuemax={bounds.max}
      aria-valuenow={announced}
      className={resizableHandleClass({
        orientation: layout.orientation,
        slotClass: layout.handleClass,
        className,
      })}
      {...rest}
      {...part.pointerHandlers}
      onPointerMove={(event) => {
        onPointerMove?.(event);
        if (event.defaultPrevented || !drag.current) return;
        const horizontal = layoutRef.current.orientation === "horizontal";
        const pos = horizontal ? event.clientX : event.clientY;
        const rtl = horizontal && isRtlElement(event.currentTarget);
        const delta = (rtl ? -1 : 1) * (pos - drag.current.startPos);
        applyDelta((delta / drag.current.total) * 100);
      }}
      onPointerCancel={(event) => {
        onPointerCancel?.(event);
        drag.current = null;
      }}
      onLostPointerCapture={(event) => {
        onLostPointerCapture?.(event);
        drag.current = null;
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented) return;
        const horizontal = layoutRef.current.orientation === "horizontal";
        const rtl = horizontal && isRtlElement(event.currentTarget);
        const grow = horizontal
          ? event.key === (rtl ? "ArrowLeft" : "ArrowRight")
          : event.key === "ArrowDown";
        const shrink = horizontal
          ? event.key === (rtl ? "ArrowRight" : "ArrowLeft")
          : event.key === "ArrowUp";
        const home = event.key === "Home";
        const end = event.key === "End";
        if (!grow && !shrink && !home && !end) return;
        event.preventDefault();
        const handle = event.currentTarget;
        const before = handle.previousElementSibling;
        const after = handle.nextElementSibling;
        const root = handle.parentElement;
        if (!(before instanceof HTMLElement) || !(after instanceof HTMLElement) || !root) return;
        const beforeId = before.dataset.value;
        const afterId = after.dataset.value;
        if (!beforeId || !afterId) return;
        const { next, total } = measure(root);
        const api = layoutRef.current;
        api.commit(() => next);
        const startBefore = next[beforeId] ?? 0;
        const startAfter = next[afterId] ?? 0;
        const { loBefore, hiBefore } = computePairBounds(
          startBefore + startAfter,
          api.minOf(beforeId),
          api.maxOf(beforeId),
          api.minOf(afterId),
          api.maxOf(afterId),
        );
        drag.current = {
          beforeId,
          afterId,
          startBefore,
          startAfter,
          startPos: 0,
          total,
        };
        if (home) applyDelta(loBefore - startBefore);
        else if (end) applyDelta(hiBefore - startBefore);
        else applyDelta(grow ? 2 : -2);
        drag.current = null;
      }}
    />
    /* eslint-enable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex */
  );
});

ResizableHandle.displayName = "Resizable.Handle";
