import type { KeyboardEvent } from "react";

import { focusKeyboard } from "@/components/core/utils/focusElement";

import type { ToggleButtonGroupOrientation } from "./toggleButtonGroupTypes";

export function collectToggleButtons(root: HTMLElement): HTMLButtonElement[] {
  return Array.from(root.querySelectorAll('[data-toggle-button-value]:not([disabled])')).filter(
    (el): el is HTMLButtonElement => el instanceof HTMLButtonElement,
  );
}

/**
 * Roving tabindex: one tab stop in the group (focused / last-roved item).
 * Falls back to `firstItemValue` before any focus interaction.
 */
export function resolveToggleButtonTabIndex(
  itemValue: string,
  rovingValue: string | undefined,
  firstItemValue: string | undefined,
): 0 | -1 {
  const active = rovingValue ?? firstItemValue;
  return itemValue === active ? 0 : -1;
}

export function resolveToggleButtonArrowTargetIndex(
  key: string,
  orientation: ToggleButtonGroupOrientation,
  currentIndex: number,
  itemCount: number,
): number | null {
  if (itemCount === 0) return null;

  const horizontal = orientation === "horizontal";

  switch (key) {
    case "ArrowRight":
      return horizontal ? (currentIndex < 0 ? 0 : (currentIndex + 1) % itemCount) : null;
    case "ArrowLeft":
      return horizontal
        ? currentIndex < 0
          ? itemCount - 1
          : (currentIndex - 1 + itemCount) % itemCount
        : null;
    case "ArrowDown":
      return !horizontal ? (currentIndex < 0 ? 0 : (currentIndex + 1) % itemCount) : null;
    case "ArrowUp":
      return !horizontal
        ? currentIndex < 0
          ? itemCount - 1
          : (currentIndex - 1 + itemCount) % itemCount
        : null;
    case "Home":
      return 0;
    case "End":
      return itemCount - 1;
    default:
      return null;
  }
}

/**
 * Arrows / Home / End move focus only (roving). Enter / Space stay on the
 * focused `<button>` and toggle/select via native activation + click handler.
 */
export function createToggleButtonGroupKeyDownHandler({
  disabled,
  orientation,
  onKeyDown,
  setRovingValue,
}: {
  disabled: boolean;
  orientation: ToggleButtonGroupOrientation;
  onKeyDown?: (event: KeyboardEvent<HTMLDivElement>) => void;
  setRovingValue: (value: string) => void;
}): (event: KeyboardEvent<HTMLDivElement>) => void {
  return (event) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || disabled) return;

    const items = collectToggleButtons(event.currentTarget);
    if (items.length === 0) return;

    const currentIndex = items.findIndex((el) => el === document.activeElement);
    const nextIndex = resolveToggleButtonArrowTargetIndex(
      event.key,
      orientation,
      currentIndex,
      items.length,
    );

    if (nextIndex == null) return;

    event.preventDefault();
    const next = items[nextIndex]!;
    const nextValue = next.dataset.toggleButtonValue;
    if (nextValue) setRovingValue(nextValue);
    focusKeyboard(next);
  };
}
