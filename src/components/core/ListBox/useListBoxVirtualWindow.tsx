import { Children, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";

import { useVirtualWindow } from "@/components/core/utils/useVirtualWindow";

import { collectListBoxVirtualOptions, type ListBoxVirtualOption } from "./listBoxAPI";
import { useListBox, useListBoxActiveValue } from "./listBoxContext";
import { LISTBOX_VIRTUAL_FRAME_CLASS, LISTBOX_VIRTUAL_WINDOW_CLASS } from "./listBoxStyles";
import type { ListBoxSize } from "./listBoxTypes";

const LISTBOX_ITEM_SIZE_FALLBACK: Record<ListBoxSize, number> = {
  small: 28,
  base: 36,
  mid: 40,
  large: 48,
};

export function useListBoxVirtualWindow({
  enabled,
  itemSizeProp,
  size,
  children,
}: {
  enabled: boolean;
  itemSizeProp?: number;
  size: ListBoxSize;
  children: ReactNode;
}): {
  frame: ReactNode;
  catalog: ListBoxVirtualOption[] | null;
  setScrollNode: (node: HTMLElement | null) => void;
  rangeKey: string;
} {
  const activeValue = useListBoxActiveValue();
  const { activeChangeSourceRef } = useListBox("ListBox");
  const catalog = useMemo(
    () => (enabled ? collectListBoxVirtualOptions(children) : null),
    [children, enabled],
  );
  const active = enabled && catalog != null;
  const lastPinnedIndexRef = useRef(-1);
  const rawPinIndex =
    active && activeValue ? catalog.findIndex((option) => option.value === activeValue) : -1;
  // react-doctor-disable-next-line react-doctor/no-ref-current-in-render -- skip virtual scroll jump when activeValue changed from pointer hover
  if (activeChangeSourceRef.current !== "pointer") {
    // react-doctor-disable-next-line react-doctor/no-ref-current-in-render -- skip virtual scroll jump when activeValue changed from pointer hover
    lastPinnedIndexRef.current = rawPinIndex;
  }
  // react-doctor-disable-next-line react-doctor/no-ref-current-in-render -- read pinned index for virtual window
  const pinIndex = active ? lastPinnedIndexRef.current : -1;
  const [measured, setMeasured] = useState<number | null>(null);
  const itemSize = itemSizeProp ?? measured ?? LISTBOX_ITEM_SIZE_FALLBACK[size];
  const virtual = useVirtualWindow({
    enabled: active,
    count: active ? catalog.length : 0,
    itemSize,
    pinIndex,
  });

  useLayoutEffect(() => {
    if (!active || itemSizeProp) return;
    const row = virtual.scrollRef.current?.querySelector<HTMLElement>('[role="option"]');
    if (!row) return;
    const height = Math.ceil(row.getBoundingClientRect().height);
    if (height > 0) setMeasured((prev) => (prev === height ? prev : height));
  }, [active, itemSizeProp, virtual.range.start, virtual.scrollRef]);

  const frame = useMemo(() => {
    if (!active || !catalog) return children;
    const nodes = Children.toArray(children);
    return (
      <div className={LISTBOX_VIRTUAL_FRAME_CLASS} style={{ height: virtual.range.total }}>
        <div
          className={LISTBOX_VIRTUAL_WINDOW_CLASS}
          style={{ transform: `translateY(${virtual.range.offset}px)` }}
        >
          {nodes.slice(virtual.range.start, virtual.range.end)}
        </div>
      </div>
    );
  }, [active, catalog, children, virtual.range.end, virtual.range.offset, virtual.range.start, virtual.range.total]);

  const rangeKey = active ? `${virtual.range.start}:${virtual.range.end}` : "";

  return { frame, catalog: active ? catalog : null, setScrollNode: virtual.setScrollNode, rangeKey };
}
