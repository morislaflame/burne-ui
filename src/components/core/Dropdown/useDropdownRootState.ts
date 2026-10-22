import { useCallback, useId, useMemo, useRef, useState } from "react";
 
import { focusElement } from "@/components/core/utils/focusElement";
import { useSkinVariant } from "@/skins/skinContext";
import { toggleOptionListSelection } from "@/components/core/utils/optionListSelection";
 
import { normalizeDropdownValues } from "./dropdownAPI";
import type { DropdownContextValue, UseDropdownRootStateProps } from "./dropdownTypes";
 
export function useDropdownRootState({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  selectionMode = "single",
  value: valueProp,
  defaultValue,
  onValueChange,
  values: valuesProp,
  defaultValues,
  onValuesChange,
  closeOnSelect: closeOnSelectProp,
  size = "base",
  variant: popoverVariantProp,
  portalContainer,
}: UseDropdownRootStateProps) {
  const popoverVariant = useSkinVariant(popoverVariantProp);
  const isControlledOpen = openProp !== undefined;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = isControlledOpen ? openProp! : internalOpen;
 
  const triggerRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const subPanelRootsRef = useRef<Set<HTMLElement>>(new Set());
  const contentId = useId();
 
  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlledOpen) setInternalOpen(next);
      onOpenChange?.(next);
      if (!next) {
        requestAnimationFrame(() => {
          focusElement(triggerRef.current);
        });
      }
    },
    [isControlledOpen, onOpenChange],
  );
 
  const multiple = selectionMode === "multiple";
  const controlledSource = multiple ? valuesProp : valueProp;
  const defaultSource = multiple ? defaultValues : defaultValue;
  const isControlledValue = controlledSource !== undefined;
  const [internalSelected, setInternalSelected] = useState<string[]>(() =>
    normalizeDropdownValues(defaultSource),
  );

  const selectedArr = isControlledValue
    ? normalizeDropdownValues(controlledSource)
    : internalSelected;
  const selected = useMemo(() => new Set(selectedArr), [selectedArr]);
  const latestSelectedRef = useRef(selectedArr);
  // react-doctor-disable-next-line react-doctor/no-ref-current-in-render -- latest value so child layout effects see this render; an effect runs too late
  latestSelectedRef.current = selectedArr;
 
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
      size,
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
      size,
      popoverVariant,
      contentId,
      portalContainer,
      subPanelRootsRef,
    ],
  );
 
  return { contextValue };
}
 