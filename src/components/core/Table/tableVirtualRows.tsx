import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";

import { focusKeyboard } from "@/components/core/utils/focusElement";
import { findScrollParent, virtualRange } from "@/components/core/utils/virtualWindow";

import { extractTableRowKey, TABLE_ROW_KEY_ATTR, TABLE_VIRTUAL_INDEX_ATTR } from "./tableAPI";
import { TableVirtualProvider, useTableContent } from "./tableContext";
import { TABLE_VIRTUAL_SPACER_CELL_CLASS } from "./tableStyles";

const TABLE_ROW_SIZE_FALLBACK = 40;
const MIN_SPACER_COLSPAN = 100;

function measureHeaderOffset(body: HTMLTableSectionElement | null): number {
  if (!body) return 0;
  if (body.offsetTop > 0) return body.offsetTop;
  const thead = body.closest("table")?.querySelector("thead");
  return thead ? thead.offsetHeight : 0;
}

function TableVirtualSpacer({ height, colSpan }: { height: number; colSpan: number }) {
  return (
    <tr aria-hidden="true" style={{ height }}>
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label -- spacer keeps scroll length */}
      <td colSpan={colSpan} className={TABLE_VIRTUAL_SPACER_CELL_CLASS} />
    </tr>
  );
}

export function TableVirtualRows({
  items,
  renderItem,
  itemSizeProp,
  bodyRef,
}: {
  items: readonly unknown[];
  renderItem: (item: unknown) => ReactNode;
  itemSizeProp?: number;
  bodyRef: RefObject<HTMLTableSectionElement | null>;
}) {
  const { setFocusedRowKey, isRowDisabled } = useTableContent();
  const [measured, setMeasured] = useState<number | null>(null);
  const [columnCount, setColumnCount] = useState(0);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [viewport, setViewport] = useState(0);
  const [pin, setPin] = useState(0);
  const scrollNodeRef = useRef<HTMLElement | null>(null);
  const pendingFocus = useRef(false);

  const itemSize = itemSizeProp ?? measured ?? TABLE_ROW_SIZE_FALLBACK;
  const count = items.length;

  const itemKeys = useMemo(
    () => items.map((item) => extractTableRowKey(item, renderItem)),
    [items, renderItem],
  );

  const readMetrics = useCallback(() => {
    const el = scrollNodeRef.current;
    if (!el) return;
    const headerOffset = measureHeaderOffset(bodyRef.current);
    const nextScroll = Math.max(0, el.scrollTop - headerOffset);
    const nextViewport = el.clientHeight;
    setScrollOffset((prev) => (prev === nextScroll ? prev : nextScroll));
    setViewport((prev) => (prev === nextViewport ? prev : nextViewport));
  }, [bodyRef]);

  useEffect(() => {
    const scrollEl = findScrollParent(bodyRef.current);
    scrollNodeRef.current = scrollEl;
    if (!scrollEl) return;

    scrollEl.addEventListener("scroll", readMetrics, { passive: true });
    let observer: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(readMetrics);
      observer.observe(scrollEl);
      const thead = bodyRef.current?.closest("table")?.querySelector("thead");
      if (thead) observer.observe(thead);
    }
    readMetrics();

    return () => {
      scrollEl.removeEventListener("scroll", readMetrics);
      observer?.disconnect();
      if (scrollNodeRef.current === scrollEl) {
        scrollNodeRef.current = null;
      }
    };
  }, [bodyRef, count, readMetrics]);

  const range = useMemo(
    () =>
      count > 0
        ? virtualRange({ count, itemSize, scrollOffset, viewport })
        : { start: 0, end: 0, offset: 0, total: 0, scroll: 0 },
    [count, itemSize, scrollOffset, viewport],
  );

  useLayoutEffect(() => {
    const table = bodyRef.current?.closest("table");
    const thCount = table?.querySelectorAll("thead th").length ?? 0;
    if (thCount > 0) {
      setColumnCount((prev) => (prev === thCount ? prev : thCount));
    }
    if (itemSizeProp) return;
    const row = bodyRef.current?.querySelector<HTMLElement>(`tr[${TABLE_ROW_KEY_ATTR}]`);
    if (!row) return;
    const height = Math.ceil(row.getBoundingClientRect().height);
    if (height > 0) setMeasured((prev) => (prev === height ? prev : height));
  }, [bodyRef, itemSizeProp, range.start]);

  useLayoutEffect(() => {
    if (!pendingFocus.current) return;
    const row = bodyRef.current?.querySelector<HTMLElement>(
      `[${TABLE_VIRTUAL_INDEX_ATTR}="${pin}"]`,
    );
    if (!row) return;
    pendingFocus.current = false;
    const key = row.getAttribute(TABLE_ROW_KEY_ATTR);
    if (key != null) setFocusedRowKey(key);
    focusKeyboard(row);
  }, [bodyRef, pin, range.end, range.start, setFocusedRowKey]);

  const revealIndex = useCallback(
    (targetIndex: number) => {
      pendingFocus.current = true;
      setPin(targetIndex);
      const scrollEl = scrollNodeRef.current;
      const bodyEl = bodyRef.current;
      if (!scrollEl) return;
      const headerOffset = measureHeaderOffset(bodyEl);
      const thead = bodyEl?.closest("table")?.querySelector("thead");
      const stickyCover = thead ? thead.offsetHeight : 0;
      const rowTop = headerOffset + targetIndex * itemSize;
      const rowBottom = rowTop + itemSize;
      const clientH = scrollEl.clientHeight;
      if (clientH > 0) {
        if (rowTop < scrollEl.scrollTop + stickyCover) {
          scrollEl.scrollTop = Math.max(0, rowTop - stickyCover);
        } else if (rowBottom > scrollEl.scrollTop + clientH) {
          scrollEl.scrollTop = Math.max(0, rowBottom - clientH);
        }
      } else {
        scrollEl.scrollTop = Math.max(0, targetIndex * itemSize);
      }
      const nextScroll = Math.max(0, scrollEl.scrollTop - headerOffset);
      setScrollOffset((prev) => (prev === nextScroll ? prev : nextScroll));
    },
    [bodyRef, itemSize],
  );

  const isIndexDisabled = useCallback(
    (index: number) => {
      const key = itemKeys[index];
      return key !== undefined && isRowDisabled(key);
    },
    [ isRowDisabled, itemKeys ],
  );

  const step = useCallback(
    (from: number, delta: number) => {
      if (count <= 0 || delta === 0) return;
      const dir = delta > 0 ? 1 : -1;
      let candidate = from + dir;
      while (candidate >= 0 && candidate < count) {
        if (!isIndexDisabled(candidate)) {
          revealIndex(candidate);
          return;
        }
        candidate += dir;
      }
    },
    [count, isIndexDisabled, revealIndex],
  );

  const jump = useCallback(
    (index: number) => {
      if (count <= 0) return;
      const clamped = Math.min(Math.max(0, index), count - 1);
      if (clamped === 0) {
        for (let i = 0; i < count; i += 1) {
          if (!isIndexDisabled(i)) {
            revealIndex(i);
            return;
          }
        }
        return;
      }
      if (clamped === count - 1) {
        for (let i = count - 1; i >= 0; i -= 1) {
          if (!isIndexDisabled(i)) {
            revealIndex(i);
            return;
          }
        }
        return;
      }
      if (!isIndexDisabled(clamped)) {
        revealIndex(clamped);
      }
    },
    [count, isIndexDisabled, revealIndex],
  );

  const spacerColSpan = Math.max(columnCount, MIN_SPACER_COLSPAN);
  const tail = Math.max(0, range.total - range.end * itemSize);

  return (
    <>
      {range.offset > 0 ? (
        <TableVirtualSpacer height={range.offset} colSpan={spacerColSpan} />
      ) : null}
      {items.slice(range.start, range.end).map((item, index) => {
        const rowIndex = range.start + index;
        return (
          <TableVirtualProvider key={rowIndex} value={{ index: rowIndex, count, step, jump }}>
            {renderItem(item)}
          </TableVirtualProvider>
        );
      })}
      {tail > 0 ? <TableVirtualSpacer height={tail} colSpan={spacerColSpan} /> : null}
    </>
  );
}
