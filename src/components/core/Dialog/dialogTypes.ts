import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";

import type { ButtonSize } from "@/components/core/Button";
import type { CloseButtonProps } from "@/components/core/CloseButton";
import type { TextVariant } from "@/components/core/Text";

export type DialogVariant = "default" | "gloss";

export type DialogSize = "small" | "base" | "mid" | "large";

export type DialogSizePreset = {
  panelMax: string;
  maxHeight: string;
  headerGap: string;
  headerPadding: string;
  bodyPadding: string;
  footerPadding: string;
  headingBlockGap: string;
  titleVariant: TextVariant;
  descVariant: TextVariant;
  descClassName: string;
  bodyVariant: TextVariant;
};

export type DialogClassNames = {
  dialog?: string;
  overlay?: string;
  panel?: string;
  glossPanel?: string;
  content?: string;
  glossContent?: string;
  header?: string;
  headingBlock?: string;
  title?: string;
  description?: string;
  body?: string;
  footer?: string;
  close?: string;
};

export type DialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children?: ReactNode;
  size?: DialogSize;
  classNames?: DialogClassNames;
};

export type DialogPanelProps = {
  variant?: DialogVariant;
  dismissOnBackdrop?: boolean;
  className?: string;
  themeAnchor?: HTMLElement | null;
  children?: ReactNode;
};

export type DialogTriggerProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Render trigger as a child element (the child receives all trigger props). */
  asChild?: boolean;
  children?: ReactNode;
};

export type DialogContextValue = {
  /** Whether the dialog is currently open. */
  open: boolean;
  titleId: string;
  descriptionId: string;
  hasDescription: boolean;
  setHasDescription: (value: boolean) => void;
  onOpenChange: (open: boolean) => void;
  size: DialogSize;
  sizePreset: DialogSizePreset;
  footerButtonSize: ButtonSize;
};

export type DialogClassNamesProviderProps = {
  classNames?: DialogClassNames;
  children: ReactNode;
};

export type DialogHeaderProps = HTMLAttributes<HTMLDivElement>;
export type DialogTitleProps = HTMLAttributes<HTMLHeadingElement>;
export type DialogDescriptionProps = HTMLAttributes<HTMLParagraphElement>;
export type DialogBodyProps = HTMLAttributes<HTMLDivElement>;
export type DialogFooterProps = HTMLAttributes<HTMLDivElement>;
export type DialogCloseProps = CloseButtonProps;
export type DialogContentProps = HTMLAttributes<HTMLDivElement>;
export type DialogHeadingBlockProps = HTMLAttributes<HTMLDivElement>;

export type UseDialogRootStateProps = Pick<DialogProps, "open" | "onOpenChange" | "size">;

export type UseDialogModalMotionProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variant: DialogVariant;
  dismissOnBackdrop: boolean;
};

export type DialogPortalShellProps = {
  children: ReactNode;
  className?: string;
  variant: DialogVariant;
  sizePreset: DialogSizePreset;
  portalTheme: Record<string, string | undefined>;
  lightUi: boolean;
  titleId: string;
  descriptionId: string;
  hasDescription: boolean;
  dialogRef: React.RefObject<HTMLDialogElement | null>;
  overlayRef: React.RefObject<HTMLDivElement | null>;
  panelRef: React.RefObject<HTMLDivElement | null>;
  bindGlossPanelRef: (node: HTMLDivElement | null) => void;
  onBackdropMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
  onDialogClose: () => void;
};

export type DialogTriggerInternalProps = {
  triggerRef: React.RefObject<HTMLElement | null>;
};
