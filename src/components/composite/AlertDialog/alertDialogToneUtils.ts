import type { AlertStatus } from "@/components/core/Alert/alertUtils";
import type { ButtonStatus, ButtonVariant } from "@/components/core/Button";

/** Primary action button in the modal footer in the window tone. */
export function primaryButtonVariantForAlertTone(
  tone: AlertStatus,
): ButtonVariant {
  void tone;
  return "primary";
}

/** Status of the primary action button in the modal footer in the window tone. */
export function primaryButtonStatusForAlertTone(
  tone: AlertStatus,
): ButtonStatus {
  switch (tone) {
    case "danger":
    case "success":
    case "info":
    case "warning":
      return tone;
    default:
      return "default";
  }
}
