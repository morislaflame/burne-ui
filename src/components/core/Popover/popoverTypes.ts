import type { FieldHintProps } from "@/components/core/Field";
import type {
  FloatingAlign,
  TooltipSide,
} from "@/components/core/Tooltip/tooltipPosition";
import type { PanelSize } from "@/components/core/utils/sizeLayout";
import type { MotionController, MotionMapWithEvents, MotionValue, MotionStateHostProps } from "@/components/core/utils/slotMotion";
import type { HTMLAttributes, ReactNode, RefObject } from "react";
import type { Prettify } from "@/utils/prettify";

export type PopoverSide = TooltipSide;
export type PopoverSize = PanelSize;
export type PopoverVariant = "default" | "gloss";
export type PopoverContentGap = PanelSize;

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

export type PopoverLifecycleMotion = {
  enter?: MotionValue;
  leave?: MotionValue;
};

export type PopoverPartMotion = PopoverLifecycleMotion & {
  hoverIn?: MotionValue;
  hoverOut?: MotionValue;
  pressIn?: MotionValue;
  pressOut?: MotionValue;
};

export type PopoverMotion = {
  content?: PopoverPartMotion;
  header?: PopoverLifecycleMotion;
  title?: PopoverPartMotion;
  description?: PopoverPartMotion;
  body?: PopoverLifecycleMotion;
  /** Repeated menu rows when Popover hosts Dropdown (or similar). */
  item?: PopoverLifecycleMotion;
  itemLabel?: PopoverPartMotion;
  itemHint?: PopoverPartMotion;
  itemIcon?: PopoverPartMotion;
  /** Dropdown.Label / Dropdown.SubTrigger / Dropdown.Separator when Popover hosts the menu. */
  label?: PopoverPartMotion;
  subTrigger?: PopoverPartMotion;
  separator?: PopoverPartMotion;
  arrow?: PopoverPartMotion;
  /** Open squeeze on `Popover.Trigger` (Root scope — outside Content). */
  trigger?: PopoverPartMotion;
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
  classNames?: Prettify<PopoverClassNames>;
  /**
   * Per-slot motion (`content`, `header`, `title`, `description`, `body`, `arrow`, `trigger`, plus Dropdown pass-through).
   * Root has no portal DOM — the host is `Popover.Content`. Trigger lives on Root.
   * Default: `content.enter/leave` → `portalSurfaceEnter` / `portalSurfaceLeave`; `trigger.pressIn` → `pressSqueeze`.
   * `events` — namespaced app commands for `MotionController.play` (not a DOM slot).
   */
  motion?: Prettify<MotionMapWithEvents<PopoverMotion>>;
  /**
   * Handle for the Root trigger scope (`trigger`). Portal slots need a separate handle on `Popover.Content`.
   * Not placed on the DOM.
   */
  motionController?: MotionController;
} & MotionStateHostProps;

export type PopoverClassNamesProviderProps = {
  classNames?: Prettify<PopoverClassNames>;
  children: ReactNode;
};

export type UsePopoverRootStateProps = Omit<PopoverProps, "classNames" | "motion" | "motionController" | "motionState" | "motionPayload" | "playInitialState">;

export type PopoverTriggerProps = HTMLAttributes<HTMLButtonElement> & {
  /** Merge props onto the single child (Button, etc.) instead of rendering a `<button>` wrapper. */
  asChild?: boolean;
  motion?: Prettify<PopoverPartMotion>;
};

export type PopoverArrowProps = HTMLAttributes<HTMLSpanElement> & {
  motion?: Prettify<PopoverPartMotion>;
};

export type PopoverHeaderProps = HTMLAttributes<HTMLDivElement> & {
  motion?: Prettify<PopoverLifecycleMotion>;
};

export type PopoverTitleProps = HTMLAttributes<HTMLHeadingElement> & {
  motion?: Prettify<PopoverPartMotion>;
};

export type PopoverDescriptionProps = Omit<FieldHintProps, "id" | "as"> & {
  motion?: Prettify<PopoverPartMotion>;
};

export type PopoverBodyProps = HTMLAttributes<HTMLDivElement> & {
  motion?: Prettify<PopoverLifecycleMotion>;
};

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
  motion?: Prettify<MotionMapWithEvents<PopoverMotion>>;
  /**
   * Handle for the portal host (`content`, chrome). `play()` skips — there is no `root`.
   * Use `playSlot("content")`. Not placed on the DOM.
   */
  motionController?: MotionController;
} & MotionStateHostProps;

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
