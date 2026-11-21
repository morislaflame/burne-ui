import { useCallback, useMemo, useRef, useState } from "react";

import { useSkinVariant } from "@/skins/skinContext";
 
import { toggleOptionListSelection } from "@/components/core/utils/optionListSelection";
 
import { createToggleButtonGroupKeyDownHandler, resolveToggleButtonTabIndex } from "./toggleButtonGroupA11y";
import {
  countToggleButtonChildren,
  extractDisabledToggleItemValues,
  extractEnabledToggleItemValues,
  flattenFragmentChildren,
  isToggleButtonGroupItemSelected,
  normalizeMultipleDefault,
  normalizeSingleDefault,
  resolveToggleButtonGroupSelectionChange,
} from "./toggleButtonGroupAPI";
import type {
  ToggleButtonGroupContextValue,
  UseToggleButtonGroupRootStateProps,
} from "./toggleButtonGroupTypes";
 
export function useToggleButtonGroupRootState({
  children,
  selectionMode = "multiple",
  disabled = false,
  size = "base",
  variant: variantProp,
  value: valueProp,
  defaultValue,
  onValueChange,
  values: valuesProp,
  defaultValues,
  onValuesChange,
  onKeyDown,
  orientation = "horizontal",
}: UseToggleButtonGroupRootStateProps) {
  const variant = useSkinVariant(variantProp);
  const type = selectionMode;
  const isSingle = type === "single";
  const controlledSource = isSingle ? valueProp : valuesProp;
  const defaultSource = isSingle ? defaultValue : defaultValues;
  const isControlled = controlledSource !== undefined;
 
  const [internalSingle, setInternalSingle] = useState<string | undefined>(() =>
    normalizeSingleDefault(defaultSource),
  );
  const [internalMultiple, setInternalMultiple] = useState<string[]>(() =>
    normalizeMultipleDefault(defaultSource),
  );

  const singleValue = isSingle
    ? isControlled
      ? normalizeSingleDefault(controlledSource)
      : internalSingle
    : undefined;

  const multipleValues = useMemo(
    () =>
      !isSingle
        ? isControlled
          ? normalizeMultipleDefault(controlledSource)
          : internalMultiple
        : [],
    [controlledSource, internalMultiple, isControlled, isSingle],
  );
  const latestMultipleRef = useRef(multipleValues);
  // react-doctor-disable-next-line react-doctor/no-ref-current-in-render -- latest value so child layout effects see this render; an effect runs too late
  latestMultipleRef.current = multipleValues;
 
  const flat = useMemo(() => flattenFragmentChildren(children), [children]);
  const segmentCount = useMemo(() => countToggleButtonChildren(flat), [flat]);
  const enabledToggleValues = useMemo(
    () => extractEnabledToggleItemValues(flat, disabled),
    [disabled, flat],
  );
  const disabledToggleValues = useMemo(
    () => extractDisabledToggleItemValues(flat),
    [flat],
  );
  const enabledSet = useMemo(() => new Set(enabledToggleValues), [enabledToggleValues]);
  const firstEnabledToggleValue = enabledToggleValues[0];
 
  // Roving tab stop — independent of selection (arrows move focus only).
  const [rovingValue, setRovingValue] = useState<string | undefined>(undefined);
  const candidateRoving =
    rovingValue ??
    (isSingle ? singleValue : multipleValues.find((v) => enabledSet.has(v)));
  const resolvedRovingValue =
    candidateRoving != null && enabledSet.has(candidateRoving)
      ? candidateRoving
      : firstEnabledToggleValue;
 
  const isSelected = useCallback(
    (itemValue: string) =>
      isToggleButtonGroupItemSelected(type, itemValue, singleValue, multipleValues),
    [multipleValues, singleValue, type],
  );
 
  const select = useCallback(
    (itemValue: string) => {
      if (disabled || disabledToggleValues.has(itemValue)) return;
 
      if (isSingle) {
        const change = resolveToggleButtonGroupSelectionChange(
          type,
          itemValue,
          singleValue,
          multipleValues,
        );
        if (change == null || change.kind !== "single") return;
        if (!isControlled) setInternalSingle(change.value);
        onValueChange?.(change.value || null);
        return;
      }

      const next = toggleOptionListSelection(latestMultipleRef.current, itemValue, true);
      latestMultipleRef.current = next;
      if (!isControlled) setInternalMultiple(next);
      onValuesChange?.(next);
    },
    [disabled, disabledToggleValues, isControlled, isSingle, multipleValues, onValueChange, onValuesChange, singleValue, type],
  );
 
  const tabIndexFor = useCallback(
    (itemValue: string) => {
      if (disabled || disabledToggleValues.has(itemValue)) return -1;
      return resolveToggleButtonTabIndex(itemValue, resolvedRovingValue, firstEnabledToggleValue);
    },
    [disabled, disabledToggleValues, firstEnabledToggleValue, resolvedRovingValue],
  );
 
  const contextValue = useMemo<ToggleButtonGroupContextValue>(
    () => ({
      type,
      disabled,
      size,
      variant,
      isSelected,
      select,
      tabIndexFor,
      setRovingValue,
    }),
    [disabled, isSelected, select, setRovingValue, size, tabIndexFor, type, variant],
  );
 
  const handleKeyDown = useMemo(
    () =>
      createToggleButtonGroupKeyDownHandler({
        disabled,
        orientation,
        onKeyDown,
        setRovingValue,
      }),
    [disabled, onKeyDown, orientation],
  );
 
  const selectionIdentity = isSingle
    ? (singleValue ?? "")
    : multipleValues.join("\0");
 
  return {
    flat,
    segmentCount,
    contextValue,
    handleKeyDown,
    selectionIdentity,
  };
}
 