import { useCallback, useId, useMemo, useRef, useState } from "react";

import { normalizeDropdownValues } from "./dropdownAPI";
import type { DropdownContextValue, UseDropdownRootStateProps } from "./dropdownTypes";

export function useDropdownRootState({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  multiple = false,
  value: valueProp,
  defaultValue,
  onValueChange,
  closeOnSelect: closeOnSelectProp,
  popoverVariant = "default",
}: UseDropdownRootStateProps) {
  const isControlledOpen = openProp !== undefined;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = isControlledOpen ? openProp! : internalOpen;

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlledOpen) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [isControlledOpen, onOpenChange],
  );

  const isControlledValue = valueProp !== undefined;
  const [internalSelected, setInternalSelected] = useState<string[]>(() =>
    normalizeDropdownValues(defaultValue),
  );

  const selectedArr = isControlledValue
    ? normalizeDropdownValues(valueProp)
    : internalSelected;
  const selected = useMemo(() => new Set(selectedArr), [selectedArr]);

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
      const close = closeOnSelectProp ?? !multiple;
      if (close) setOpen(false);
    },
    [multiple, selected, selectedArr, setOpen, setSelectedArr, closeOnSelectProp],
  );

  const triggerRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const subPanelRootsRef = useRef<Set<HTMLElement>>(null!);
  if (!subPanelRootsRef.current) subPanelRootsRef.current = new Set();
  const contentId = useId();

  const indicatorMode: "radio" | "multi" = multiple ? "multi" : "radio";

  const contextValue: DropdownContextValue = useMemo(
    () => ({
      open,
      setOpen,
      multiple,
      selected,
      selectItem,
      indicatorMode,
      closeOnSelect: closeOnSelectProp ?? !multiple,
      popoverVariant,
      triggerRef,
      contentRef,
      contentId,
      subPanelRootsRef,
    }),
    [
      open,
      setOpen,
      multiple,
      selected,
      selectItem,
      indicatorMode,
      closeOnSelectProp,
      popoverVariant,
      contentId,
      subPanelRootsRef,
    ],
  );

  return { contextValue };
}
