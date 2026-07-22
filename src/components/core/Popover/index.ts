import { PopoverArrow, PopoverBody, PopoverContent, PopoverHeader, PopoverDescription, PopoverTitle, PopoverRoot, PopoverTrigger } from "./Popover";

export const Popover = Object.assign(PopoverRoot, {
  Trigger: PopoverTrigger,
  Content: PopoverContent,
  Header: PopoverHeader,
  Title: PopoverTitle,
  Description: PopoverDescription,
  Body: PopoverBody,
  Arrow: PopoverArrow,
});

export type {
  PopoverProps,
  PopoverTriggerProps,
  PopoverContentProps,
  PopoverHeaderProps,
  PopoverTitleProps,
  PopoverDescriptionProps,
  PopoverBodyProps,
  PopoverArrowProps,
  PopoverSide,
  PopoverSize,
  PopoverVariant,
  PopoverContentGap,
  PopoverClassNames,
} from "./Popover";

export type { FloatingAlign, FloatingAlign as PopoverAlign } from "@/components/core/Tooltip/tooltipPosition";
