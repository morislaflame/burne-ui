import { useCallback, useLayoutEffect, useRef, useState } from "react";

import { scrollToRevealIndex, virtualRange, type VirtualRange } from "./virtualWindow";

const EMPTY_RANGE: VirtualRange = { start: 0, end: 0, offset: 0, total: 0, scroll: 0 };

export function useVirtualWindow({
  enabled,
  count,
  itemSize,
  pinIndex,
}: {
  enabled: boolean;
  count: number;
  itemSize: number;
  pinIndex: number;
}) {
  const scrollRef = useRef<HTMLElement | null>(null);
  const observerRef = useRef<ResizeObserver | null>(null);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [viewport, setViewport] = useState(0);
  const [trackedPin, setTrackedPin] = useState(pinIndex);

  const readScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setScrollOffset(el.scrollTop);
    setViewport(el.clientHeight);
  }, []);

  const disconnect = useCallback((node: HTMLElement | null) => {
    if (!node) return;
    node.removeEventListener("scroll", readScroll);
    observerRef.current?.disconnect();
    observerRef.current = null;
  }, [readScroll]);

  const setScrollNode = useCallback(
    (node: HTMLElement | null) => {
      if (scrollRef.current !== node) disconnect(scrollRef.current);
      scrollRef.current = node;
      if (!node || !enabled) return;
      node.addEventListener("scroll", readScroll, { passive: true });
      const observer = new ResizeObserver(readScroll);
      observerRef.current = observer;
      observer.observe(node);
      readScroll();
    },
    [disconnect, enabled, readScroll],
  );

  if (enabled && pinIndex !== trackedPin) {
    setTrackedPin(pinIndex);
    setScrollOffset(
      scrollToRevealIndex({
        count,
        itemSize,
        scrollOffset,
        viewport,
        pinIndex,
      }),
    );
  }

  const range =
    enabled && count > 0
      ? virtualRange({ count, itemSize, scrollOffset, viewport })
      : EMPTY_RANGE;

  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!enabled || !el) return;
    if (Math.abs(el.scrollTop - range.scroll) > 1) el.scrollTop = range.scroll;
  }, [enabled, range.scroll]);

  return { setScrollNode, scrollRef, range };
}
