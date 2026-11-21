export const VIRTUAL_OVERSCAN = 4;
export const VIRTUAL_FALLBACK_ROWS = 8;

export type VirtualRange = {
  start: number;
  end: number;
  offset: number;
  total: number;
  /** Scroll offset that keeps `pinIndex` inside the viewport. */
  scroll: number;
};

export function viewportSize(viewport: number, itemSize: number): number {
  return viewport > 0 ? viewport : itemSize * VIRTUAL_FALLBACK_ROWS;
}

/** Scroll offset that brings `pinIndex` into the viewport without moving it if it is already visible. */
export function scrollToRevealIndex({
  count,
  itemSize,
  scrollOffset,
  viewport,
  pinIndex,
}: {
  count: number;
  itemSize: number;
  scrollOffset: number;
  viewport: number;
  pinIndex: number;
}): number {
  if (count <= 0 || itemSize <= 0 || pinIndex < 0 || pinIndex >= count) return scrollOffset;
  const view = viewportSize(viewport, itemSize);
  const maxScroll = Math.max(0, count * itemSize - view);
  let scroll = Math.min(Math.max(0, scrollOffset), maxScroll);
  const pinTop = pinIndex * itemSize;
  const pinBottom = pinTop + itemSize;
  if (pinTop < scroll) scroll = pinTop;
  else if (pinBottom > scroll + view) scroll = pinBottom - view;
  return Math.min(Math.max(0, scroll), maxScroll);
}

export function virtualRange({
  count,
  itemSize,
  scrollOffset,
  viewport,
  overscan = VIRTUAL_OVERSCAN,
}: {
  count: number;
  itemSize: number;
  scrollOffset: number;
  viewport: number;
  overscan?: number;
}): VirtualRange {
  if (count <= 0 || itemSize <= 0) {
    return { start: 0, end: 0, offset: 0, total: 0, scroll: 0 };
  }

  const view = viewportSize(viewport, itemSize);
  const maxScroll = Math.max(0, count * itemSize - view);
  const scroll = Math.min(Math.max(0, scrollOffset), maxScroll);
  let start = Math.floor(scroll / itemSize) - overscan;
  let end = Math.ceil((scroll + view) / itemSize) + overscan;
  start = Math.max(0, start);
  end = Math.min(count, Math.max(start, end));

  return {
    start,
    end,
    offset: start * itemSize,
    total: count * itemSize,
    scroll,
  };
}

export function findScrollParent(node: HTMLElement | null): HTMLElement | null {
  let el = node?.parentElement ?? null;
  while (el) {
    const overflowY = getComputedStyle(el).overflowY;
    if (overflowY === "auto" || overflowY === "scroll") return el;
    el = el.parentElement;
  }
  return null;
}
