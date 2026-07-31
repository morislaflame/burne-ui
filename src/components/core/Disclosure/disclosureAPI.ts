import { Children, isValidElement, type ReactNode } from "react";

import type { DisclosureVariant } from "./disclosureTypes";

const DISCLOSURE_ICON_DISPLAY_NAMES = new Set(["DisclosureIcon"]);
const DISCLOSURE_CHEVRON_DISPLAY_NAMES = new Set(["DisclosureChevron"]);

export type ResolvedDisclosureTriggerBody = {
  icon: ReactNode | null;
  chevron: ReactNode | null;
  title: ReactNode;
  hasIconPart: boolean;
  hasChevronPart: boolean;
};

export function isFramedVariant(variant: DisclosureVariant): boolean {
  return variant === "outline" || variant === "secondary" || variant === "default";
}

export function readDisclosurePartDisplayName(type: unknown): string | undefined {
  return (type as { displayName?: string }).displayName;
}

export function resolveDisclosureTriggerBody(children: ReactNode): ResolvedDisclosureTriggerBody {
  const icons: ReactNode[] = [];
  const chevrons: ReactNode[] = [];
  const title: ReactNode[] = [];

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) {
      if (child != null && child !== false) title.push(child);
      return;
    }

    const name = readDisclosurePartDisplayName(child.type);
    if (name && DISCLOSURE_ICON_DISPLAY_NAMES.has(name)) {
      icons.push(child);
      return;
    }
    if (name && DISCLOSURE_CHEVRON_DISPLAY_NAMES.has(name)) {
      chevrons.push(child);
      return;
    }
    title.push(child);
  });

  return {
    icon: icons.length > 0 ? icons : null,
    chevron: chevrons.length > 0 ? chevrons : null,
    title: title.length > 0 ? title : null,
    hasIconPart: icons.length > 0,
    hasChevronPart: chevrons.length > 0,
  };
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
