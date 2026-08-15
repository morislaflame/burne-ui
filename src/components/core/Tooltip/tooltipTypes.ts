import type {
  HTMLAttributes,
  ReactNode,
  Ref,
} from "react";
import type { Prettify } from "@/utils/prettify";

import type { MessageBannerGridSlots } from "@/components/core/utils/messageBannerGridLayout";
import type { SemanticStatus } from "@/components/core/utils/semanticStatusIcons";

import type { MotionValue } from "@/components/core/utils/slotMotion";

import type { TooltipSide } from "./tooltipPosition";

export type { TooltipSide };

export type TooltipVariant = "default" | "outline" | "secondary" | "gloss";

export type TooltipSize = "small" | "base" | "mid" | "large";

export type TooltipClassNames = {
  root?: string;
  trigger?: string;
  content?: string;
  arrow?: string;
  panel?: string;
  glossPanel?: string;
  glossContent?: string;
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

export type TooltipMotion = {
  content?: TooltipLifecycleMotion;
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
  /** DOM node for the portal. Default: `document.body`. */
  portalContainer?: HTMLElement | null;
  classNames?: Prettify<TooltipClassNames>;
  /**
   * Per-slot motion. Root has no portal DOM — the host is `Tooltip.Content`.
   * Default: `content.enter/leave` → `portalSurfaceEnter` / `portalSurfaceLeave`.
   */
  motion?: Prettify<TooltipMotion>;
};

export type TooltipTriggerProps = HTMLAttributes<HTMLSpanElement> & {
  /** Merge props onto the single child (Button, etc.) instead of wrapping in `<span>`. */
  asChild?: boolean;
};

export type TooltipContentProps = HTMLAttributes<HTMLDivElement> & {
  showArrow?: boolean;
  offset?: number;
  /** Overrides Root `portalContainer`. Default: `document.body`. */
  portalContainer?: HTMLElement | null;
  motion?: Prettify<TooltipMotion>;
};

export type TooltipArrowProps = HTMLAttributes<HTMLSpanElement>;

export type TooltipPanelProps = HTMLAttributes<HTMLDivElement> & {
  variant?: TooltipVariant;
  status?: SemanticStatus;
  size?: TooltipSize;
  icon?: ReactNode;
  showIcon?: boolean;
  title?: ReactNode;
  description?: ReactNode;
  glossPanelRef?: Ref<HTMLDivElement>;
};

export type TooltipIndicatorProps = HTMLAttributes<HTMLSpanElement> & {
  showIcon?: boolean;
};

export type TooltipIconProps = TooltipIndicatorProps;

export type TooltipMessageProps = HTMLAttributes<HTMLDivElement>;

export type TooltipTitleProps = HTMLAttributes<HTMLDivElement>;
export type TooltipDescriptionProps = HTMLAttributes<HTMLDivElement>;

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
