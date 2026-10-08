import { useCallback, useId, useLayoutEffect, useMemo, useRef, useState } from "react";

import {
  EMPTY_SCROLL_METRICS,
  SCROLL_AREA_HIDE_DELAY,
  paintScrollThumb,
  scrollAreaBarActive,
  scrollAreaIsCompound,
  scrollAxisMetrics,
  readInlineScroll,
} from "./scrollAreaAPI";
import type {
  ScrollAreaBarRegistration,
  ScrollAreaContextValue,
  ScrollAreaProps,
  ScrollAxis,
} from "./scrollAreaTypes";

export function useScrollAreaRootState({
  children,
  id,
  visibility = "hover",
  orientation = "vertical",
  scrollHideDelay = SCROLL_AREA_HIDE_DELAY,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
}: Pick<
  ScrollAreaProps,
  "children" | "id" | "visibility" | "orientation" | "scrollHideDelay" | "aria-label" | "aria-labelledby"
>): {
  contextValue: ScrollAreaContextValue;
  isCompound: boolean;
  setHovered: (hovered: boolean) => void;
  setFocused: (focused: boolean) => void;
} {
  const reactId = useId();
  const viewportId = id ?? `scroll-area-${reactId}`;
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const axesRef = useRef({ vertical: EMPTY_SCROLL_METRICS, horizontal: EMPTY_SCROLL_METRICS });
  const barsRef = useRef(new Set<ScrollAreaBarRegistration>());
  const hideTimer = useRef(0);
  const draggingRef = useRef({ vertical: false, horizontal: false });
  const [overflow, setOverflow] = useState({ vertical: false, horizontal: false });
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const [dragging, setDraggingState] = useState({ vertical: false, horizontal: false });
  const [aria, setAria] = useState({
    vertical: { now: 0, max: 0 },
    horizontal: { now: 0, max: 0 },
  });

  const paint = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const bars = [...barsRef.current];
    const verticalBar = bars.find((bar) => bar.axis === "vertical")?.element;
    const horizontalBar = bars.find((bar) => bar.axis === "horizontal")?.element;
    const yOverflowGuess = viewport.scrollHeight - viewport.clientHeight > 1;
    const xOverflowGuess = viewport.scrollWidth - viewport.clientWidth > 1;
    const yBar = verticalBar && verticalBar.clientHeight > 0 ? verticalBar.clientHeight : viewport.clientHeight;
    const xBar = horizontalBar && horizontalBar.clientWidth > 0 ? horizontalBar.clientWidth : viewport.clientWidth;
    const yCross = xOverflowGuess && horizontalBar && horizontalBar.offsetHeight > 0 ? horizontalBar.offsetHeight : 0;
    const xCross = yOverflowGuess && verticalBar && verticalBar.offsetWidth > 0 ? verticalBar.offsetWidth : 0;
    const yTrack = Math.max(0, yBar - yCross);
    const xTrack = Math.max(0, xBar - xCross);
    const vertical = scrollAxisMetrics(
      viewport.clientHeight,
      viewport.scrollHeight,
      viewport.scrollTop,
      yTrack,
    );
    const horizontal = scrollAxisMetrics(
      viewport.clientWidth,
      viewport.scrollWidth,
      readInlineScroll(viewport),
      xTrack,
    );
    axesRef.current = { vertical, horizontal };
    if (verticalBar) paintScrollThumb(verticalBar, vertical);
    if (horizontalBar) paintScrollThumb(horizontalBar, horizontal);
    setOverflow((prev) =>
      prev.vertical === vertical.overflowing && prev.horizontal === horizontal.overflowing
        ? prev
        : { vertical: vertical.overflowing, horizontal: horizontal.overflowing },
    );
    const nextAria = {
      vertical: { now: Math.round(vertical.scroll), max: Math.round(vertical.maxScroll) },
      horizontal: { now: Math.round(horizontal.scroll), max: Math.round(horizontal.maxScroll) },
    };
    setAria((prev) =>
      prev.vertical.now === nextAria.vertical.now &&
      prev.vertical.max === nextAria.vertical.max &&
      prev.horizontal.now === nextAria.horizontal.now &&
      prev.horizontal.max === nextAria.horizontal.max
        ? prev
        : nextAria,
    );
  }, []);

  const paintRef = useRef(paint);
  paintRef.current = paint;

  const markScrolling = useCallback(() => {
    setScrolling(true);
    window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => setScrolling(false), scrollHideDelay);
  }, [scrollHideDelay]);

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return undefined;
    const onScroll = () => {
      markScrolling();
      paintRef.current();
    };
    viewport.addEventListener("scroll", onScroll, { passive: true });
    const content = viewport.firstElementChild;
    const observer =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(() => {
            paintRef.current();
          });
    observer?.observe(viewport);
    if (content) observer?.observe(content);
    paintRef.current();
    return () => {
      viewport.removeEventListener("scroll", onScroll);
      observer?.disconnect();
      window.clearTimeout(hideTimer.current);
    };
  }, [markScrolling]);

  useLayoutEffect(() => {
    paintRef.current();
  }, [overflow.vertical, overflow.horizontal]);

  const registerBar = useCallback((bar: ScrollAreaBarRegistration) => {
    barsRef.current.add(bar);
    paintRef.current();
    return () => {
      barsRef.current.delete(bar);
    };
  }, []);

  const setDragging = useCallback((axis: ScrollAxis, next: boolean) => {
    draggingRef.current = { ...draggingRef.current, [axis]: next };
    setDraggingState({ ...draggingRef.current });
    if (next) setScrolling(true);
  }, []);

  const setHoveredStable = useCallback((next: boolean) => {
    setHovered(next);
  }, []);

  const setFocusedStable = useCallback((next: boolean) => {
    setFocused(next);
  }, []);

  const barActive = useMemo(
    () => ({
      vertical: scrollAreaBarActive({
        overflowing: overflow.vertical,
        visibility,
        hovered,
        focused,
        scrolling,
        dragging: dragging.vertical,
      }),
      horizontal: scrollAreaBarActive({
        overflowing: overflow.horizontal,
        visibility,
        hovered,
        focused,
        scrolling,
        dragging: dragging.horizontal,
      }),
    }),
    [dragging.horizontal, dragging.vertical, focused, hovered, overflow.horizontal, overflow.vertical, scrolling, visibility],
  );

  const contextValue = useMemo<ScrollAreaContextValue>(
    () => ({
      viewportId,
      visibility,
      orientation,
      ariaLabel,
      ariaLabelledBy,
      viewportRef,
      axesRef,
      overflow,
      aria,
      barActive,
      registerBar,
      setDragging,
    }),
    [aria, ariaLabel, ariaLabelledBy, barActive, orientation, overflow, registerBar, setDragging, viewportId, visibility],
  );

  return {
    contextValue,
    isCompound: scrollAreaIsCompound(children),
    setHovered: setHoveredStable,
    setFocused: setFocusedStable,
  };
}
