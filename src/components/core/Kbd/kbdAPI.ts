import { Children, isValidElement, type ReactElement, type ReactNode } from "react";

import type { ClassValue } from "clsx";

import { cn } from "@/utils/cn";

export function mergeKbdSlotClass(...parts: ClassValue[]): string {
  return cn(...parts);
}

export function isKbdElement(el: ReactElement): boolean {
  const displayName = (el.type as { displayName?: string }).displayName;
  return displayName === "KbdRoot";
}

export function flattenKbdGroupChildren(children: ReactNode): ReactNode[] {
  const items: ReactNode[] = [];

  for (const child of Children.toArray(children)) {
    if (!isValidElement(child)) {
      if (child != null) items.push(child);
      continue;
    }

    if (isKbdElement(child)) {
      items.push(child);
      continue;
    }

    items.push(child);
  }

  return items;
}
