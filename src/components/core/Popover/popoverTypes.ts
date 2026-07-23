import type { FieldHintProps } from "@/components/core/Field";
import type { TextVariant } from "@/components/core/Text";
import type {
  FloatingAlign,
  TooltipSide,
} from "@/components/core/Tooltip/tooltipPosition";
import type { HTMLAttributes, ReactNode, RefObject } from "react";

export type PopoverSide = TooltipSide;
export type PopoverSize = "small" | "base" | "mid" | "large";
export type PopoverVariant = "default" | "gloss";
export type PopoverContentGap = "small" | "base" | "mid" | "large";

export type PopoverClassNames = {
  root?: string;
  trigger?: string;
  content?: string;
  /** Inner wrapper between content portal and panel (`relative overflow-visible`). */
  panelRelative?: string;
  panel?: string;
  glossPanel?: string;
  glossContent?: string;
  arrow?: string;
  header?: string;
  label?: string;
  hint?: string;
  body?: string;
};

export type PopoverContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  popoverId: string;
  labelId: string;
  hintId: string;
  size: PopoverSize;
  variant: PopoverVariant;
  side: PopoverSide;
  labelConnected: boolean;
  hintConnected: boolean;
  triggerRef: RefObject<HTMLElement | null>;
  anchorRef?: RefObject<HTMLElement | null>;
  contentRef: RefObject<HTMLDivElement | null>;
  /** Portal mount node from Root; Content may override via its own prop. */
  portalContainer?: HTMLElement | null;
};

export type PopoverProps = {
  children?: ReactNode;
  size?: PopoverSize;
  variant?: PopoverVariant;
  side?: PopoverSide;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  anchorRef?: RefObject<HTMLElement | null>;
  shouldDismiss?: (target: Node) => boolean;
  /** DOM node for the portal. Default: `document.body`. */
  portalContainer?: HTMLElement | null;
  classNames?: PopoverClassNames;
};

export type PopoverClassNamesProviderProps = {
  classNames?: PopoverClassNames;
  children: ReactNode;
};

export type UsePopoverRootStateProps = Omit<PopoverProps, "classNames">;

export type PopoverTriggerProps = HTMLAttributes<HTMLButtonElement> & {
  /** Merge props onto the single child (Button, etc.) instead of rendering a `<button>` wrapper. */
  asChild?: boolean;
};

export type PopoverArrowProps = HTMLAttributes<HTMLSpanElement>;

export type PopoverHeaderProps = HTMLAttributes<HTMLDivElement>;

export type PopoverTitleProps = HTMLAttributes<HTMLHeadingElement>;

export type PopoverDescriptionProps = Omit<FieldHintProps, "id" | "as">;

export type PopoverBodyProps = HTMLAttributes<HTMLDivElement>;

export type PopoverContentProps = HTMLAttributes<HTMLDivElement> & {
  showArrow?: boolean;
  offset?: number;
  gap?: PopoverContentGap;
  matchAnchorWidth?: boolean;
  align?: FloatingAlign;
  unstyled?: boolean;
  contentRole?: "dialog" | undefined;
  /** Overrides Root `portalContainer`. Default: `document.body`. */
  portalContainer?: HTMLElement | null;
};

export type PopoverTitleVariantMap = Record<PopoverSize, TextVariant>;

export type PopoverDescriptionVariantMap = Record<PopoverSize, TextVariant>;

export type UsePopoverContentLifecycleProps = {
  open: boolean;
  side: PopoverSide;
  offset: number;
  align: FloatingAlign;
  matchAnchorWidth: boolean;
  showArrow: boolean;
  isGloss: boolean;
  forwardedRef: React.ForwardedRef<HTMLDivElement>;
  contentRef: RefObject<HTMLDivElement | null>;
  triggerRef: RefObject<HTMLElement | null>;
  anchorRef?: RefObject<HTMLElement | null>;
  portalContainer?: HTMLElement | null;
};
