import { useCallback, useMemo } from "react";

import {
  EMPTY_TABLE_SELECTION,
  isRowInSelection,
  toggleSelectionKey,
} from "./tableAPI";
import type { Selection, SelectionMode, SortDescriptor, TableContentContextValue } from "./tableTypes";

export function useTableContentState({
  selectionMode = "none",
  selectedKeys: selectedKeysProp,
  onSelectionChange,
  sortDescriptor,
  onSortChange,
}: {
  selectionMode?: SelectionMode;
  selectedKeys?: Selection;
  onSelectionChange?: (keys: Selection) => void;
  sortDescriptor?: SortDescriptor;
  onSortChange?: (descriptor: SortDescriptor) => void;
}): TableContentContextValue {
  const selectedKeys: Selection = selectedKeysProp ?? EMPTY_TABLE_SELECTION;

  const isRowSelected = useCallback(
    (key: string | number) => isRowInSelection(selectedKeys, key),
    [selectedKeys],
  );

  const onRowSelect = useCallback(
    (key: string | number) => {
      const next = toggleSelectionKey({ selectionMode, selectedKeys, key });
      if (next && onSelectionChange) onSelectionChange(next);
    },
    [onSelectionChange, selectedKeys, selectionMode],
  );

  return useMemo(
    () => ({
      selectionMode,
      selectedKeys,
      onRowSelect,
      isRowSelected,
      sortDescriptor,
      onSortChange,
    }),
    [isRowSelected, onRowSelect, onSortChange, selectedKeys, selectionMode, sortDescriptor],
  );
}
