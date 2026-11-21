import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
 
import { useControllableState } from "@/components/core/utils/useControllableState";
 
import { EMPTY_TABLE_SELECTION, selectionEquals, tableDisabledKeySet, toggleSelectionKey } from "./tableAPI";
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
  let catalogKeys: readonly (string | number)[] | null = null;
  const mountedKeyCounts = new Map<string | number, number>();
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
    registerRowKey(key) {
      mountedKeyCounts.set(key, (mountedKeyCounts.get(key) ?? 0) + 1);
      return () => {
        const nextCount = (mountedKeyCounts.get(key) ?? 1) - 1;
        if (nextCount <= 0) mountedKeyCounts.delete(key);
        else mountedKeyCounts.set(key, nextCount);
      };
    },
    setCatalogKeys(keys) {
      catalogKeys = keys;
    },
    getAllRowKeys() {
      if (catalogKeys != null) return [...catalogKeys];
      return Array.from(mountedKeyCounts.keys());
    },
  };
}
 
export function useTableContentState({
  selectionMode = "none",
  disallowEmptySelection = false,
  selectedKeys: selectedKeysProp,
  defaultSelectedKeys,
  onSelectionChange,
  sortDescriptor: sortDescriptorProp,
  defaultSortDescriptor,
  onSortChange,
  disabledKeys,
  stickyHeader = false,
  columnResize = false,
}: {
  selectionMode?: SelectionMode;
  disallowEmptySelection?: boolean;
  selectedKeys?: Selection;
  defaultSelectedKeys?: Selection;
  onSelectionChange?: (keys: Selection) => void;
  sortDescriptor?: SortDescriptor;
  defaultSortDescriptor?: SortDescriptor;
  onSortChange?: (descriptor: SortDescriptor) => void;
  disabledKeys?: ReadonlySet<string | number> | readonly (string | number)[];
  stickyHeader?: boolean;
  columnResize?: boolean;
}): TableContentContextValue {
  const [store] = useState(() =>
    createRowSelectionStore(
      selectedKeysProp ?? defaultSelectedKeys ?? EMPTY_TABLE_SELECTION,
    ),
  );
 
  const isControlledSelection = selectedKeysProp !== undefined;
  const onSelectionChangeRef = useRef(onSelectionChange);
  // react-doctor-disable-next-line react-doctor/no-ref-current-in-render -- latest value so child layout effects see this render; an effect runs too late
  onSelectionChangeRef.current = onSelectionChange;
  const selectionModeRef = useRef(selectionMode);
  // react-doctor-disable-next-line react-doctor/no-ref-current-in-render -- latest value so child layout effects see this render; an effect runs too late
  selectionModeRef.current = selectionMode;
  const disallowEmptySelectionRef = useRef(disallowEmptySelection);
  // react-doctor-disable-next-line react-doctor/no-ref-current-in-render -- latest value so callbacks stay stable
  disallowEmptySelectionRef.current = disallowEmptySelection;
 
  const disabled = useMemo(() => tableDisabledKeySet(disabledKeys), [disabledKeys]);
  const disabledRef = useRef(disabled);
  // react-doctor-disable-next-line react-doctor/no-ref-current-in-render -- latest value so callbacks stay stable
  disabledRef.current = disabled;

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
      const current = store.getSelectedKeys();
      const allSelectableKeys = store
        .getAllRowKeys()
        .filter((k) => !disabledRef.current.has(String(k)));
      const next = toggleSelectionKey({
        selectionMode: selectionModeRef.current,
        selectedKeys: current,
        key,
        allSelectableKeys,
        disallowEmptySelection: disallowEmptySelectionRef.current,
      });
      if (!next || selectionEquals(current, next)) return;
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

  const isRowDisabled = useCallback(
    (key: string | number) => disabled.has(String(key)),
    [disabled],
  );

  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
  const setColumnWidth = useCallback((id: string, width: number) => {
    setColumnWidths((prev) => (prev[id] === width ? prev : { ...prev, [id]: width }));
  }, []);

  return useMemo(
    () => ({
      selectionMode,
      onRowSelect,
      sortDescriptor,
      onSortChange: setSortDescriptor,
      setFocusedRowKey,
      claimFocusedRowKey,
      rowStore: store,
      isRowDisabled,
      stickyHeader,
      columnResize,
      columnWidths,
      setColumnWidth,
    }),
    [
      claimFocusedRowKey,
      isRowDisabled,
      onRowSelect,
      selectionMode,
      setFocusedRowKey,
      setSortDescriptor,
      sortDescriptor,
      stickyHeader,
      columnResize,
      columnWidths,
      setColumnWidth,
      store,
    ],
  );
}
 