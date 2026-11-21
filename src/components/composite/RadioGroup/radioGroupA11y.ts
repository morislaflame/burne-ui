import { Children, isValidElement, type KeyboardEvent, type ReactNode } from "react";

import { focusKeyboard } from "@/components/core/utils/focusElement";
import { isRtlElement } from "@/components/core/utils/readingDirection";

import type { RadioGroupItem } from "./radioGroupTypes";

/**
 * RadioGroup uses native `<fieldset role="radiogroup">` + `<legend>`.
 * `aria-readonly` lives on the group: ARIA 1.2 does not allow it on `radio`.
 * Hint/error ids feed `Field.Set` → `aria-describedby`.
 */
export const RADIO_GROUP_USES_NATIVE_FIELDSET = true as const;
 
export function radioGroupName(nameProp: string | undefined, autoId: string): string {
  return nameProp ?? `radio-group-${autoId}`;
}

export function findFirstEnabledRadioValue(
  items: readonly RadioGroupItem[] | undefined,
  children: ReactNode,
): string | null {
  if (items && items.length > 0) {
    const first = items.find((item) => !item.disabled);
    return first ? String(first.value) : "";
  }

  let foundAnyRadio = false;
  let firstEnabled: string | null = null;

  const walk = (node: ReactNode) => {
    if (firstEnabled !== null) return;
    for (const child of Children.toArray(node)) {
      if (!isValidElement(child)) continue;
      const displayName = (child.type as { displayName?: string }).displayName;
      const props = child.props as {
        value?: unknown;
        disabled?: boolean;
        children?: ReactNode;
      };
      if (displayName === "RadioRoot") {
        foundAnyRadio = true;
        if (!props.disabled && props.value !== undefined && props.value !== null) {
          firstEnabled = String(props.value);
          return;
        }
        continue;
      }
      if (props.children != null) {
        walk(props.children);
      }
    }
  };

  walk(children);
  if (firstEnabled !== null) return firstEnabled;
  return foundAnyRadio ? "" : null;
}

export function createRadioGroupKeyDownHandler({
  disabled,
  readOnly,
  groupName,
  selectValue,
  onKeyDown,
}: {
  disabled: boolean;
  readOnly: boolean;
  groupName: string;
  selectValue: (value: string | undefined) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLFieldSetElement>) => void;
}): (event: KeyboardEvent<HTMLFieldSetElement>) => void {
  return (event) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;

    const { key } = event;
    const isArrow =
      key === "ArrowRight" ||
      key === "ArrowLeft" ||
      key === "ArrowDown" ||
      key === "ArrowUp";
    if (!isArrow) return;

    if (disabled || readOnly) {
      event.preventDefault();
      return;
    }

    const groupEl = event.currentTarget;
    const radios = Array.from(
      groupEl.querySelectorAll<HTMLInputElement>('input[type="radio"]:not(:disabled)'),
    ).filter((input) => !input.name || input.name === groupName);
    if (radios.length === 0) return;

    const rtl = isRtlElement(groupEl);
    const step: 1 | -1 =
      key === "ArrowDown"
        ? 1
        : key === "ArrowUp"
          ? -1
          : key === "ArrowRight"
            ? rtl
              ? -1
              : 1
            : rtl
              ? 1
              : -1;

    let currentIndex = radios.findIndex((el) => el === document.activeElement);
    if (currentIndex < 0) {
      currentIndex = radios.findIndex((el) => el.checked);
    }

    const nextIndex =
      currentIndex < 0
        ? step > 0
          ? 0
          : radios.length - 1
        : (currentIndex + step + radios.length) % radios.length;

    const nextRadio = radios[nextIndex]!;
    event.preventDefault();
    focusKeyboard(nextRadio);
    if (nextRadio.hasAttribute("value")) {
      selectValue(nextRadio.value);
    } else {
      nextRadio.click();
    }
  };
}
 