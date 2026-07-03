import { isValidElement, type ReactElement } from "react";

import type { BadgeInlineIconPosition } from "./badgeTypes";

export function readBadgeInlineIconPosition(el: ReactElement): BadgeInlineIconPosition | null {
  const raw = (el.props as { "data-icon"?: string })["data-icon"];
  if (raw === "inline-start" || raw === "start") return "inline-start";
  if (raw === "inline-end" || raw === "end") return "inline-end";
  return null;
}

export function isInlineIconChild(node: unknown): node is ReactElement {
  return isValidElement(node) && readBadgeInlineIconPosition(node) != null;
}
