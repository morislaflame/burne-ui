import type { AlertStatus } from "@/components/core/Alert/alertTypes";
import type { ButtonStatus, ButtonVariant } from "@/components/core/Button";

/** Primary action button in the modal footer in the window tone. */
export function primaryButtonVariantForAlertTone(
  status: AlertStatus,
): ButtonVariant {
  void status;
  return "primary";
}

/** Status of the primary action button in the modal footer in the window tone. */
export function primaryButtonStatusForAlertTone(
  status: AlertStatus,
): ButtonStatus {
  switch (status) {
    case "danger":
    case "success":
    case "info":
    case "warning":
      return status;
    default:
      return "default";
  }
}
