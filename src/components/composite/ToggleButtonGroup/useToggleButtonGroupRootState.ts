import { useCallback, useMemo, useRef, useState } from "react";

import { toggleOptionListSelection } from "@/components/core/utils/optionListSelection";

import { createToggleButtonGroupKeyDownHandler, resolveToggleButtonTabIndex } from "./toggleButtonGroupA11y";
import {
  countToggleButtonChildren,
  extractToggleItemValues,
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
  type = "multiple",
  disabled = false,
  size = "base",
  variant = "default",
  value: valueProp,
  defaultValue,
  onValueChange,
  onKeyDown,
  orientation = "horizontal",
}: UseToggleButtonGroupRootStateProps) {
  const isSingle = type === "single";
  const isControlled = valueProp !== undefined;

  const [internalSingle, setInternalSingle] = useState<string | undefined>(() =>
    normalizeSingleDefault(defaultValue),
  );
  const [internalMultiple, setInternalMultiple] = useState<string[]>(() =>
    normalizeMultipleDefault(defaultValue),
  );

  const singleValue = isSingle
    ? isControlled
      ? normalizeSingleDefault(valueProp)
      : internalSingle
    : undefined;

  const multipleValues = useMemo(
    () =>
      !isSingle
        ? isControlled
          ? normalizeMultipleDefault(valueProp)
          : internalMultiple
        : [],
    [internalMultiple, isControlled, isSingle, valueProp],
  );
  const latestMultipleRef = useRef(multipleValues);
  latestMultipleRef.current = multipleValues;

  const isSelected = useCallback(
    (itemValue: string) =>
      isToggleButtonGroupItemSelected(type, itemValue, singleValue, multipleValues),
    [multipleValues, singleValue, type],
  );

  const select = useCallback(
    (itemValue: string) => {
      if (disabled) return;

      if (isSingle) {
        const change = resolveToggleButtonGroupSelectionChange(
          type,
          itemValue,
          singleValue,
          multipleValues,
        );
        if (change == null || change.kind !== "single") return;
        if (!isControlled) setInternalSingle(change.value);
        onValueChange?.(change.value);
        return;
      }

      const next = toggleOptionListSelection(latestMultipleRef.current, itemValue, true);
      latestMultipleRef.current = next;
      if (!isControlled) setInternalMultiple(next);
      onValueChange?.(next);
    },
    [disabled, isControlled, isSingle, multipleValues, onValueChange, singleValue, type],
  );

  const flat = useMemo(() => flattenFragmentChildren(children), [children]);
  const segmentCount = useMemo(() => countToggleButtonChildren(flat), [flat]);
  const firstToggleValue = useMemo(() => extractToggleItemValues(flat)[0], [flat]);

  const tabIndexFor = useCallback(
    (itemValue: string) =>
      resolveToggleButtonTabIndex(isSingle, itemValue, singleValue, firstToggleValue),
    [firstToggleValue, isSingle, singleValue],
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
    }),
    [disabled, isSelected, select, size, tabIndexFor, type, variant],
  );

  const handleKeyDown = useMemo(
    () =>
      createToggleButtonGroupKeyDownHandler({
        disabled,
        isSingle,
        orientation,
        onKeyDown,
        select,
      }),
    [disabled, isSingle, onKeyDown, orientation, select],
  );

  return {
    flat,
    segmentCount,
    contextValue,
    handleKeyDown,
    isSingle,
  };
}
