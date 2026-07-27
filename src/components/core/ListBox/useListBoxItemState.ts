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
  value,
  disabled: disabledProp = false,
}: UseListBoxItemStateProps) {
  const {
    listId,
    size,
    selected,
    showIndicator,
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
        showIndicator,
      }),
    [children, hint, icon, label, showIndicator],
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
