import type { HTMLAttributes, ReactNode } from "react";

import type { AlertStatus } from "@/components/core/Alert/alertUtils";
import type { CloseButtonProps } from "@/components/core/CloseButton";

import type { AlertDialogSizePreset } from "./alertDialogSizePresets";
import type { ButtonSize } from "@/components/core/Button";

/** Ширина и типографика панели. */
export type AlertDialogSize = "small" | "base" | "mid" | "large";

export type AlertDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children?: ReactNode;
  className?: string;
  /** Как у `Alert`: default, outline, secondary, danger, success, info, warning. */
  status?: AlertStatus;
  /** Поверхность панели: `gloss` — стеклянная панель. */
  variant?: "default" | "gloss";
  /** По умолчанию `m`. */
  size?: AlertDialogSize;
  /**
   * Якорь для наследования светлой темы с обёртки (`data-theme`).
   * По умолчанию — `document.activeElement` в момент открытия.
   */
  themeAnchor?: HTMLElement | null;
};

export type AlertDialogContextValue = {
  titleId: string;
  descriptionId: string;
  hasDescription: boolean;
  setHasDescription: (v: boolean) => void;
  onOpenChange: (open: boolean) => void;
  tone: AlertStatus;
  size: AlertDialogSize;
  sizePreset: AlertDialogSizePreset;
  /** Размер кнопок по умолчанию в `AlertDialog.Footer` (см. `footerButtonSizeForAlertDialog`). */
  footerButtonSize: ButtonSize;
};

export type AlertDialogHeaderProps = HTMLAttributes<HTMLDivElement> & {
  /**
   * Для тона `default` иконки нет по умолчанию — передайте узел, если нужна.
   * Для остальных тонов по умолчанию показывается иконка тона; `null` — скрыть.
   */
  icon?: ReactNode | null;
  /** Кнопка закрытия справа в шапке. По умолчанию `true`. */
  showClose?: boolean;
};

export type AlertDialogIndicatorProps = HTMLAttributes<HTMLSpanElement>;
export type AlertDialogTitleProps = HTMLAttributes<HTMLHeadingElement>;
export type AlertDialogDescriptionProps = HTMLAttributes<HTMLParagraphElement>;
export type AlertDialogBodyProps = HTMLAttributes<HTMLDivElement>;
export type AlertDialogFooterProps = HTMLAttributes<HTMLDivElement>;
export type AlertDialogCloseProps = CloseButtonProps;
