import type { ReactElement, ReactNode, Ref } from "react";
import { Children, isValidElement, useCallback, useState } from "react";

export const POPOVER_ARROW_DISPLAY_NAME = "PopoverArrow";

export function mergePopoverRefs<T>(...refs: Array<Ref<T> | undefined>) {
  return (node: T | null) => {
    for (const ref of refs) {
      if (ref == null) continue;
      if (typeof ref === "function") ref(node);
      else ref.current = node;
    }
  };
}

export function isPopoverArrowElement(el: ReactElement): boolean {
  return (el.type as { displayName?: string }).displayName === POPOVER_ARROW_DISPLAY_NAME;
}

export function partitionPopoverContentChildren(children: ReactNode) {
  const parts = Children.toArray(children);
  const customArrow = parts.find(
    (child): child is ReactElement =>
      isValidElement(child) && isPopoverArrowElement(child),
  );
  const panelChildren = parts.filter(
    (child) => !(isValidElement(child) && isPopoverArrowElement(child)),
  );

  return { customArrow, panelChildren };
}

export function useControllableOpen(
  openProp: boolean | undefined,
  defaultOpen: boolean,
  onOpenChange?: (open: boolean) => void,
) {
  const [internal, setInternal] = useState(defaultOpen);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : internal;
  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setInternal(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );
  return [open, setOpen] as const;
}
