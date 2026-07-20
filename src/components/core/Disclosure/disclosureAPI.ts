import { Children, isValidElement, type ReactNode } from "react";

import type { DisclosureVariant } from "./disclosureTypes";

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
