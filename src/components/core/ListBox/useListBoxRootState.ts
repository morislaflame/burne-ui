import { useCallback, useId, useMemo, useRef, useState } from "react";
 
import { toggleOptionListSelection } from "@/components/core/utils/optionListSelection";
 
import { normalizeListBoxValues } from "./listBoxAPI";
import type { ListBoxContextValue, UseListBoxRootStateProps } from "./listBoxTypes";
 
export function useListBoxRootState({
  size = "base",
  selectionMode = "single",
  value: valueProp,
  defaultValue,
  onValueChange,
  values: valuesProp,
  defaultValues,
  onValuesChange,
  disabled = false,
  activeValue: activeValueProp,
  onActiveValueChange,
  listId: listIdProp,
}: UseListBoxRootStateProps) {
  const autoId = useId();
  const listId = listIdProp ?? `listbox-${autoId}`;
 
  const multiple = selectionMode === "multiple";
  const controlledSource = multiple ? valuesProp : valueProp;
  const defaultSource = multiple ? defaultValues : defaultValue;
  const isControlledValue = controlledSource !== undefined;
  const [internalSelected, setInternalSelected] = useState<string[]>(() =>
    normalizeListBoxValues(defaultSource),
  );
  const selectedArr = isControlledValue
    ? normalizeListBoxValues(controlledSource)
    : internalSelected;
  const selected = useMemo(() => new Set(selectedArr), [selectedArr]);
  const latestSelectedRef = useRef(selectedArr);
  // react-doctor-disable-next-line react-doctor/no-ref-current-in-render -- latest value so child layout effects see this render; an effect runs too late
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
      if (multiple) onValuesChange?.(next);
      else onValueChange?.(next[0] ?? null);
    },
    [isControlledValue, multiple, onValueChange, onValuesChange],
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
 