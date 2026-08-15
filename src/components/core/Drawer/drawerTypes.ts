import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  KeyboardEventHandler,
  ReactNode,
} from "react";
import type { Prettify } from "@/utils/prettify";

import type { ButtonSize } from "@/components/core/Button";
import type { CloseButtonProps } from "@/components/core/CloseButton";
import type {
  PanelSize,
  PanelSizeLayout,
} from "@/components/core/utils/sizeLayout";
import type { MotionValue } from "@/components/core/utils/slotMotion";

export type DrawerPlacement = "left" | "right" | "top" | "bottom";
/** Viewport extent of the panel (orthogonal to chrome `size`). */
export type DrawerExtent = "default" | "mid" | "full";
export type DrawerVariant = "default" | "gloss";
export type DrawerSize = PanelSize;

/** Chrome tokens from shared `PANEL_SIZE_LAYOUT` (Drawer slice). */
export type DrawerSizePreset = Pick<
  PanelSizeLayout,
  | "rounded"
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

export type DrawerClassNames = {
  trigger?: string;
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

export type DrawerLifecycleMotion = {
  enter?: MotionValue;
  leave?: MotionValue;
};

export type DrawerPartMotion = DrawerLifecycleMotion & {
  hoverIn?: MotionValue;
  hoverOut?: MotionValue;
};

export type DrawerMotion = {
  overlay?: DrawerLifecycleMotion;
  panel?: DrawerLifecycleMotion;
  title?: DrawerPartMotion;
  description?: DrawerPartMotion;
  close?: DrawerLifecycleMotion;
  header?: DrawerLifecycleMotion;
  footer?: DrawerLifecycleMotion;
  content?: DrawerLifecycleMotion;
  handle?: DrawerLifecycleMotion;
};

export type DrawerProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Slide direction (structural, used in context). */
  placement?: DrawerPlacement;
  /** Chrome density — padding, type, close/footer button sizes (`PANEL_SIZE_LAYOUT`). */
  size?: DrawerSize;
  children?: ReactNode;
  /** DOM node for the portal. Default: `document.body`. */
  portalContainer?: HTMLElement | null;
  classNames?: Prettify<DrawerClassNames>;
  /** Per-slot enter/leave. Overlay/panel defaults are kit overlay + drawer slide recipes. */
  motion?: Prettify<DrawerMotion>;
};

export type DrawerPanelProps = HTMLAttributes<HTMLDivElement> & {
  extent?: DrawerExtent;
  variant?: DrawerVariant;
  themeAnchor?: HTMLElement | null;
  /** Overrides Root `portalContainer`. Default: `document.body`. */
  portalContainer?: HTMLElement | null;
  motion?: Prettify<DrawerMotion>;
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
  hasTitle: boolean;
  setHasTitle: (value: boolean) => void;
  hasDescription: boolean;
  setHasDescription: (value: boolean) => void;
  onOpenChange: (open: boolean) => void;
  placement: DrawerPlacement;
  size: DrawerSize;
  sizePreset: DrawerSizePreset;
  footerButtonSize: ButtonSize;
  overlayRef: React.RefObject<HTMLDivElement | null>;
  panelRef: React.RefObject<HTMLDivElement | null>;
  skipCloseAnimRef: React.RefObject<boolean>;
  /** Portal mount node from Root; Panel may override via its own prop. */
  portalContainer?: HTMLElement | null;
};

export type DrawerClassNamesProviderProps = {
  classNames?: Prettify<DrawerClassNames>;
  children: ReactNode;
};

export type DrawerBackdropProps = HTMLAttributes<HTMLDivElement> & {
  /** Close on click outside panel. Default `true`. */
  isDismissable?: boolean;
};

export type DrawerHandleProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "onKeyDown"
> & {
  /** Keyboard activate on the grip thumb (`role="button"`). */
  onKeyDown?: KeyboardEventHandler<HTMLElement>;
  motion?: Prettify<DrawerLifecycleMotion>;
};
export type DrawerHeaderProps = HTMLAttributes<HTMLDivElement> & {
  motion?: Prettify<DrawerLifecycleMotion>;
};
export type DrawerHeadingBlockProps = HTMLAttributes<HTMLDivElement>;
export type DrawerTitleProps = HTMLAttributes<HTMLHeadingElement> & {
  motion?: Prettify<DrawerPartMotion>;
};
export type DrawerDescriptionProps = HTMLAttributes<HTMLParagraphElement> & {
  motion?: Prettify<DrawerPartMotion>;
};
export type DrawerBodyProps = HTMLAttributes<HTMLDivElement>;
export type DrawerFooterProps = HTMLAttributes<HTMLDivElement> & {
  motion?: Prettify<DrawerLifecycleMotion>;
};
export type DrawerCloseProps = CloseButtonProps & {
  motion?: Prettify<DrawerLifecycleMotion>;
};
export type DrawerContentProps = HTMLAttributes<HTMLDivElement> & {
  motion?: Prettify<DrawerLifecycleMotion>;
};

export type DrawerPanelSegment =
  | { kind: "handle"; node: ReactNode }
  | { kind: "content"; children: ReactNode[] };

export type UseDrawerRootStateProps = Pick<
  DrawerProps,
  "open" | "defaultOpen" | "onOpenChange" | "size" | "portalContainer"
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
  /** When true, open with `show()` + absolute positioning inside a custom portal host. */
  contained?: boolean;
};

export type DrawerPortalShellProps = {
  className?: string;
  style?: React.CSSProperties;
  variant: DrawerVariant;
  placement: DrawerPlacement;
  extent: DrawerExtent;
  portalTheme: Record<string, string | undefined>;
  lightUi: boolean;
  titleId: string;
  descriptionId: string;
  hasTitle: boolean;
  hasDescription: boolean;
  backdropIsDismissable: boolean;
  panelSegments: DrawerPanelSegment[];
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

export type DrawerTriggerInternalProps = {
  triggerRef: React.RefObject<HTMLElement | null>;
};
