import { Dropdown } from "@/components/core/Dropdown";
import { SelectionIndicator } from "@/components/core/SelectionIndicator";

import {
  ContextMenuPopover,
  ContextMenuItem,
  ContextMenuRoot,
  ContextMenuTrigger,
} from "./ContextMenu";

const ContextMenuItemIndicator = Object.assign(Dropdown.ItemIndicator, {
  Fill: SelectionIndicator.Fill,
  Mark: SelectionIndicator.Mark,
});

export const ContextMenu = Object.assign(ContextMenuRoot, {
  Trigger: ContextMenuTrigger,
  Popover: ContextMenuPopover,
  Group: Dropdown.Group,
  Label: Dropdown.Label,
  Separator: Dropdown.Separator,
  Item: ContextMenuItem,
  ItemLabel: Dropdown.ItemLabel,
  ItemHint: Dropdown.ItemHint,
  ItemIcon: Dropdown.ItemIcon,
  ItemIndicator: ContextMenuItemIndicator,
  Sub: Dropdown.Sub,
  SubTrigger: Dropdown.SubTrigger,
  SubPopover: Dropdown.SubPopover,
});

export type {
  ContextMenuProps,
  ContextMenuClassNames,
  ContextMenuTriggerProps,
  ContextMenuPopoverProps,
} from "./contextMenuTypes";

export type { DropdownMotion as ContextMenuMotion } from "@/components/core/Dropdown";

export type {
  DropdownGroupProps as ContextMenuGroupProps,
  DropdownLabelProps as ContextMenuLabelProps,
  DropdownSeparatorProps as ContextMenuSeparatorProps,
  DropdownItemProps as ContextMenuItemProps,
  DropdownItemLabelProps as ContextMenuItemLabelProps,
  DropdownItemHintProps as ContextMenuItemHintProps,
  DropdownItemIconProps as ContextMenuItemIconProps,
  DropdownItemIndicatorProps as ContextMenuItemIndicatorProps,
  DropdownSubProps as ContextMenuSubProps,
  DropdownSubTriggerProps as ContextMenuSubTriggerProps,
  DropdownSubPopoverProps as ContextMenuSubPopoverProps,
} from "@/components/core/Dropdown";
