import { Children, isValidElement, type ReactNode } from "react";

import { FIELD_LEGEND_DISPLAY_NAMES } from "./fieldA11y";
import type { UseFieldSetRootStateResult } from "./fieldTypes";

export function readFieldPartDisplayName(type: unknown): string | undefined {
  return (type as { displayName?: string }).displayName;
}

function childDisplayName(child: ReactNode): string | undefined {
  if (!isValidElement(child)) return undefined;
  return readFieldPartDisplayName(child.type);
}

function isLegendChild(child: ReactNode): boolean {
  if (!isValidElement(child)) return false;
  if (child.type === "legend") return true;
  const displayName = childDisplayName(child);
  return displayName != null && FIELD_LEGEND_DISPLAY_NAMES.has(displayName);
}

function isGroupChild(child: ReactNode): boolean {
  return childDisplayName(child) === "FieldSetGroup";
}

function isActionsChild(child: ReactNode): boolean {
  return childDisplayName(child) === "FieldSetActions";
}

export function splitFieldSetChildren(children: ReactNode): {
  legend: ReactNode;
  body: ReactNode[];
} {
  const nodes = Children.toArray(children);
  const legendIndex = nodes.findIndex(isLegendChild);

  if (legendIndex === -1) {
    return { legend: null, body: nodes };
  }

  return {
    legend: nodes[legendIndex],
    body: [...nodes.slice(0, legendIndex), ...nodes.slice(legendIndex + 1)],
  };
}

export function partitionFieldSetBody(body: ReactNode[]): Omit<
  UseFieldSetRootStateResult,
  "legend"
> {
  const loose: ReactNode[] = [];
  const groups: ReactNode[] = [];
  let actions: ReactNode | null = null;

  for (const node of body) {
    if (isActionsChild(node)) {
      actions = node;
    } else if (isGroupChild(node)) {
      groups.push(node);
    } else {
      loose.push(node);
    }
  }

  return { loose, groups, actions };
}
