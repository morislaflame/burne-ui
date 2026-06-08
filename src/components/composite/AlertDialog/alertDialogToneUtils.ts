import type { AlertStatus } from "@/components/core/Alert/alertUtils";
import type { ButtonVariant } from "@/components/core/Button";

/** Основная кнопка действия в футере модалки в тон окна. */
export function primaryButtonVariantForAlertTone(
  tone: AlertStatus,
): ButtonVariant {
  switch (tone) {
    case "danger":
      return "danger";
    case "success":
      return "success";
    case "info":
      return "info";
    case "warning":
      return "warning";
    default:
      return "default";
  }
}
