import type { ClassValue } from "clsx";
import { Children, isValidElement, type RefObject, type ReactNode, type Ref } from "react";

import { cn } from "@/utils/cn";

import type { DisclosureVariant } from "./disclosureTypes";

export function mergeDisclosureSlotClass(...parts: ClassValue[]): string {
  return cn(...parts);
}

export function mergeRefs<T>(...refs: Array<Ref<T> | undefined>) {
  return (node: T | null) => {
    for (const r of refs) {
      if (r == null) continue;
      if (typeof r === "function") r(node);
      else (r as RefObject<T | null>).current = node;
    }
  };
}

export function isFramedVariant(variant: DisclosureVariant): boolean {
  return variant === "outline" || variant === "secondary" || variant === "default";
}

export function readDisclosurePartDisplayName(type: unknown): string | undefined {
  return (type as { displayName?: string }).displayName;
}

export function orderDragHandleChildren(children: ReactNode): ReactNode[] {
  const trigger: ReactNode[] = [];
  const content: ReactNode[] = [];
  const handle: ReactNode[] = [];
  const other: ReactNode[] = [];

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) {
      other.push(child);
      return;
    }
    const name = readDisclosurePartDisplayName(child.type);
    if (name === "DisclosureTrigger") trigger.push(child);
    else if (name === "DisclosureContent") content.push(child);
    else if (name === "DisclosureHandle") handle.push(child);
    else other.push(child);
  });

  return [...trigger, ...content, ...handle, ...other];
}
