import { Children, isValidElement, type ReactNode } from "react";

export type OptionListItemParts = {
  indicator: ReactNode | null;
  label: ReactNode | null;
  hint: ReactNode | null;
  icon: ReactNode | null;
  rest: ReactNode[];
};

const INDICATOR_NAMES = new Set([
  "ListBoxItemIndicator",
  "DropdownItemIndicator",
]);

const LABEL_NAMES = new Set(["ListBoxLabel", "DropdownItemLabel", "Dropdown.ItemLabel"]);

const HINT_NAMES = new Set(["ListBoxHint", "DropdownItemHint", "Dropdown.ItemHint"]);

const ICON_NAMES = new Set(["ListBoxIcon", "DropdownItemIcon", "Dropdown.ItemIcon"]);

function partDisplayName(type: unknown): string | undefined {
  return (type as { displayName?: string }).displayName;
}

/** Разбирает compound-children пункта списка на слоты label / hint / icon / indicator. */
export function partitionOptionListItemChildren(children: ReactNode): OptionListItemParts {
  let indicator: ReactNode | null = null;
  let label: ReactNode | null = null;
  let hint: ReactNode | null = null;
  let icon: ReactNode | null = null;
  const rest: ReactNode[] = [];

  for (const child of Children.toArray(children)) {
    if (!isValidElement(child)) {
      rest.push(child);
      continue;
    }
    const name = partDisplayName(child.type);
    if (name && INDICATOR_NAMES.has(name)) {
      if (indicator == null) indicator = child;
      continue;
    }
    if (name && LABEL_NAMES.has(name)) {
      if (label == null) label = child;
      continue;
    }
    if (name && HINT_NAMES.has(name)) {
      if (hint == null) hint = child;
      continue;
    }
    if (name && ICON_NAMES.has(name)) {
      if (icon == null) icon = child;
      continue;
    }
    rest.push(child);
  }

  return { indicator, label, hint, icon, rest };
}
