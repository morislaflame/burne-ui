import { useCallback, useId, useMemo, useRef, useState } from "react";

import { toggleOptionListSelection } from "@/components/core/utils/optionListSelection";

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
  portalContainer,
}: UseDropdownRootStateProps) {
  const isControlledOpen = openProp !== undefined;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = isControlledOpen ? openProp! : internalOpen;

  const triggerRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const subPanelRootsRef = useRef<Set<HTMLElement>>(null!);
  if (!subPanelRootsRef.current) subPanelRootsRef.current = new Set();
  const contentId = useId();

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlledOpen) setInternalOpen(next);
      onOpenChange?.(next);
      if (!next) {
        requestAnimationFrame(() => {
          triggerRef.current?.focus({ preventScroll: true });
        });
      }
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
  const latestSelectedRef = useRef(selectedArr);
  latestSelectedRef.current = selectedArr;

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
      const close = closeOnSelectProp ?? !multiple;
      if (close) setOpen(false);
    },
    [closeOnSelectProp, multiple, setOpen, setSelectedArr],
  );

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
      portalContainer,
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
      portalContainer,
      subPanelRootsRef,
    ],
  );

  return { contextValue };
}
