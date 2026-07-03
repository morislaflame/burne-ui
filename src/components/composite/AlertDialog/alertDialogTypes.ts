import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";

import type { AlertStatus, AlertVariant } from "@/components/core/Alert/alertTypes";
import type { CloseButtonProps } from "@/components/core/CloseButton";
import type { ButtonSize } from "@/components/core/Button";
import type { TextVariant } from "@/components/core/Text";
import type { MessageBannerGridSlots } from "@/components/core/utils/messageBannerGridLayout";

export type AlertDialogSize = "small" | "base" | "mid" | "large";

export type AlertDialogClassNames = {
  dialog?: string;
  overlay?: string;
  panel?: string;
  glossPanel?: string;
  glossContent?: string;
  content?: string;
  trigger?: string;
  header?: string;
  indicator?: string;
  headingBlock?: string;
  title?: string;
  description?: string;
  body?: string;
  footer?: string;
  close?: string;
};

export type AlertDialogSizePreset = {
  panelMax: string;
  maxHeight: string;
  headerGap: string;
  headerPadding: string;
  bodyPadding: string;
  footerPadding: string;
  headingBlockGap: string;
  iconClass: string;
  titleVariant: TextVariant;
  descVariant: TextVariant;
  descClassName: string;
  bodyVariant: TextVariant;
};

export type AlertDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children?: ReactNode;
  status?: AlertStatus;
  variant?: AlertVariant;
  size?: AlertDialogSize;
  classNames?: AlertDialogClassNames;
};

export type AlertDialogClassNamesProviderProps = {
  classNames?: AlertDialogClassNames;
  children?: ReactNode;
};

export type AlertDialogPanelProps = {
  className?: string;
  /**
   * Anchor for inheriting the light theme from the wrapper (`data-theme`).
   * By default — `document.activeElement` at the moment of opening.
   */
  themeAnchor?: HTMLElement | null;
  children?: ReactNode;
};

export type AlertDialogTriggerProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Render trigger as a child element (the child receives all trigger props). */
  asChild?: boolean;
  children?: ReactNode;
};

export type AlertDialogContextValue = {
  /** Whether the alert dialog is currently open. */
  open: boolean;
  titleId: string;
  descriptionId: string;
  hasDescription: boolean;
  setHasDescription: (v: boolean) => void;
  onOpenChange: (open: boolean) => void;
  variant: AlertVariant;
  status: AlertStatus;
  size: AlertDialogSize;
  sizePreset: AlertDialogSizePreset;
  footerButtonSize: ButtonSize;
};

export type AlertDialogHeaderContextValue = {
  variant: AlertVariant;
  status: AlertStatus;
  sizePreset: AlertDialogSizePreset;
  gridSlots: MessageBannerGridSlots;
  headerIcon?: ReactNode | null;
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
export type AlertDialogContentProps = HTMLAttributes<HTMLDivElement>;
export type AlertDialogHeadingBlockProps = HTMLAttributes<HTMLDivElement>;

export type UseAlertDialogRootStateProps = Pick<
  AlertDialogProps,
  "open" | "onOpenChange" | "status" | "variant" | "size"
>;

export type UseAlertDialogModalMotionProps = {
  open: boolean;
  variant: AlertVariant;
};

export type AlertDialogPortalShellProps = {
  children: ReactNode;
  className?: string;
  variant: AlertVariant;
  sizePreset: AlertDialogSizePreset;
  portalTheme: Record<string, string | undefined>;
  lightUi: boolean;
  titleId: string;
  descriptionId: string;
  hasDescription: boolean;
  dialogRef: React.RefObject<HTMLDialogElement | null>;
  overlayRef: React.RefObject<HTMLDivElement | null>;
  panelRef: React.RefObject<HTMLDivElement | null>;
  bindGlossPanelRef: (node: HTMLDivElement | null) => void;
};
