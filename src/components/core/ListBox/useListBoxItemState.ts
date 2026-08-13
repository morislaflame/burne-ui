import { useMemo } from "react";

import { listBoxOptionId } from "./listBoxA11y";
import { resolveListBoxItemLayout } from "./listBoxAPI";
import { useListBox } from "./listBoxContext";
import type { UseListBoxItemStateProps } from "./listBoxTypes";

export function useListBoxItemState({
  children,
  label,
  hint,
  icon,
  indicator = false,
  value,
  disabled: disabledProp = false,
}: UseListBoxItemStateProps) {
  const {
    listId,
    size,
    selected,
    indicatorMode,
    disabled: listDisabled,
    selectItem,
    setActiveValue,
  } = useListBox("ListBox.Item");

  const disabled = disabledProp || Boolean(listDisabled);
  const isSelected = selected.has(value);
  const optionId = listBoxOptionId(listId, value);

  const layout = useMemo(
    () =>
      resolveListBoxItemLayout({
        children,
        label,
        hint,
        icon,
        indicator,
      }),
    [children, hint, icon, indicator, label],
  );

  return {
    size,
    disabled,
    isSelected,
    optionId,
    indicatorMode,
    selectItem,
    setActiveValue,
    ...layout,
  };
}
