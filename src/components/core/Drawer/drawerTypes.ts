import type { HTMLAttributes, ReactNode } from "react";

import type { CloseButtonProps } from "@/components/core/CloseButton";

export type DrawerPlacement = "left" | "right" | "top" | "bottom";
export type DrawerSize = "default" | "mid" | "full";
export type DrawerVariant = "default" | "gloss";

export type DrawerClassNames = {
  dialog?: string;
  overlay?: string;
  panel?: string;
  glossPanel?: string;
  glossContent?: string;
  content?: string;
  handle?: string;
  handleGrip?: string;
  header?: string;
  headingBlock?: string;
  title?: string;
  description?: string;
  body?: string;
  footer?: string;
  close?: string;
};

export type DrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children?: ReactNode;
  placement?: DrawerPlacement;
  size?: DrawerSize;
  variant?: DrawerVariant;
  className?: string;
  classNames?: DrawerClassNames;
  themeAnchor?: HTMLElement | null;
};

export type DrawerContextValue = {
  titleId: string;
  descriptionId: string;
  hasDescription: boolean;
  setHasDescription: (value: boolean) => void;
  onOpenChange: (open: boolean) => void;
  placement: DrawerPlacement;
  overlayRef: React.RefObject<HTMLDivElement | null>;
  panelRef: React.RefObject<HTMLDivElement | null>;
  skipCloseAnimRef: React.RefObject<boolean>;
};

export type DrawerClassNamesProviderProps = {
  classNames?: DrawerClassNames;
  children: ReactNode;
};

export type DrawerBackdropProps = HTMLAttributes<HTMLDivElement> & {
  /** Закрывать по клику вне панели. По умолчанию `true`. */
  isDismissable?: boolean;
};

export type DrawerHandleProps = HTMLAttributes<HTMLDivElement>;
export type DrawerHeaderProps = HTMLAttributes<HTMLDivElement>;
export type DrawerHeadingBlockProps = HTMLAttributes<HTMLDivElement>;
export type DrawerTitleProps = HTMLAttributes<HTMLHeadingElement>;
export type DrawerDescriptionProps = HTMLAttributes<HTMLParagraphElement>;
export type DrawerBodyProps = HTMLAttributes<HTMLDivElement>;
export type DrawerFooterProps = HTMLAttributes<HTMLDivElement>;
export type DrawerCloseProps = CloseButtonProps;
export type DrawerContentProps = HTMLAttributes<HTMLDivElement>;

export type DrawerPanelSegment =
  | { kind: "handle"; node: ReactNode }
  | { kind: "content"; children: ReactNode[] };

export type UseDrawerRootStateProps = Pick<
  DrawerProps,
  "open" | "onOpenChange" | "themeAnchor" | "children"
>;

export type UseDrawerModalMotionProps = Pick<
  DrawerProps,
  "open" | "onOpenChange" | "variant"
> & {
  placement: DrawerPlacement;
  backdropIsDismissable: boolean;
};

export type DrawerPortalShellProps = {
  className?: string;
  variant: DrawerVariant;
  placement: DrawerPlacement;
  size: DrawerSize;
  portalTheme: Record<string, string | undefined>;
  lightUi: boolean;
  titleId: string;
  descriptionId: string;
  hasDescription: boolean;
  backdropIsDismissable: boolean;
  panelSegments: DrawerPanelSegment[];
  dialogRef: React.RefObject<HTMLDialogElement | null>;
  overlayRef: React.RefObject<HTMLDivElement | null>;
  panelRef: React.RefObject<HTMLDivElement | null>;
  bindGlossPanelRef: (node: HTMLDivElement | null) => void;
  onBackdropMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
  onDialogClose: () => void;
};
