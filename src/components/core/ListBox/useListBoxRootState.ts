import { useCallback, useId, useMemo, useRef, useState } from "react";

import { toggleOptionListSelection } from "@/components/core/utils/optionListSelection";

import { normalizeListBoxValues } from "./listBoxAPI";
import type { ListBoxContextValue, UseListBoxRootStateProps } from "./listBoxTypes";

export function useListBoxRootState({
  size = "base",
  multiple = false,
  value: valueProp,
  defaultValue,
  onValueChange,
  disabled = false,
  activeValue: activeValueProp,
  onActiveValueChange,
  listId: listIdProp,
}: UseListBoxRootStateProps) {
  const autoId = useId();
  const listId = listIdProp ?? `listbox-${autoId}`;

  const isControlledValue = valueProp !== undefined;
  const [internalSelected, setInternalSelected] = useState<string[]>(() =>
    normalizeListBoxValues(defaultValue),
  );
  const selectedArr = isControlledValue
    ? normalizeListBoxValues(valueProp)
    : internalSelected;
  const selected = useMemo(() => new Set(selectedArr), [selectedArr]);
  const latestSelectedRef = useRef(selectedArr);
  latestSelectedRef.current = selectedArr;

  const [internalActive, setInternalActive] = useState<string | null>(null);
  const isControlledActive = activeValueProp !== undefined;
  const activeValue = isControlledActive ? activeValueProp : internalActive;

  const setActiveValue = useCallback(
    (next: string | null) => {
      if (!isControlledActive) setInternalActive(next);
      onActiveValueChange?.(next);
    },
    [isControlledActive, onActiveValueChange],
  );

  const setSelectedArr = useCallback(
    (next: string[]) => {
      if (!isControlledValue) setInternalSelected(next);
      onValueChange?.(multiple ? next : (next[0] ?? ""));
    },
    [isControlledValue, multiple, onValueChange],
  );

  const selectItem = useCallback(
    (itemValue: string) => {
      const next = toggleOptionListSelection(
        latestSelectedRef.current,
        itemValue,
        multiple,
      );
      latestSelectedRef.current = next;
      setSelectedArr(next);
    },
    [multiple, setSelectedArr],
  );

  // `activeValue` lives in a separate context so arrow/hover highlight does not
  // invalidate this value (and re-render every item + layout walk).
  const contextValue = useMemo<ListBoxContextValue>(
    () => ({
      listId,
      size,
      multiple,
      selected,
      selectItem,
      setActiveValue,
      indicatorMode: multiple ? "multi" : "radio",
      disabled,
      standaloneKeyboard: !isControlledActive,
    }),
    [
      disabled,
      isControlledActive,
      listId,
      multiple,
      selectItem,
      selected,
      setActiveValue,
      size,
    ],
  );

  return { listId, contextValue, activeValue };
}
