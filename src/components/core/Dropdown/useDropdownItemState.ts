import type { ReactNode } from "react";

import { partitionDropdownItemChildren } from "./dropdownAPI";
import { useDropdown, useDropdownIndicatorPreference } from "./dropdownContext";

export function useDropdownItemState({
  children,
  href,
  selection,
  value,
}: {
  children: ReactNode;
  href?: string;
  selection?: boolean;
  value?: string;
}) {
  const { selected, selectItem, multiple, indicatorMode, setOpen } = useDropdown();
  const indicatorPreference = useDropdownIndicatorPreference();
  const parts = partitionDropdownItemChildren(children);
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
  };
}
