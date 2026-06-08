import {
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverHint,
  PopoverLabel,
  PopoverRoot,
  PopoverTrigger,
} from "./Popover";

export const Popover = Object.assign(PopoverRoot, {
  Trigger: PopoverTrigger,
  Content: PopoverContent,
  Header: PopoverHeader,
  Label: PopoverLabel,
  Hint: PopoverHint,
  Body: PopoverBody,
  Arrow: PopoverArrow,
});

export type {
  PopoverRootProps,
  PopoverTriggerProps,
  PopoverContentProps,
  PopoverHeaderProps,
  PopoverLabelProps,
  PopoverHintProps,
  PopoverBodyProps,
  PopoverArrowProps,
  PopoverSide,
  PopoverSize,
  PopoverContentGap,
} from "./Popover";

export type { FloatingAlign, FloatingAlign as PopoverAlign } from "@/components/core/Tooltip/tooltipPosition";
