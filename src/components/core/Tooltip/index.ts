import {
  TooltipArrow,
  TooltipContent,
  TooltipDescription,
  TooltipIcon,
  TooltipIndicator,
  TooltipMessage,
  TooltipPanel,
  TooltipRoot,
  TooltipTitle,
  TooltipTrigger,
} from "./Tooltip";

export const Tooltip = Object.assign(TooltipRoot, {
  Trigger: TooltipTrigger,
  Content: TooltipContent,
  Arrow: TooltipArrow,
  Panel: TooltipPanel,
  Indicator: TooltipIndicator,
  Icon: TooltipIcon,
  Message: TooltipMessage,
  Title: TooltipTitle,
  Description: TooltipDescription,
});

export type {
  TooltipVariant,
  TooltipSurface,
  TooltipSize,
  TooltipSide,
  TooltipClassNames,
  TooltipRootProps,
  TooltipTriggerProps,
  TooltipContentProps,
  TooltipArrowProps,
  TooltipPanelProps,
  TooltipIndicatorProps,
  TooltipIconProps,
  TooltipMessageProps,
  TooltipTitleProps,
  TooltipDescriptionProps,
} from "./tooltipTypes";
