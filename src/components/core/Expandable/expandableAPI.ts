import type { ClassValue } from "clsx";
import { Children, isValidElement, type ReactNode, type Ref, type RefObject } from "react";

import { Ripple } from "@/components/core/Ripple";
import { cn } from "@/utils/cn";

import {
  EXPANDABLE_COMPOUND_SLOT_DISPLAY_NAMES,
  EXPANDABLE_MESSAGE_DISPLAY_NAMES,
} from "./expandableA11y";

export function mergeExpandableSlotClass(...parts: ClassValue[]): string {
  return cn(...parts);
}

export function mergeExpandableRefs<T>(...refs: Array<Ref<T> | undefined>) {
  return (node: T | null) => {
    for (const ref of refs) {
      if (ref == null) continue;
      if (typeof ref === "function") ref(node);
      else (ref as RefObject<T | null>).current = node;
    }
  };
}

export function readExpandablePartDisplayName(type: unknown): string | undefined {
  return (type as { displayName?: string }).displayName;
}

export function partitionExpandableTriggerRipple(children: ReactNode): {
  ripples: ReactNode[];
  rest: ReactNode;
} {
  const ripples: ReactNode[] = [];
  const rest: ReactNode[] = [];

  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.type === Ripple) {
      ripples.push(child);
    } else {
      rest.push(child);
    }
  });

  return { ripples, rest };
}

export function hasExpandableMessage(children: ReactNode): boolean {
  let found = false;

  Children.forEach(children, (child) => {
    if (found || !isValidElement(child)) return;
    const name = readExpandablePartDisplayName(child.type);
    if (name != null && EXPANDABLE_MESSAGE_DISPLAY_NAMES.has(name)) {
      found = true;
    }
  });

  return found;
}

export function hasExpandableCompoundChildren(children: ReactNode): boolean {
  let found = false;

  const walk = (node: ReactNode) => {
    if (found) return;
    for (const child of Children.toArray(node)) {
      if (!isValidElement(child)) continue;
      const name = readExpandablePartDisplayName(child.type);
      if (name != null && EXPANDABLE_COMPOUND_SLOT_DISPLAY_NAMES.has(name)) {
        found = true;
        return;
      }
      walk((child.props as { children?: ReactNode }).children);
    }
  };

  walk(children);
  return found;
}
