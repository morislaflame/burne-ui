import { focusKeyboard } from "@/components/core/utils/focusElement";

export const DROPDOWN_MENU_ITEM_SELECTOR =
  '[role="menuitem"]:not([aria-disabled="true"]), [role="menuitemcheckbox"]:not([disabled]), [role="menuitemradio"]:not([disabled])';

export function getFocusableDropdownMenuItems(root: HTMLElement): HTMLElement[] {
  return Array.from(
    root.querySelectorAll<HTMLElement>(DROPDOWN_MENU_ITEM_SELECTOR),
  ).filter((el) => !el.hasAttribute("disabled"));
}

export function focusDropdownMenuItem(items: HTMLElement[], index: number) {
  focusKeyboard(items[index]);
}

export function dropdownMenuItemTypeaheadLabel(el: HTMLElement): string {
  return (el.textContent ?? "").trim().replace(/\s+/g, " ");
}
