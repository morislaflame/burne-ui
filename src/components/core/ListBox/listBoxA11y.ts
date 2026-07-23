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

export function listBoxActiveOptionId(
  listId: string,
  activeValue: string | null,
): string | undefined {
  return activeValue ? listBoxOptionId(listId, activeValue) : undefined;
}

export function listBoxEnabledOptionElements(
  root: HTMLElement,
): HTMLElement[] {
  return Array.from(
    root.querySelectorAll<HTMLElement>(
      '[role="option"]:not([disabled]):not([aria-disabled="true"])',
    ),
  );
}

export function listBoxOptionValue(el: HTMLElement): string | null {
  return el.dataset.value ?? null;
}
