import { TooltipArrow, TooltipContent, TooltipDescription, TooltipIndicator, TooltipMessage, TooltipPanel, TooltipRoot, TooltipTitle, TooltipTrigger } from "./Tooltip";
 
export const Tooltip = Object.assign(TooltipRoot, {
  Trigger: TooltipTrigger,
  Content: TooltipContent,
  Arrow: TooltipArrow,
  Panel: TooltipPanel,
  Indicator: TooltipIndicator,
  Message: TooltipMessage,
  Title: TooltipTitle,
  Description: TooltipDescription,
});
 
export type {
  TooltipVariant,
  TooltipSize,
  TooltipStatus,
  TooltipSide,
  TooltipClassNames,
  TooltipProps,
  TooltipTriggerProps,
  TooltipContentProps,
  TooltipArrowProps,
  TooltipPanelProps,
  TooltipIndicatorProps,
  TooltipMessageProps,
  TooltipTitleProps,
  TooltipDescriptionProps,
  TooltipMotion,
  TooltipLifecycleMotion,
  TooltipPartMotion,
} from "./tooltipTypes";
 