import { useCallback, useMemo, useState } from "react";

import { useControllableState } from "@/components/core/utils/useControllableState";

import { EMPTY_TABLE_SELECTION, isRowInSelection, toggleSelectionKey } from "./tableAPI";
import type { Selection, SelectionMode, SortDescriptor, TableContentContextValue } from "./tableTypes";

export function useTableContentState({
  selectionMode = "none",
  selectedKeys: selectedKeysProp,
  defaultSelectedKeys,
  onSelectionChange,
  sortDescriptor: sortDescriptorProp,
  defaultSortDescriptor,
  onSortChange,
}: {
  selectionMode?: SelectionMode;
  selectedKeys?: Selection;
  defaultSelectedKeys?: Selection;
  onSelectionChange?: (keys: Selection) => void;
  sortDescriptor?: SortDescriptor;
  defaultSortDescriptor?: SortDescriptor;
  onSortChange?: (descriptor: SortDescriptor) => void;
}): TableContentContextValue {
  const [selectedKeys, setSelectedKeys] = useControllableState<Selection>({
    value: selectedKeysProp,
    defaultValue: defaultSelectedKeys ?? EMPTY_TABLE_SELECTION,
    onChange: onSelectionChange,
  });

  const [sortDescriptor, setSortDescriptor] = useControllableState<
    SortDescriptor | undefined
  >({
    value: sortDescriptorProp,
    defaultValue: defaultSortDescriptor,
    onChange: onSortChange
      ? (next) => {
          if (next !== undefined) onSortChange(next);
        }
      : undefined,
  });

  const [focusedRowKey, setFocusedRowKeyState] = useState<string | number | null>(
    null,
  );

  const setFocusedRowKey = useCallback((key: string | number) => {
    setFocusedRowKeyState(key);
  }, []);

  const claimFocusedRowKey = useCallback((key: string | number) => {
    setFocusedRowKeyState((prev) => prev ?? key);
  }, []);

  const isRowSelected = useCallback(
    (key: string | number) => isRowInSelection(selectedKeys, key),
    [selectedKeys],
  );

  const onRowSelect = useCallback(
    (key: string | number) => {
      const next = toggleSelectionKey({ selectionMode, selectedKeys, key });
      if (next) setSelectedKeys(next);
    },
    [selectedKeys, selectionMode, setSelectedKeys],
  );

  return useMemo(
    () => ({
      selectionMode,
      selectedKeys,
      onRowSelect,
      isRowSelected,
      sortDescriptor,
      onSortChange: setSortDescriptor,
      focusedRowKey: selectionMode === "none" ? null : focusedRowKey,
      setFocusedRowKey,
      claimFocusedRowKey,
    }),
    [
      claimFocusedRowKey,
      focusedRowKey,
      isRowSelected,
      onRowSelect,
      selectedKeys,
      selectionMode,
      setFocusedRowKey,
      setSortDescriptor,
      sortDescriptor,
    ],
  );
}
