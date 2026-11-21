import type { ReactNode } from "react";

import { hasCompoundChild } from "./hasCompoundChild";

/**
 * `items` fills a part only when children do not already render it.
 * Overlap logs in development and the generated copy is skipped.
 */
export function itemsPartTaken(component: string, children: ReactNode, ...parts: string[]): boolean {
  if (!hasCompoundChild(children, ...parts)) return false;
  if (process.env.NODE_ENV !== "production") {
    console.error(
      `${component}: children already include ${parts.join(" / ")}. items fill only the parts children omit.`,
    );
  }
  return true;
}
