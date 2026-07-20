import { Children, isValidElement, useCallback, useState, type ReactNode } from "react";

export const TOGGLE_BUTTON_COMPOUND_SLOT_NAMES = new Set([
  "ToggleButtonContent",
  "ToggleButtonFill",
  "ToggleButtonLabel",
  "ToggleButtonIcon",
  "ToggleButtonTrailing",
  "ToggleButtonText",
]);

function walkToggleButtonChildren(
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

export function hasToggleButtonCompoundChildren(children: ReactNode): boolean {
  return walkToggleButtonChildren(
    children,
    (name) => name != null && TOGGLE_BUTTON_COMPOUND_SLOT_NAMES.has(name),
  );
}

export function toggleButtonHasCompoundPart(children: ReactNode, part: string): boolean {
  return walkToggleButtonChildren(children, (name) => name === part);
}

export function shouldWrapToggleButtonChildrenInText(children: ReactNode): boolean {
  if (children == null || children === false) return false;
  if (typeof children === "string" || typeof children === "number") return true;

  const nodes = Children.toArray(children).filter((node) => node != null);
  if (nodes.length !== 1) return false;

  const only = nodes[0];
  if (typeof only === "string" || typeof only === "number") return true;
  if (!isValidElement(only)) return false;

  const displayName = (only.type as { displayName?: string }).displayName;
  return displayName == null || !TOGGLE_BUTTON_COMPOUND_SLOT_NAMES.has(displayName);
}

export function useMergedPressed(
  pressed: boolean | undefined,
  defaultPressed: boolean | undefined,
): [boolean, (next: boolean) => void, boolean] {
  const isControlled = pressed !== undefined;
  const [internal, setInternal] = useState(Boolean(defaultPressed));
  const value = isControlled ? Boolean(pressed) : internal;
  const setValue = useCallback(
    (next: boolean) => {
      if (!isControlled) setInternal(next);
    },
    [isControlled],
  );
  return [value, setValue, isControlled];
}
