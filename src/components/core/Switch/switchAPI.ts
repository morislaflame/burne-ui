import {
  Children,
  cloneElement,
  isValidElement,
  useCallback,
  useState,
  type ReactNode,
} from "react";

export function useMergedChecked(
  checked: boolean | undefined,
  defaultChecked: boolean | undefined,
): [boolean, (next: boolean) => void, boolean] {
  const isControlled = checked !== undefined;
  const [internal, setInternal] = useState(Boolean(defaultChecked));
  const value = isControlled ? Boolean(checked) : internal;
  const setValue = useCallback(
    (next: boolean) => {
      if (!isControlled) setInternal(next);
    },
    [isControlled],
  );
  return [value, setValue, isControlled];
}

export function compoundUsesInlineMotion(className: string | undefined): boolean {
  return !/\bflex-col\b/.test(className ?? "");
}

export function injectSwitchControlProps(
  children: ReactNode,
  controlProps: Record<string, unknown>,
): ReactNode {
  return Children.map(children, (child) => {
    if (!isValidElement(child)) return child;
    const name = (child.type as { displayName?: string }).displayName;
    if (name === "SwitchControl") {
      return cloneElement(child, {
        ...controlProps,
        ...(child.props as object),
      });
    }
    return child;
  });
}

export function compoundHasLabel(children: ReactNode): boolean {
  let found = false;

  const walk = (node: ReactNode) => {
    if (found) return;
    for (const child of Children.toArray(node)) {
      if (!isValidElement(child)) continue;
      const name = (child.type as { displayName?: string }).displayName;
      if (name === "SwitchLabel" || name === "SwitchContent") {
        found = true;
        return;
      }
      walk((child.props as { children?: ReactNode }).children);
    }
  };

  walk(children);
  return found;
}

export function countSecondaryLines(
  isCompound: boolean,
  hasHint: boolean,
  hasError: boolean,
  hasCompoundHint: boolean,
  hasCompoundError: boolean,
): number {
  if (isCompound) {
    return (hasCompoundHint ? 1 : 0) + (hasCompoundError ? 1 : 0);
  }
  return (hasHint ? 1 : 0) + (hasError ? 1 : 0);
}

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
