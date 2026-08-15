import { TooltipArrow, TooltipContent, TooltipDescription, TooltipIcon, TooltipIndicator, TooltipMessage, TooltipPanel, TooltipRoot, TooltipTitle, TooltipTrigger } from "./Tooltip";

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
  TooltipSize,
  TooltipSide,
  TooltipClassNames,
  TooltipProps,
  TooltipTriggerProps,
  TooltipContentProps,
  TooltipArrowProps,
  TooltipPanelProps,
  TooltipIndicatorProps,
  TooltipIconProps,
  TooltipMessageProps,
  TooltipTitleProps,
  TooltipDescriptionProps,
  TooltipMotion,
  TooltipLifecycleMotion,
} from "./tooltipTypes";
