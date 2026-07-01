import {
  DropdownGroup,
  DropdownItem,
  DropdownItemHint,
  DropdownItemIcon,
  DropdownItemIndicator,
  DropdownItemLabel,
  DropdownLabel,
  DropdownPopover,
  DropdownRoot,
  DropdownSeparator,
  DropdownSub,
  DropdownSubContent,
  DropdownSubTrigger,
  DropdownTrigger,
} from "./Dropdown";
import { SelectionIndicator } from "@/components/core/SelectionIndicator";

const DropdownItemIndicatorCompound = Object.assign(DropdownItemIndicator, {
  Fill: SelectionIndicator.Fill,
  Mark: SelectionIndicator.Mark,
});

export const Dropdown = Object.assign(DropdownRoot, {
  Trigger: DropdownTrigger,
  Popover: DropdownPopover,
  Content: DropdownPopover,
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

export {
  DropdownTrigger,
  DropdownPopover,
  DropdownGroup,
  DropdownLabel,
  DropdownSeparator,
  DropdownItem,
  DropdownItemLabel,
  DropdownItemHint,
  DropdownItemIcon,
  DropdownItemIndicator,
  DropdownSub,
  DropdownSubTrigger,
  DropdownSubContent,
} from "./Dropdown";

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
  DropdownItemVariant,
  DropdownSubProps,
  DropdownSubTriggerProps,
  DropdownSubContentProps,
} from "./dropdownTypes";
