import type { HTMLAttributes, ReactNode } from "react";

import type { AlertStatus } from "@/components/core/Alert/alertUtils";
import type { CloseButtonProps } from "@/components/core/CloseButton";

import type { AlertDialogSizePreset } from "./alertDialogSizePresets";
import type { ButtonSize } from "@/components/core/Button";

export type AlertDialogSize = "small" | "base" | "mid" | "large";

export type AlertDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children?: ReactNode;
  className?: string;
  status?: AlertStatus;
  variant?: "default" | "gloss";
  size?: AlertDialogSize;
  /**
   * Anchor for inheriting the light theme from the wrapper (`data-theme`).
   * By default — `document.activeElement` at the moment of opening.
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
  footerButtonSize: ButtonSize;
};

export type AlertDialogHeaderProps = HTMLAttributes<HTMLDivElement> & {
  icon?: ReactNode | null;
  showClose?: boolean;
};

export type AlertDialogIndicatorProps = HTMLAttributes<HTMLSpanElement>;
export type AlertDialogTitleProps = HTMLAttributes<HTMLHeadingElement>;
export type AlertDialogDescriptionProps = HTMLAttributes<HTMLParagraphElement>;
export type AlertDialogBodyProps = HTMLAttributes<HTMLDivElement>;
export type AlertDialogFooterProps = HTMLAttributes<HTMLDivElement>;
export type AlertDialogCloseProps = CloseButtonProps;
