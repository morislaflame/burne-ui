import { DEFAULT_BURNE_LABELS } from "@/theme/burneLabels";

export function searchInputCollapseA11yLabel(
  ariaLabel?: string,
  openSearchLabel: string = DEFAULT_BURNE_LABELS.openSearch,
): string {
  return ariaLabel ?? openSearchLabel;
}

export function searchInputControlAriaLabel(
  ariaLabel?: string,
  placeholder?: string,
  searchLabel: string = DEFAULT_BURNE_LABELS.search,
): string {
  return ariaLabel ?? (placeholder ? String(placeholder) : searchLabel);
}

export function searchInputClearA11yLabel(
  clearLabel: string = DEFAULT_BURNE_LABELS.clearField,
): string {
  return clearLabel;
}
