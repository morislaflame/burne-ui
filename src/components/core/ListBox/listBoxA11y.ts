export const LISTBOX_EMPTY_DEFAULT_CHILDREN = "No matches";

export function listBoxOptionId(listId: string, value: string): string {
  return `${listId}-opt-${value}`;
}

export function resolveListBoxAriaLabel({
  ariaLabel,
  ariaLabelledBy,
  label,
}: {
  ariaLabel?: string;
  ariaLabelledBy?: string;
  label?: string;
}): {
  "aria-label"?: string;
  "aria-labelledby"?: string;
} {
  return {
    "aria-label": ariaLabel ?? (ariaLabelledBy ? undefined : label),
    "aria-labelledby": ariaLabelledBy,
  };
}
