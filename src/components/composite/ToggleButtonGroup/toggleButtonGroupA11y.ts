import type { KeyboardEvent } from "react";

import type { ToggleButtonGroupOrientation } from "./toggleButtonGroupTypes";

export function collectToggleButtons(root: HTMLElement): HTMLButtonElement[] {
  return Array.from(root.querySelectorAll('[data-toggle-button-value]:not([disabled])')).filter(
    (el): el is HTMLButtonElement => el instanceof HTMLButtonElement,
  );
}

export function resolveToggleButtonTabIndex(
  isSingle: boolean,
  itemValue: string,
  selectedValue: string | undefined,
  firstItemValue: string | undefined,
): 0 | -1 | undefined {
  if (!isSingle) return undefined;
  if (selectedValue != null) return selectedValue === itemValue ? 0 : -1;
  return itemValue === firstItemValue ? 0 : -1;
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
    default:
      return null;
  }
}

export function toggleButtonGroupRootTabIndex(disabled: boolean): 0 | -1 {
  return disabled ? -1 : 0;
}

export function createToggleButtonGroupKeyDownHandler({
  disabled,
  isSingle,
  orientation,
  onKeyDown,
  select,
}: {
  disabled: boolean;
  isSingle: boolean;
  orientation: ToggleButtonGroupOrientation;
  onKeyDown?: (event: KeyboardEvent<HTMLDivElement>) => void;
  select: (value: string) => void;
}): (event: KeyboardEvent<HTMLDivElement>) => void {
  return (event) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || disabled || !isSingle) return;

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
    next.focus();
    const nextValue = next.dataset.toggleButtonValue;
    if (nextValue) select(nextValue);
  };
}
