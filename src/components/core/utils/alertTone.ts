import type { IconType } from "react-icons";
import {
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
  IoHelpCircleOutline,
  IoInformationCircleOutline,
  IoWarning,
} from "react-icons/io5";

import type { ButtonVariant } from "../Button/Button";

export type AlertVariant =
  | "default"
  | "outline"
  | "danger"
  | "success"
  | "info";

export type AlertStatus = AlertVariant | "warning";

export function resolveAlertStatus(
  status?: AlertStatus,
  variant?: AlertVariant,
): AlertStatus {
  return status ?? variant ?? "default";
}

/**
 * Компактный Alert: фон по семантике типа (тинты surface).
 * default — плотный surface; outline — матовое стекло с размытием.
 */
const ALERT_INLINE_OUTLINE =
  "border border-b-border shadow-none bg-b-surface/65 text-b-text backdrop-blur-[14px] backdrop-saturate-150 motion-reduce:bg-b-surface motion-reduce:backdrop-blur-none";

/** Классы корня `Alert` (не модалки). */
export const ALERT_INLINE_SURFACE_CLASSES: Record<AlertStatus, string> = {
  default:
    "border border-b-border bg-b-surface text-b-text shadow-sm",
  outline: ALERT_INLINE_OUTLINE,
  danger: "bg-b-surface-tint-danger text-b-text",
  success: "bg-b-surface-tint-success text-b-text",
  info: "bg-b-surface-tint-info text-b-text",
  warning: "bg-b-surface-tint-warning text-b-text",
};

/** Панель AlertDialog: один нейтральный фон для всех тонов; outline — размытие. */
const ALERT_DIALOG_SHELL_FILLED =
  "bg-b-surface text-b-text border border-b-border shadow-sm";
const ALERT_DIALOG_SHELL_OUTLINE = ALERT_INLINE_OUTLINE;

export function alertDialogPanelToneClass(tone: AlertStatus): string {
  if (tone === "outline") {
    return ALERT_DIALOG_SHELL_OUTLINE;
  }
  return ALERT_DIALOG_SHELL_FILLED.replace("shadow-sm", "shadow-lg");
}

/** Показывать ли встроенную иконку тона, если слот не переопределён. */
export function alertToneShowsDefaultIcon(tone: AlertStatus): boolean {
  return tone !== "default";
}

export const ALERT_TONE_ICONS: Record<AlertStatus, IconType> = {
  default: IoInformationCircleOutline,
  outline: IoHelpCircleOutline,
  danger: IoCloseCircleOutline,
  success: IoCheckmarkCircleOutline,
  info: IoInformationCircleOutline,
  warning: IoWarning,
};

export function alertToneIconTextClass(tone: AlertStatus): string {
  return tone === "danger"
    ? "text-b-danger"
    : tone === "success"
      ? "text-b-success"
      : tone === "info"
        ? "text-b-info"
        : tone === "warning"
          ? "text-b-warning"
          : "text-b-accent";
}

/** Основная кнопка действия в футере модалки / алерта в тон окна. */
export function primaryButtonVariantForAlertTone(tone: AlertStatus): ButtonVariant {
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
