import type {
  HTMLAttributes,
  ReactNode,
  Ref,
} from "react";

import type { MessageBannerGridSlots } from "@/components/core/utils/messageBannerGridLayout";

import type { TooltipSide } from "./tooltipPosition";

export type { TooltipSide };

export type TooltipVariant =
  | "default"
  | "outline"
  | "secondary"
  | "danger"
  | "success"
  | "info"
  | "warning";

export type TooltipSurface = "default" | "gloss";

export type TooltipSize = "small" | "base" | "mid" | "large";

export type TooltipClassNames = {
  trigger?: string;
  content?: string;
  arrow?: string;
  panel?: string;
  glossContent?: string;
  indicator?: string;
  title?: string;
  description?: string;
};

export type TooltipRootProps = {
  children?: ReactNode;
  size?: TooltipSize;
  variant?: TooltipVariant;
  surface?: TooltipSurface;
  delayShowMs?: number;
  side?: TooltipSide;
  icon?: ReactNode;
  showIcon?: boolean;
  classNames?: TooltipClassNames;
};

export type TooltipTriggerProps = HTMLAttributes<HTMLSpanElement>;

export type TooltipContentProps = HTMLAttributes<HTMLDivElement> & {
  showArrow?: boolean;
  offset?: number;
};

export type TooltipArrowProps = HTMLAttributes<HTMLSpanElement>;

export type TooltipPanelProps = HTMLAttributes<HTMLDivElement> & {
  variant?: TooltipVariant;
  surface?: TooltipSurface;
  size?: TooltipSize;
  icon?: ReactNode;
  showIcon?: boolean;
  title?: ReactNode;
  description?: ReactNode;
  glossPanelRef?: Ref<HTMLDivElement>;
};

export type TooltipIndicatorProps = HTMLAttributes<HTMLSpanElement>;
export type TooltipTitleProps = HTMLAttributes<HTMLDivElement>;
export type TooltipDescriptionProps = HTMLAttributes<HTMLDivElement>;

export type TooltipContextValue = {
  open: boolean;
  tooltipId: string;
  variant: TooltipVariant;
  surface: TooltipSurface;
  size: TooltipSize;
  side: TooltipSide;
  icon?: ReactNode;
  showIcon?: boolean;
  triggerRef: React.RefObject<HTMLElement | null>;
  scheduleShow: () => void;
  hide: () => void;
};

export type TooltipBodyContextValue = {
  variant: TooltipVariant;
  size: TooltipSize;
  icon?: ReactNode;
  showIcon?: boolean;
  gridSlots: MessageBannerGridSlots;
};

export type TooltipClassNamesProviderProps = {
  classNames?: TooltipClassNames;
  children: ReactNode;
};
