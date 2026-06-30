import type { HTMLAttributes, ReactNode } from "react";

import type { CloseButtonProps } from "@/components/core/CloseButton";

export type DialogVariant = "default" | "gloss";

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
  className?: string;
  classNames?: DialogClassNames;
  variant?: DialogVariant;
  dismissOnBackdrop?: boolean;
  themeAnchor?: HTMLElement | null;
};

export type DialogContextValue = {
  titleId: string;
  descriptionId: string;
  hasDescription: boolean;
  setHasDescription: (value: boolean) => void;
  onOpenChange: (open: boolean) => void;
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

export type UseDialogRootStateProps = Pick<
  DialogProps,
  "open" | "onOpenChange" | "themeAnchor"
>;

export type UseDialogModalMotionProps = Pick<
  DialogProps,
  "open" | "onOpenChange" | "variant" | "dismissOnBackdrop"
>;

export type DialogPortalShellProps = {
  children: ReactNode;
  className?: string;
  variant: DialogVariant;
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
