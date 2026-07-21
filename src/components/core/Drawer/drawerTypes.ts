import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";

import type { CloseButtonProps } from "@/components/core/CloseButton";

export type DrawerPlacement = "left" | "right" | "top" | "bottom";
export type DrawerExtent = "default" | "mid" | "full";
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
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Slide direction (structural, used in context). */
  placement?: DrawerPlacement;
  children?: ReactNode;
  classNames?: DrawerClassNames;
};

export type DrawerPanelProps = {
  extent?: DrawerExtent;
  variant?: DrawerVariant;
  className?: string;
  themeAnchor?: HTMLElement | null;
  children?: ReactNode;
};

export type DrawerTriggerProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Render trigger as a child element (the child receives all trigger props). */
  asChild?: boolean;
  children?: ReactNode;
};

export type DrawerContextValue = {
  /** Whether the drawer is currently open. */
  open: boolean;
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
  /** Close on click outside panel. Default `true`. */
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
  "open" | "defaultOpen" | "onOpenChange"
>;

export type UseDrawerPanelStateProps = {
  open: boolean;
  themeAnchor: HTMLElement | null | undefined;
  children: ReactNode | undefined;
};

export type UseDrawerModalMotionProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variant: DrawerVariant;
  placement: DrawerPlacement;
  backdropIsDismissable: boolean;
};

export type DrawerPortalShellProps = {
  className?: string;
  variant: DrawerVariant;
  placement: DrawerPlacement;
  extent: DrawerExtent;
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
  onDialogCancel: (e: React.SyntheticEvent<HTMLDialogElement>) => void;
};

export type DrawerTriggerInternalProps = {
  triggerRef: React.RefObject<HTMLElement | null>;
};
