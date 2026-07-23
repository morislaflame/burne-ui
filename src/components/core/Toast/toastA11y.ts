import { DEFAULT_BURNE_LABELS, formatBurneLabel, type BurneLabels } from "@/theme/burneLabels";

import type { ToastLiveRole, ToastPlacement, ToastStatus } from "./toastTypes";

/** Visually hidden, always-mounted live region for toast announcements. */
export const TOAST_LIVE_REGION_CLASS =
  "sr-only absolute m-0 h-px w-px overflow-hidden whitespace-nowrap border-0 p-0";

export function resolveToastLiveRole(status: ToastStatus): ToastLiveRole {
  return status === "danger" || status === "warning" ? "alert" : "status";
}

export function toastViewportAriaLabel(
  placement: ToastPlacement,
  template: string = DEFAULT_BURNE_LABELS.toastNotifications,
): string {
  return formatBurneLabel(template, { placement });
}

/** Plain-text announcement for the permanent aria-live region. */
export function toastAnnouncementText(
  title: unknown,
  description: unknown,
): string {
  const parts: string[] = [];
  if (typeof title === "string" && title.trim()) parts.push(title.trim());
  else if (typeof title === "number") parts.push(String(title));
  if (typeof description === "string" && description.trim()) {
    parts.push(description.trim());
  } else if (typeof description === "number") {
    parts.push(String(description));
  }
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
