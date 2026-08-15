import { DropdownGroup, DropdownItem, DropdownItemHint, DropdownItemIcon, DropdownItemIndicator, DropdownItemLabel, DropdownLabel, DropdownPopover, DropdownRoot, DropdownSeparator, DropdownSub, DropdownSubContent, DropdownSubTrigger, DropdownTrigger } from "./Dropdown";
import { SelectionIndicator } from "@/components/core/SelectionIndicator";

const DropdownItemIndicatorCompound = Object.assign(DropdownItemIndicator, {
  Fill: SelectionIndicator.Fill,
  Mark: SelectionIndicator.Mark,
});

export const Dropdown = Object.assign(DropdownRoot, {
  Trigger: DropdownTrigger,
  /** Floating menu panel host. Not `Popover.Content` (body inside a Popover). */
  Popover: DropdownPopover,
  Group: DropdownGroup,
  Label: DropdownLabel,
  Separator: DropdownSeparator,
  Item: DropdownItem,
  ItemLabel: DropdownItemLabel,
  ItemHint: DropdownItemHint,
  ItemIcon: DropdownItemIcon,
  ItemIndicator: DropdownItemIndicatorCompound,
  Sub: DropdownSub,
  SubTrigger: DropdownSubTrigger,
  SubContent: DropdownSubContent,
});

export type {
  DropdownProps,
  DropdownClassNames,
  DropdownTriggerProps,
  DropdownPopoverProps,
  DropdownGroupProps,
  DropdownLabelProps,
  DropdownSeparatorProps,
  DropdownItemProps,
  DropdownItemLabelProps,
  DropdownItemHintProps,
  DropdownItemIconProps,
  DropdownItemIndicatorProps,
  DropdownItemStatus,
  DropdownSubProps,
  DropdownSubTriggerProps,
  DropdownSubContentProps,
  DropdownMotion,
  DropdownLifecycleMotion,
  DropdownPartMotion,
  DropdownPopoverMotion,
} from "./dropdownTypes";
