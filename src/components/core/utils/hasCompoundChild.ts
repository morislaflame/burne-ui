import { Children, isValidElement, type ReactNode } from "react";

function matchesCompoundType(type: unknown, matcher: unknown): boolean {
  if (type === matcher) return true;
  const displayName = (type as { displayName?: string })?.displayName;
  if (typeof matcher === "string") return displayName === matcher;
  const matcherName = (matcher as { displayName?: string })?.displayName;
  return matcherName != null && displayName === matcherName;
}

/** Whether compound children include an instance of one of the given types. */
export function hasCompoundChild(children: ReactNode, ...matchers: unknown[]): boolean {
  let found = false;

  const walk = (node: ReactNode) => {
    if (found) return;
    for (const child of Children.toArray(node)) {
      if (!isValidElement(child)) continue;
      if (matchers.some((matcher) => matchesCompoundType(child.type, matcher))) {
        found = true;
        return;
      }
      walk((child.props as { children?: ReactNode }).children);
    }
  };

  walk(children);
  return found;
}
