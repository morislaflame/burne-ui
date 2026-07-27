import { ListBoxEmpty, ListBoxHeader, ListBoxHint, ListBoxIcon, ListBoxItem, ListBoxItemIndicator, ListBoxLabel, ListBoxRoot, ListBoxSection, ListBoxSeparator, useListBox, useListBoxActiveValue } from "./ListBox";
import { SelectionIndicator } from "@/components/core/SelectionIndicator";

const ListBoxItemIndicatorCompound = Object.assign(ListBoxItemIndicator, {
  Fill: SelectionIndicator.Fill,
  Mark: SelectionIndicator.Mark,
});

export const ListBox = Object.assign(ListBoxRoot, {
  Section: ListBoxSection,
  Header: ListBoxHeader,
  Separator: ListBoxSeparator,
  Empty: ListBoxEmpty,
  Item: ListBoxItem,
  Label: ListBoxLabel,
  Hint: ListBoxHint,
  Icon: ListBoxIcon,
  ItemIndicator: ListBoxItemIndicatorCompound,
});

export { useListBox, useListBoxActiveValue };

export type {
  ListBoxProps,
  ListBoxSectionProps,
  ListBoxHeaderProps,
  ListBoxSeparatorProps,
  ListBoxEmptyProps,
  ListBoxItemProps,
  ListBoxLabelProps,
  ListBoxHintProps,
  ListBoxIconProps,
  ListBoxItemIndicatorProps,
  ListBoxSize,
  ListBoxVariant,
  ListBoxClassNames,
} from "./ListBox";
