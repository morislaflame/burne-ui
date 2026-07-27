import { useMemo, type ReactNode } from "react";

import type { OptionListItemContextValue } from "@/components/core/utils/optionListItemContext";

import { partitionDropdownItemChildren } from "./dropdownAPI";
import { useDropdown, useDropdownIndicatorPreference } from "./dropdownContext";
import type { DropdownItemStatus } from "./dropdownTypes";

export function useDropdownItemState({
  children,
  href,
  selection,
  value,
  disabled = false,
  status = "default",
}: {
  children: ReactNode;
  href?: string;
  selection?: boolean;
  value?: string;
  disabled?: boolean;
  status?: DropdownItemStatus;
}) {
  const { selected, selectItem, multiple, indicatorMode, setOpen } = useDropdown();
  const indicatorPreference = useDropdownIndicatorPreference();
  const parts = useMemo(
    () => partitionDropdownItemChildren(children),
    [children],
  );
  const hasItemIndicator = parts.indicator != null;
  const hasHint = parts.hint != null;
  const hasIcon = parts.icon != null;
  const isLink = Boolean(href);
  const isSelectionItem = !isLink && selection !== false;
  const showIndicatorSlot =
    isSelectionItem && (multiple || indicatorPreference || hasItemIndicator);
  const itemRole = !showIndicatorSlot
    ? "menuitem"
    : indicatorMode === "multi"
      ? "menuitemcheckbox"
      : "menuitemradio";
  const isSelected = isSelectionItem && value != null && selected.has(value);

  const itemCtx: OptionListItemContextValue = useMemo(
    () => ({
      showIndicatorSlot,
      hasHint,
      hasIcon,
      selected: isSelected,
      indicatorMode,
      disabled,
      mutedHint: disabled || status === "default",
    }),
    [
      disabled,
      hasHint,
      hasIcon,
      indicatorMode,
      isSelected,
      showIndicatorSlot,
      status,
    ],
  );

  return {
    parts,
    selectItem,
    indicatorMode,
    setOpen,
    hasItemIndicator,
    hasHint,
    hasIcon,
    isLink,
    isSelectionItem,
    showIndicatorSlot,
    itemRole,
    isSelected,
    itemCtx,
  };
}
