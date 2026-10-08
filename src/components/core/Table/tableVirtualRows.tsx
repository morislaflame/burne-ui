import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from "react";

import { findScrollParent } from "@/components/core/utils/virtualWindow";
import { focusKeyboard } from "@/components/core/utils/focusElement";
import { useVirtualWindow } from "@/components/core/utils/useVirtualWindow";

import { TABLE_ROW_KEY_ATTR, TABLE_VIRTUAL_INDEX_ATTR } from "./tableAPI";
import { TableVirtualProvider, useTableContent } from "./tableContext";
import { TABLE_VIRTUAL_SPACER_CELL_CLASS } from "./tableStyles";

const TABLE_ROW_SIZE_FALLBACK = 40;

function TableVirtualSpacer({ height }: { height: number }) {
  return (
    <tr aria-hidden="true" style={{ height }}>
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label -- spacer keeps scroll length */}
      <td className={TABLE_VIRTUAL_SPACER_CELL_CLASS} />
    </tr>
  );
}

export function TableVirtualRows({
  items,
  renderItem,
  itemSizeProp,
  bodyRef,
}: {
  items: unknown[];
  renderItem: (item: unknown) => ReactNode;
  itemSizeProp?: number;
  bodyRef: RefObject<HTMLTableSectionElement | null>;
}) {
  const { setFocusedRowKey } = useTableContent();
  const [measured, setMeasured] = useState<number | null>(null);
  const [pin, setPin] = useState(0);
  const pendingFocus = useRef(false);
  const itemSize = itemSizeProp ?? measured ?? TABLE_ROW_SIZE_FALLBACK;
  const count = items.length;
  const { setScrollNode, range } = useVirtualWindow({
    enabled: true,
    count,
    itemSize,
    pinIndex: pin,
  });

  useEffect(() => {
    setScrollNode(findScrollParent(bodyRef.current));
    return () => setScrollNode(null);
  }, [bodyRef, count, setScrollNode]);

  useLayoutEffect(() => {
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

  const step = useCallback((from: number, delta: number) => {
    pendingFocus.current = true;
    setPin(Math.min(Math.max(0, from + delta), Math.max(0, count - 1)));
  }, [count]);

  const jump = useCallback((index: number) => {
    pendingFocus.current = true;
    setPin(Math.min(Math.max(0, index), Math.max(0, count - 1)));
  }, [count]);

  const tail = range.total - range.end * itemSize;

  return (
    <>
      {range.offset > 0 ? <TableVirtualSpacer height={range.offset} /> : null}
      {items.slice(range.start, range.end).map((item, index) => {
        const rowIndex = range.start + index;
        return (
          <TableVirtualProvider key={rowIndex} value={{ index: rowIndex, count, step, jump }}>
            {renderItem(item)}
          </TableVirtualProvider>
        );
      })}
      {tail > 0 ? <TableVirtualSpacer height={tail} /> : null}
    </>
  );
}
