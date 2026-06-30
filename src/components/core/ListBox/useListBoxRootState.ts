import { useCallback, useId, useMemo, useState } from "react";

import { normalizeListBoxValues } from "./listBoxAPI";
import type { ListBoxContextValue, UseListBoxRootStateProps } from "./listBoxTypes";

export function useListBoxRootState({
  size = "base",
  multiple = false,
  value: valueProp,
  defaultValue,
  onValueChange,
  selectionIndicator = true,
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
      let next: string[];
      if (multiple) {
        next = [...selectedArr];
        const i = next.indexOf(itemValue);
        if (i >= 0) next.splice(i, 1);
        else next.push(itemValue);
      } else {
        next = selected.has(itemValue) ? [] : [itemValue];
      }
      setSelectedArr(next);
    },
    [multiple, selected, selectedArr, setSelectedArr],
  );

  const contextValue = useMemo<ListBoxContextValue>(
    () => ({
      listId,
      size,
      multiple,
      selected,
      selectItem,
      activeValue,
      setActiveValue,
      showIndicator: selectionIndicator,
      indicatorMode: multiple ? "multi" : "radio",
      disabled,
    }),
    [
      activeValue,
      disabled,
      listId,
      multiple,
      selectItem,
      selected,
      selectionIndicator,
      setActiveValue,
      size,
    ],
  );

  return { listId, contextValue };
}
