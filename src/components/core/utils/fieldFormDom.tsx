import { useLayoutEffect, useRef, type HTMLAttributes, type RefObject } from "react";

import { dataFlag } from "./dataContract";

const FIELD_FOCUS_SELECTOR =
  'input:not([type="hidden"]):not([aria-hidden="true"]), button[role="combobox"], button[role="slider"], [role="spinbutton"], [role="combobox"]';

/** One hidden input per value so a native form and `FormData` see the field. */
export function FieldHiddenValues({
  name,
  value,
}: {
  name?: string;
  value: string | number | readonly (string | number)[] | null | undefined;
}) {
  if (!name) return null;
  const list = Array.isArray(value) ? value : [value ?? ""];
  return (
    <>
      {list.map((item, index) => (
        <input
          // Position is the identity: the same value may be submitted more than once.
          // eslint-disable-next-line react/no-array-index-key -- duplicate form values stay distinct
          key={`${name}-${index}`}
          type="hidden"
          name={name}
          value={item == null ? "" : String(item)}
        />
      ))}
    </>
  );
}

export function readOnlyAria(readOnly: boolean | undefined): true | undefined {
  return readOnly ? true : undefined;
}

export function readOnlyData(readOnly: boolean | undefined): "" | undefined {
  return dataFlag(readOnly);
}

/**
 * `style`, `className` and `data-*` belong on the field root.
 * Remaining attributes are control attributes (`name`, `value`, `aria-*`, handlers).
 */
export function splitFieldHostRest<T extends object>(rest: T): {
  host: HTMLAttributes<HTMLElement>;
  control: Omit<T, "style" | "className">;
} {
  const host: Record<string, unknown> = {};
  const control: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(rest as Record<string, unknown>)) {
    if (key === "style" || key === "className" || key.startsWith("data-")) {
      host[key] = value;
    } else {
      control[key] = value;
    }
  }
  return {
    host: host as HTMLAttributes<HTMLElement>,
    control: control as Omit<T, "style" | "className">,
  };
}

/**
 * `autoFocus` and `tabIndex` on a field root land on the wrapper.
 * Move them onto the first focusable control inside that root.
 */
export function useFieldControlFocus(
  rootRef: RefObject<HTMLElement | null>,
  autoFocus: boolean | undefined,
  tabIndex: number | undefined,
) {
  const didFocus = useRef(false);
  useLayoutEffect(() => {
    if (autoFocus == null && tabIndex == null) return;
    const root = rootRef.current;
    if (!root) return;
    const el = root.querySelector<HTMLElement>(FIELD_FOCUS_SELECTOR);
    if (!el) return;
    if (tabIndex != null) el.tabIndex = tabIndex;
    if (autoFocus && !didFocus.current) {
      didFocus.current = true;
      el.focus();
    }
  }, [autoFocus, rootRef, tabIndex]);
}
