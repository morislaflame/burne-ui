import { isValidElement, type ReactNode } from "react";

import { DEFAULT_BURNE_LABELS, formatBurneLabel, type BurneLabels } from "@/theme/burneLabels";
 
import type { ToastLiveRole, ToastPlacement, ToastStatus } from "./toastTypes";
import { TOAST_LIVE_REGION_CLASS } from "./toastStyles";

export { TOAST_LIVE_REGION_CLASS };
 
export function resolveToastLiveRole(status: ToastStatus): ToastLiveRole {
  return status === "danger" || status === "warning" ? "alert" : "status";
}
 
export function toastViewportAriaLabel(
  placement: ToastPlacement,
  template: string = DEFAULT_BURNE_LABELS.toastNotifications,
): string {
  return formatBurneLabel(template, { placement });
}

function extractNodeText(node: unknown): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) {
    return node.map(extractNodeText).join("");
  }
  if (isValidElement<{ children?: ReactNode }>(node)) {
    return extractNodeText(node.props.children);
  }
  return "";
}
 
/** Plain-text announcement for the permanent aria-live region. */
export function toastAnnouncementText(
  title: unknown,
  description: unknown,
): string {
  const parts: string[] = [];
  const titleText = extractNodeText(title).replace(/\s+/g, " ").trim();
  const descText = extractNodeText(description).replace(/\s+/g, " ").trim();
  if (titleText) parts.push(titleText);
  if (descText) parts.push(descText);
  return parts.join(". ");
}
 
export function toastFallbackAriaLabel(
  title: unknown,
  description: unknown,
): string | undefined {
  const text = toastAnnouncementText(title, description);
  return text || undefined;
}
 
export type ToastViewportLabelSource = Pick<BurneLabels, "toastNotifications">;
 