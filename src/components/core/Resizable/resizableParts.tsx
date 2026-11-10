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

function clampPair(
  startBefore: number,
  startAfter: number,
  delta: number,
  minBefore: number,
  minAfter: number,
) {
  let before = startBefore + delta;
  let after = startAfter - delta;
  if (before < minBefore) {
    after -= minBefore - before;
    before = minBefore;
  }
  if (after < minAfter) {
    before -= minAfter - after;
    after = minAfter;
  }
  if (before < minBefore || after < minAfter) return null;
  return { before, after };
}

export const ResizablePanel = forwardRef<HTMLDivElement, ResizablePanelProps>(function ResizablePanel(
  {
    id: idProp,
    defaultSize,
    minSize = DEFAULT_MIN,
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
    layoutRef.current.rememberMin(id, minSize);
  }, [id, minSize]);

  useLayoutEffect(() => {
    if (defaultSize == null) return;
    layoutRef.current.commit((prev) => (id in prev ? prev : { ...prev, [id]: defaultSize }));
  }, [defaultSize, id]);

  useLayoutEffect(() => {
    const api = layoutRef.current;
    return () => api.forget(id);
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
  const [bounds, setBounds] = useState({ min: DEFAULT_MIN, max: 100, controls: "" });
  const resizeLabel = useBurneLabel("resizePanels");

  const measure = useCallback((root: HTMLElement) => {
    const horizontal = layoutRef.current.orientation === "horizontal";
    const panels = [...root.children].filter(
      (node): node is HTMLElement =>
        node instanceof HTMLElement && Boolean(node.dataset.value) && node.getAttribute("role") !== "separator",
    );
    const total = panels.reduce((sum, node) => {
      const box = node.getBoundingClientRect();
      return sum + (horizontal ? box.width : box.height);
    }, 0) || 1;
    const next: Record<string, number> = {};
    for (const node of panels) {
      const id = node.dataset.value;
      if (!id) continue;
      const box = node.getBoundingClientRect();
      next[id] = ((horizontal ? box.width : box.height) / total) * 100;
    }
    return { next, total };
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
      api.minOf(current.afterId),
    );
    if (!pair) return;
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
    if (!(before instanceof HTMLElement) || !(after instanceof HTMLElement)) return;
    const beforeId = before.dataset.value;
    const afterId = after.dataset.value;
    if (!beforeId || !afterId) return;
    const api = layoutRef.current;
    const min = api.minOf(beforeId);
    const max = Math.max(min, 100 - api.minOf(afterId));
    const now = api.sizes[beforeId];
    setBounds({ min, max, controls: `${before.id} ${after.id}` });
    if (now != null) setAnnounced(Math.round(now));
  }, []);

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
      handle.setPointerCapture(event.pointerId);
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
        drag.current = {
          beforeId,
          afterId,
          startBefore,
          startAfter: next[afterId] ?? 0,
          startPos: 0,
          total,
        };
        if (home) applyDelta(api.minOf(beforeId) - startBefore);
        else if (end) applyDelta(100 - api.minOf(afterId) - startBefore);
        else applyDelta(grow ? 2 : -2);
        drag.current = null;
      }}
    />
    /* eslint-enable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex */
  );
});

ResizableHandle.displayName = "Resizable.Handle";
