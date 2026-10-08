import type {
  HTMLAttributes,
  ReactNode,
} from "react";
import type { Prettify } from "@/utils/prettify";
 
import type { MessageBannerGridSlots } from "@/components/core/utils/messageBannerGridLayout";
import type { SemanticStatus } from "@/components/core/utils/semanticStatusIcons";
 
import type { MotionController, MotionMapWithEvents, MotionValue, MotionStateHostProps } from "@/components/core/utils/slotMotion";
 
import type { TooltipSide } from "./tooltipPosition";
 
export type { TooltipSide };
 
export const KIT_TOOLTIP_VARIANTS = ["default", "outline", "secondary"] as const;
export type KitTooltipVariant = (typeof KIT_TOOLTIP_VARIANTS)[number];
export type TooltipVariant = KitTooltipVariant | (string & {});
 
export type TooltipSize = "small" | "base" | "mid" | "large";
 
export type TooltipClassNames = {
  root?: string;
  trigger?: string;
  content?: string;
  panelRelative?: string;
  arrow?: string;
  panel?: string;
  message?: string;
  indicator?: string;
  icon?: string;
  title?: string;
  description?: string;
};
 
export type TooltipLifecycleMotion = {
  enter?: MotionValue;
  leave?: MotionValue;
};
 
export type TooltipPartMotion = TooltipLifecycleMotion & {
  hoverIn?: MotionValue;
  hoverOut?: MotionValue;
};
 
export type TooltipMotion = {
  content?: TooltipPartMotion;
  title?: TooltipPartMotion;
  description?: TooltipPartMotion;
  indicator?: TooltipPartMotion;
  arrow?: TooltipPartMotion;
  panel?: TooltipPartMotion;
};
 
export type TooltipProps = {
  children?: ReactNode;
  size?: TooltipSize;
  variant?: TooltipVariant;
  status?: SemanticStatus;
  delayShowMs?: number;
  side?: TooltipSide;
  icon?: ReactNode;
  showIcon?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** DOM node for the portal. Default: `document.body`. */
  portalContainer?: HTMLElement | null;
  classNames?: Prettify<TooltipClassNames>;
  /**
   * Per-slot motion. Root has no portal DOM — the host is `Tooltip.Content`.
   * Default: `content.enter/leave` → `portalSurfaceEnter` / `portalSurfaceLeave`.
   * Nested `title` / `description` / `indicator` / `arrow` / `panel` are broadcast on enter/leave.
   * `events` — namespaced app commands for `MotionController.play` (not a DOM slot).
   */
  motion?: Prettify<MotionMapWithEvents<TooltipMotion>>;
} & MotionStateHostProps;
 
export type TooltipTriggerProps = HTMLAttributes<HTMLSpanElement> & {
  /** Merge props onto the single child (Button, etc.) instead of wrapping in `<span>`. */
  asChild?: boolean;
};
 
export type TooltipContentProps = HTMLAttributes<HTMLDivElement> & {
  showArrow?: boolean;
  offset?: number;
  /** Overrides Root `portalContainer`. Default: `document.body`. */
  portalContainer?: HTMLElement | null;
  motion?: Prettify<MotionMapWithEvents<TooltipMotion>>;
  /**
   * Handle for the portal host (`content`, `panel`, chrome). `play()` skips — there is no `root`.
   * Use `playSlot("content")`. Not placed on the DOM.
   */
  motionController?: MotionController;
} & MotionStateHostProps;
 
export type TooltipArrowProps = HTMLAttributes<HTMLSpanElement> & {
  motion?: Prettify<TooltipPartMotion>;
};
 
export type TooltipPanelProps = HTMLAttributes<HTMLDivElement> & {
  variant?: TooltipVariant;
  status?: SemanticStatus;
  size?: TooltipSize;
  icon?: ReactNode;
  showIcon?: boolean;
  title?: ReactNode;
  description?: ReactNode;
  motion?: Prettify<TooltipPartMotion>;
};
 
export type TooltipIndicatorProps = HTMLAttributes<HTMLSpanElement> & {
  showIcon?: boolean;
  motion?: Prettify<TooltipPartMotion>;
};
 
export type TooltipIconProps = TooltipIndicatorProps;
 
/** `display: contents` — padding, border, background and width do not paint. Not a motion target. */
export type TooltipMessageProps = HTMLAttributes<HTMLDivElement>;
 
export type TooltipTitleProps = HTMLAttributes<HTMLDivElement> & {
  motion?: Prettify<TooltipPartMotion>;
};
export type TooltipDescriptionProps = HTMLAttributes<HTMLDivElement> & {
  motion?: Prettify<TooltipPartMotion>;
};
 
export type TooltipContextValue = {
  open: boolean;
  tooltipId: string;
  variant: TooltipVariant;
  status: SemanticStatus;
  size: TooltipSize;
  side: TooltipSide;
  icon?: ReactNode;
  showIcon?: boolean;
  triggerRef: React.RefObject<HTMLElement | null>;
  scheduleShow: () => void;
  hide: () => void;
  /** Portal mount node from Root; Content may override via its own prop. */
  portalContainer?: HTMLElement | null;
};
 
export type TooltipBodyContextValue = {
  variant: TooltipVariant;
  status: SemanticStatus;
  size: TooltipSize;
  icon?: ReactNode;
  showIcon?: boolean;
  gridSlots: MessageBannerGridSlots;
};
 
export type TooltipClassNamesProviderProps = {
  classNames?: Prettify<TooltipClassNames>;
  children: ReactNode;
};
 