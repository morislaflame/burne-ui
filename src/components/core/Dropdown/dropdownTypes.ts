import type { HTMLAttributes, ReactNode } from "react";

import type { PopoverVariant } from "@/components/core/Popover";
import type { FloatingAlign } from "@/components/core/Tooltip/tooltipPosition";
import type {
  SelectionIndicatorClassNames,
  SelectionIndicatorSize,
  SelectionIndicatorVariant,
} from "@/components/core/SelectionIndicator";

export type DropdownItemVariant =
  | "default"
  | "danger"
  | "warning"
  | "info"
  | "success";

export type DropdownClassNames = {
  root?: string;
  trigger?: string;
  popover?: string;
  popoverBody?: string;
  group?: string;
  label?: string;
  separator?: string;
  item?: string;
  itemLabel?: string;
  itemHint?: string;
  itemIcon?: string;
  itemIndicator?: string;
  itemIndicatorShell?: string;
  itemIndicatorFill?: string;
  itemIndicatorMark?: string;
  sub?: string;
  subTrigger?: string;
  subTriggerLabelWrap?: string;
  subTriggerChevron?: string;
  subContent?: string;
  subContentGlossPanel?: string;
  subContentGlossContent?: string;
};

export type DropdownProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  multiple?: boolean;
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  selectionIndicator?: boolean;
  closeOnSelect?: boolean;
  popoverVariant?: PopoverVariant;
  classNames?: DropdownClassNames;
};

export type DropdownContextValue = {
  open: boolean;
  setOpen: (next: boolean) => void;
  multiple: boolean;
  selected: Set<string>;
  selectItem: (value: string) => void;
  indicatorMode: "radio" | "multi";
  closeOnSelect: boolean;
  popoverVariant: PopoverVariant;
  triggerRef: React.RefObject<HTMLElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
  contentId: string;
  subPanelRootsRef: React.RefObject<Set<HTMLElement>>;
};

export type DropdownSubContextValue = {
  open: boolean;
  setOpen: (next: boolean) => void;
  triggerRef: React.RefObject<HTMLDivElement | null>;
  scheduleClose: () => void;
  cancelClose: () => void;
};

export type DropdownClassNamesProviderProps = {
  classNames?: DropdownClassNames;
  children: ReactNode;
};

export type DropdownTriggerProps = HTMLAttributes<HTMLElement> & {
  asChild?: boolean;
};

export type DropdownPopoverProps = HTMLAttributes<HTMLDivElement> & {
  variant?: PopoverVariant;
  bodyClassName?: string;
  /** Panel alignment relative to trigger (passed to Popover). Default: `start` when matching width. */
  align?: FloatingAlign;
};

export type DropdownGroupProps = HTMLAttributes<HTMLDivElement> & {
  selectionIndicator?: boolean;
};

export type DropdownLabelProps = HTMLAttributes<HTMLDivElement>;
export type DropdownSeparatorProps = HTMLAttributes<HTMLDivElement>;
export type DropdownSubProps = HTMLAttributes<HTMLDivElement>;

export type DropdownSubTriggerProps = HTMLAttributes<HTMLDivElement> & {
  asChild?: boolean;
};

export type DropdownSubContentProps = HTMLAttributes<HTMLDivElement>;

export type DropdownItemLabelProps = HTMLAttributes<HTMLSpanElement>;
export type DropdownItemHintProps = HTMLAttributes<HTMLSpanElement>;
export type DropdownItemIconProps = HTMLAttributes<HTMLSpanElement>;

export type DropdownItemIndicatorClassNames = SelectionIndicatorClassNames &
  Partial<
    Pick<
      DropdownClassNames,
      "itemIndicator" | "itemIndicatorShell" | "itemIndicatorFill" | "itemIndicatorMark"
    >
  >;

export type DropdownItemIndicatorProps = Omit<
  HTMLAttributes<HTMLSpanElement>,
  "children"
> & {
  variant?: SelectionIndicatorVariant;
  size?: SelectionIndicatorSize;
  check?: boolean;
  children?: ReactNode;
  classNames?: DropdownItemIndicatorClassNames;
};

export type DropdownItemProps = Omit<HTMLAttributes<HTMLElement>, "value"> & {
  value?: string;
  href?: string;
  disabled?: boolean;
  selection?: boolean;
  variant?: DropdownItemVariant;
};

export type UseDropdownRootStateProps = Pick<
  DropdownProps,
  | "open"
  | "defaultOpen"
  | "onOpenChange"
  | "multiple"
  | "value"
  | "defaultValue"
  | "onValueChange"
  | "closeOnSelect"
  | "popoverVariant"
>;

export type UseDropdownPopoverMenuProps = {
  open: boolean;
  setOpen: (next: boolean) => void;
  triggerRef: React.RefObject<HTMLElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
};

export type UseDropdownSubContentPortalProps = {
  subOpen: boolean;
  triggerRef: React.RefObject<HTMLDivElement | null>;
  menuTriggerRef: React.RefObject<HTMLElement | null>;
  subPanelRootsRef: React.RefObject<Set<HTMLElement>>;
  popoverVariant: PopoverVariant;
};
