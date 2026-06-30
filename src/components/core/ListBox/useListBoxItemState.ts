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
    selected,
    activeValue,
    showIndicator,
    indicatorMode,
    disabled: listDisabled,
    selectItem,
    setActiveValue,
  } = useListBox("ListBox.Item");

  const disabled = disabledProp || Boolean(listDisabled);
  const isSelected = selected.has(value);
  const isActive = activeValue === value;
  const optionId = listBoxOptionId(listId, value);

  const layout = resolveListBoxItemLayout({
    children,
    label,
    hint,
    icon,
    showIndicator,
  });

  return {
    disabled,
    isSelected,
    isActive,
    optionId,
    indicatorMode,
    selectItem,
    setActiveValue,
    ...layout,
  };
}
