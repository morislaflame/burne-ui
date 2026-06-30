import {
  TooltipArrow,
  TooltipContent,
  TooltipDescription,
  TooltipIndicator,
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
  TooltipTitleProps,
  TooltipDescriptionProps,
} from "./tooltipTypes";
