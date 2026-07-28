import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import type { Prettify } from "@/utils/prettify";

import type { ButtonSize } from "@/components/core/Button";
import type { CloseButtonProps } from "@/components/core/CloseButton";
import type {
  PanelSize,
  PanelSizeLayout,
} from "@/components/core/utils/sizeLayout";

export type DialogVariant = "default" | "gloss";

export type DialogSize = PanelSize;

/** Size tokens from shared `PANEL_SIZE_LAYOUT` (Dialog slice). */
export type DialogSizePreset = Pick<
  PanelSizeLayout,
  | "rounded"
  | "panelMax"
  | "maxHeight"
  | "headerGap"
  | "headerPadding"
  | "bodyPadding"
  | "footerPadding"
  | "headingGap"
  | "titleVariant"
  | "titleClassName"
  | "descVariant"
  | "descClassName"
  | "bodyVariant"
  | "footerButtonSize"
  | "closeButtonSize"
>;

export type DialogClassNames = {
  trigger?: string;
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
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
  size?: DialogSize;
  /** DOM node for the portal. Default: `document.body`. */
  portalContainer?: HTMLElement | null;
  classNames?: Prettify<DialogClassNames>;
};

export type DialogPanelProps = HTMLAttributes<HTMLDivElement> & {
  variant?: DialogVariant;
  dismissOnBackdrop?: boolean;
  themeAnchor?: HTMLElement | null;
  /** Overrides Root `portalContainer`. Default: `document.body`. */
  portalContainer?: HTMLElement | null;
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
  hasTitle: boolean;
  setHasTitle: (value: boolean) => void;
  hasDescription: boolean;
  setHasDescription: (value: boolean) => void;
  onOpenChange: (open: boolean) => void;
  size: DialogSize;
  sizePreset: DialogSizePreset;
  footerButtonSize: ButtonSize;
  /** Portal mount node from Root; Panel may override via its own prop. */
  portalContainer?: HTMLElement | null;
};

export type DialogClassNamesProviderProps = {
  classNames?: Prettify<DialogClassNames>;
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
  "open" | "defaultOpen" | "onOpenChange" | "size" | "portalContainer"
>;

export type UseDialogModalMotionProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variant: DialogVariant;
  dismissOnBackdrop: boolean;
  /** When true, open with `show()` + absolute positioning inside a custom portal host. */
  contained?: boolean;
};

export type DialogPortalShellProps = {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  variant: DialogVariant;
  sizePreset: DialogSizePreset;
  portalTheme: Record<string, string | undefined>;
  lightUi: boolean;
  titleId: string;
  descriptionId: string;
  hasTitle: boolean;
  hasDescription: boolean;
  dialogRef: React.RefObject<HTMLDialogElement | null>;
  overlayRef: React.RefObject<HTMLDivElement | null>;
  panelRef: React.RefObject<HTMLDivElement | null>;
  panelForwardedRef?: React.ForwardedRef<HTMLDivElement>;
  panelRest?: Omit<
    HTMLAttributes<HTMLDivElement>,
    "className" | "style" | "children" | "ref"
  >;
  bindGlossPanelRef: (node: HTMLDivElement | null) => void;
  onBackdropMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
  onDialogClose: () => void;
  onDialogCancel: (e: React.SyntheticEvent<HTMLDialogElement>) => void;
  /** Custom portal host — use absolute positioning instead of fixed/top-layer. */
  contained?: boolean;
};

export type DialogTriggerInternalProps = {
  triggerRef: React.RefObject<HTMLElement | null>;
};
