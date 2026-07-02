import { Children, isValidElement, type ReactNode } from "react";

import type {
  ButtonAsyncLayerKind,
  ButtonAsyncState,
} from "./buttonTypes";

export const BUTTON_COMPOUND_SLOT_NAMES = new Set([
  "ButtonContent",
  "ButtonLabel",
  "ButtonIcon",
  "ButtonText",
  "ButtonLoader",
  "ButtonSuccess",
  "ButtonError",
]);

function walkButtonChildren(
  node: ReactNode,
  match: (displayName: string | undefined) => boolean,
): boolean {
  let found = false;

  const walk = (current: ReactNode) => {
    if (found) return;
    for (const child of Children.toArray(current)) {
      if (!isValidElement(child)) continue;
      const displayName = (child.type as { displayName?: string }).displayName;
      if (match(displayName)) {
        found = true;
        return;
      }
      walk((child.props as { children?: ReactNode }).children);
    }
  };

  walk(node);
  return found;
}

export function hasButtonCompoundChildren(children: ReactNode): boolean {
  return walkButtonChildren(
    children,
    (name) => name != null && BUTTON_COMPOUND_SLOT_NAMES.has(name),
  );
}

export function buttonHasCompoundPart(children: ReactNode, part: string): boolean {
  return walkButtonChildren(children, (name) => name === part);
}

export function shouldWrapButtonChildrenInText(children: ReactNode): boolean {
  if (children == null || children === false) return false;
  if (typeof children === "string" || typeof children === "number") return true;

  const nodes = Children.toArray(children).filter((node) => node != null);
  if (nodes.length !== 1) return false;

  const only = nodes[0];
  if (typeof only === "string" || typeof only === "number") return true;
  if (!isValidElement(only)) return false;

  const displayName = (only.type as { displayName?: string }).displayName;
  return displayName == null || !BUTTON_COMPOUND_SLOT_NAMES.has(displayName);
}

export function maxDistanceToCorners(px: number, py: number, w: number, h: number) {
  const corners: [number, number][] = [
    [0, 0],
    [w, 0],
    [0, h],
    [w, h],
  ];
  return Math.max(...corners.map(([cx, cy]) => Math.hypot(cx - px, cy - py)));
}

export function centerCoverDiameter(w: number, h: number) {
  return 2 * maxDistanceToCorners(w / 2, h / 2, w, h);
}

export function isButtonAsyncLayerActive(
  state: ButtonAsyncState,
  layer: ButtonAsyncLayerKind,
): boolean {
  switch (layer) {
    case "label":
      return state === "idle";
    case "loader":
      return state === "loading";
    case "success":
      return state === "success";
    case "error":
      return state === "error";
  }
}


