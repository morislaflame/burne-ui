export const LISTBOX_EMPTY_DEFAULT_CHILDREN = "No matches";

export function listBoxOptionId(listId: string, value: string): string {
  return `${listId}-opt-${value}`;
}

export function resolveListBoxAriaLabel({
  ariaLabel,
  ariaLabelledBy,
}: {
  ariaLabel?: string;
  ariaLabelledBy?: string;
}): {
  "aria-label"?: string;
  "aria-labelledby"?: string;
} {
  return {
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
  };
}
