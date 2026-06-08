import { Children, isValidElement, type ReactNode } from "react";

export function partitionSliderTrackChildren(children: ReactNode): {
  body: ReactNode | null;
  hasCompoundParts: boolean;
} {
  let hasCompoundParts = false;
  const parts: ReactNode[] = [];

  for (const child of Children.toArray(children)) {
    if (!isValidElement(child)) {
      parts.push(child);
      continue;
    }
    const name = (child.type as { displayName?: string }).displayName;
    if (
      name === "SliderRail" ||
      name === "SliderFill" ||
      name === "SliderThumb" ||
      name === "SliderIcon"
    ) {
      hasCompoundParts = true;
    }
    parts.push(child);
  }

  if (!hasCompoundParts) return { body: null, hasCompoundParts: false };
  return { body: parts, hasCompoundParts: true };
}
