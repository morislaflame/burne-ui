import { TooltipArrow, TooltipContent, TooltipRoot, TooltipTrigger } from "./Tooltip";

export const Tooltip = Object.assign(TooltipRoot, {
  Trigger: TooltipTrigger,
  Content: TooltipContent,
  Arrow: TooltipArrow,
});

export type {
  TooltipVariant,
  TooltipSize,
  TooltipSide,
  TooltipRootProps,
  TooltipTriggerProps,
  TooltipContentProps,
  TooltipArrowProps,
} from "./Tooltip";
