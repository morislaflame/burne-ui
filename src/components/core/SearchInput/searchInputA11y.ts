export function searchInputCollapseA11yLabel(ariaLabel?: string): string {
  return ariaLabel ?? "Open search";
}

export function searchInputControlAriaLabel(
  ariaLabel?: string,
  placeholder?: string,
): string {
  return ariaLabel ?? (placeholder ? String(placeholder) : "Search");
}

export const SEARCH_INPUT_CLEAR_A11Y_LABEL = "Clear field";
