import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import type { Prettify } from "@/utils/prettify";

import type { AlertStatus, AlertVariant } from "@/components/core/Alert/alertTypes";
import type { CloseButtonProps } from "@/components/core/CloseButton";
import type { ButtonSize } from "@/components/core/Button";
import type { MessageBannerGridSlots } from "@/components/core/utils/messageBannerGridLayout";
import type {
  PanelSize,
  PanelSizeLayout,
} from "@/components/core/utils/sizeLayout";

export type AlertDialogSize = PanelSize;

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

/** Size tokens from shared `PANEL_SIZE_LAYOUT` (AlertDialog slice). */
export type AlertDialogSizePreset = Pick<
  PanelSizeLayout,
  | "rounded"
  | "panelMax"
  | "maxHeight"
  | "headerPadding"
  | "bodyPadding"
  | "footerPadding"
  | "titleVariant"
  | "titleClassName"
  | "descVariant"
  | "descClassName"
  | "bodyVariant"
  | "iconClass"
  | "footerButtonSize"
  | "closeButtonSize"
> & {
  /** Alert header grid gap (`alertHeaderGap` in panel layout). */
  headerGap: string;
};

export type AlertDialogProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
  status?: AlertStatus;
  variant?: AlertVariant;
  size?: AlertDialogSize;
  /**
   * Whether Escape dismisses the dialog (APG: least destructive / Cancel).
   * Set `false` to keep Escape blocked (opt-in hard confirmations).
   * @default true
   */
  closeOnEscape?: boolean;
  /** DOM node for the portal. Default: `document.body`. */
  portalContainer?: HTMLElement | null;
  classNames?: Prettify<AlertDialogClassNames>;
};

export type AlertDialogClassNamesProviderProps = {
  classNames?: Prettify<AlertDialogClassNames>;
  children?: ReactNode;
};

export type AlertDialogPanelProps = {
  className?: string;
  /**
   * Anchor for inheriting the light theme from the wrapper (`data-theme`).
   * By default — `document.activeElement` at the moment of opening.
   */
  themeAnchor?: HTMLElement | null;
  /** Overrides Root `portalContainer`. Default: `document.body`. */
  portalContainer?: HTMLElement | null;
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
  hasTitle: boolean;
  setHasTitle: (v: boolean) => void;
  hasDescription: boolean;
  setHasDescription: (v: boolean) => void;
  onOpenChange: (open: boolean) => void;
  /** Escape dismisses when true (default). */
  closeOnEscape: boolean;
  variant: AlertVariant;
  status: AlertStatus;
  size: AlertDialogSize;
  sizePreset: AlertDialogSizePreset;
  footerButtonSize: ButtonSize;
  /** Portal mount node from Root; Panel may override via its own prop. */
  portalContainer?: HTMLElement | null;
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
  | "open"
  | "defaultOpen"
  | "onOpenChange"
  | "status"
  | "variant"
  | "size"
  | "closeOnEscape"
  | "portalContainer"
>;

export type UseAlertDialogModalMotionProps = {
  open: boolean;
  variant: AlertVariant;
  /** When true, open with `show()` + absolute positioning inside a custom portal host. */
  contained?: boolean;
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
  hasTitle: boolean;
  hasDescription: boolean;
  closeOnEscape: boolean;
  onOpenChange: (open: boolean) => void;
  dialogRef: React.RefObject<HTMLDialogElement | null>;
  overlayRef: React.RefObject<HTMLDivElement | null>;
  panelRef: React.RefObject<HTMLDivElement | null>;
  bindGlossPanelRef: (node: HTMLDivElement | null) => void;
  /** Custom portal host — use absolute positioning instead of fixed/top-layer. */
  contained?: boolean;
};
