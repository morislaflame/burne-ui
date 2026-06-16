import type { AlertStatus } from "@/components/core/Alert/alertUtils";
import type { ButtonStatus, ButtonVariant } from "@/components/core/Button";

/** Основная кнопка действия в футере модалки в тон окна. */
export function primaryButtonVariantForAlertTone(
  tone: AlertStatus,
): ButtonVariant {
  void tone;
  return "primary";
}

/** Статус primary-кнопки действия в футере модалки в тон окна. */
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
