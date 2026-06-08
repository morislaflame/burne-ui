import { Children, isValidElement, type ReactNode } from "react";

export function partitionSwitchControlChildren(children: ReactNode): {
  track: ReactNode | null;
  content: ReactNode;
} {
  let track: ReactNode | null = null;
  const rest: ReactNode[] = [];

  for (const child of Children.toArray(children)) {
    if (
      isValidElement(child) &&
      (child.type as { displayName?: string }).displayName === "SwitchTrack"
    ) {
      if (track == null) track = child;
      continue;
    }
    rest.push(child);
  }

  if (rest.length === 0) return { track, content: null };
  if (rest.length === 1) return { track, content: rest[0]! };
  return { track, content: rest };
}

export function hasSwitchThumbChild(children: ReactNode): boolean {
  let found = false;
  const walk = (node: ReactNode) => {
    if (found) return;
    for (const child of Children.toArray(node)) {
      if (!isValidElement(child)) continue;
      const name = (child.type as { displayName?: string }).displayName;
      if (name === "SwitchThumb") {
        found = true;
        return;
      }
      walk((child.props as { children?: ReactNode }).children);
    }
  };
  walk(children);
  return found;
}
