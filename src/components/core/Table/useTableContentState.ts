import { useCallback, useLayoutEffect, useMemo, useRef } from "react";

import { useControllableState } from "@/components/core/utils/useControllableState";

import { EMPTY_TABLE_SELECTION, selectionEquals, toggleSelectionKey } from "./tableAPI";
import type {
  Selection,
  SelectionMode,
  SortDescriptor,
  TableContentContextValue,
  TableRowSelectionStore,
} from "./tableTypes";

function createRowSelectionStore(
  initialSelected: Selection,
): TableRowSelectionStore {
  let selectedKeys = initialSelected;
  let focusedRowKey: string | number | null = null;
  const selectionListeners = new Set<() => void>();
  const focusListeners = new Set<() => void>();

  return {
    subscribeSelection(onStoreChange) {
      selectionListeners.add(onStoreChange);
      return () => {
        selectionListeners.delete(onStoreChange);
      };
    },
    subscribeFocus(onStoreChange) {
      focusListeners.add(onStoreChange);
      return () => {
        focusListeners.delete(onStoreChange);
      };
    },
    getSelectedKeys() {
      return selectedKeys;
    },
    isSelected(key) {
      return selectedKeys === "all" || selectedKeys.has(key);
    },
    getFocusedRowKey() {
      return focusedRowKey;
    },
    isFocusTarget(key) {
      return focusedRowKey != null && String(focusedRowKey) === String(key);
    },
    setSelectedKeys(next) {
      if (selectionEquals(selectedKeys, next)) return;
      selectedKeys = next;
      selectionListeners.forEach((listener) => listener());
    },
    setFocusedRowKey(key) {
      if (focusedRowKey != null && String(focusedRowKey) === String(key)) return;
      focusedRowKey = key;
      focusListeners.forEach((listener) => listener());
    },
    claimFocusedRowKey(key) {
      if (focusedRowKey != null) return;
      focusedRowKey = key;
      focusListeners.forEach((listener) => listener());
    },
  };
}

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
  const storeRef = useRef<TableRowSelectionStore | null>(null);
  if (storeRef.current == null) {
    storeRef.current = createRowSelectionStore(
      selectedKeysProp ?? defaultSelectedKeys ?? EMPTY_TABLE_SELECTION,
    );
  }
  const store = storeRef.current;

  const isControlledSelection = selectedKeysProp !== undefined;
  const onSelectionChangeRef = useRef(onSelectionChange);
  onSelectionChangeRef.current = onSelectionChange;
  const selectionModeRef = useRef(selectionMode);
  selectionModeRef.current = selectionMode;

  // Controlled: keep the external store in sync without putting `selectedKeys`
  // into React context (which would re-render every row).
  useLayoutEffect(() => {
    if (selectedKeysProp === undefined) return;
    store.setSelectedKeys(selectedKeysProp);
  }, [selectedKeysProp, store]);

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

  const onRowSelect = useCallback(
    (key: string | number) => {
      const next = toggleSelectionKey({
        selectionMode: selectionModeRef.current,
        selectedKeys: store.getSelectedKeys(),
        key,
      });
      if (!next) return;
      if (!isControlledSelection) {
        store.setSelectedKeys(next);
      }
      onSelectionChangeRef.current?.(next);
    },
    [isControlledSelection, store],
  );

  const setFocusedRowKey = useCallback(
    (key: string | number) => {
      store.setFocusedRowKey(key);
    },
    [store],
  );

  const claimFocusedRowKey = useCallback(
    (key: string | number) => {
      store.claimFocusedRowKey(key);
    },
    [store],
  );

  return useMemo(
    () => ({
      selectionMode,
      onRowSelect,
      sortDescriptor,
      onSortChange: setSortDescriptor,
      setFocusedRowKey,
      claimFocusedRowKey,
      rowStore: store,
    }),
    [
      claimFocusedRowKey,
      onRowSelect,
      selectionMode,
      setFocusedRowKey,
      setSortDescriptor,
      sortDescriptor,
      store,
    ],
  );
}
