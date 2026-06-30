import type { ToastLiveRole, ToastPlacement, ToastStatus } from "./toastTypes";

export const TOAST_CLOSE_ARIA_LABEL = "Закрыть";

export function resolveToastLiveRole(status: ToastStatus): ToastLiveRole {
  return status === "danger" || status === "warning" ? "alert" : "status";
}

export function toastViewportAriaLabel(placement: ToastPlacement): string {
  return `Уведомления (${placement})`;
}
