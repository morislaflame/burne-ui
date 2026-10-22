import { isValidElement, type ReactElement } from "react";
 
import type { IconPosition } from "@/components/core/utils/iconPosition";
 
export function readBadgeInlineIconPosition(el: ReactElement): IconPosition | null {
  const raw = (el.props as { "data-icon"?: string })["data-icon"];
  if (raw === "start") return "start";
  if (raw === "end") return "end";
  return null;
}
 
export function isInlineIconChild(node: unknown): node is ReactElement {
  return isValidElement(node) && readBadgeInlineIconPosition(node) != null;
}
 