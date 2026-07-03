import { Children, isValidElement, type ReactNode } from "react";

/** Whether root has meaningful compound children (not just text/whitespace). */
export function hasCompoundChildren(children: ReactNode): boolean {
  return Children.toArray(children).some((child) => isValidElement(child));
}
