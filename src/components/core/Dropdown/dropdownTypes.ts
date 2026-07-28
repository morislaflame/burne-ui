import type { HTMLAttributes, ReactNode } from "react";
import type { Prettify } from "@/utils/prettify";

import type { PopoverSide, PopoverVariant } from "@/components/core/Popover";
import type { FloatingAlign } from "@/components/core/Tooltip/tooltipPosition";
import type {
  SelectionIndicatorClassNames,
  SelectionIndicatorSize,
  SelectionIndicatorVariant,
} from "@/components/core/SelectionIndicator";

export type DropdownItemStatus =
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
  /** DOM node for menu / submenu portals. Default: `document.body`. */
  portalContainer?: HTMLElement | null;
  classNames?: Prettify<DropdownClassNames>;
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
  /** Portal mount node from Root; Popover / SubContent may override. */
  portalContainer?: HTMLElement | null;
};

export type DropdownSubContextValue = {
  open: boolean;
  setOpen: (next: boolean) => void;
  triggerRef: React.RefObject<HTMLDivElement | null>;
  scheduleClose: () => void;
  cancelClose: () => void;
};

export type DropdownClassNamesProviderProps = {
  classNames?: Prettify<DropdownClassNames>;
  children: ReactNode;
};

export type DropdownTriggerProps = HTMLAttributes<HTMLElement> & {
  asChild?: boolean;
};

export type DropdownPopoverProps = HTMLAttributes<HTMLDivElement> & {
  variant?: PopoverVariant;
  bodyClassName?: string;
  /** Preferred side relative to the trigger. Default: `bottom`. */
  side?: PopoverSide;
  /** Panel alignment relative to trigger (passed to Popover). Default: `start` when matching width. */
  align?: FloatingAlign;
  /** Distance from the trigger in px. Default: Popover default offset. */
  offset?: number;
  /** Overrides Root `portalContainer` for the main menu panel. */
  portalContainer?: HTMLElement | null;
};

export type DropdownGroupProps = HTMLAttributes<HTMLDivElement> & {
  selectionIndicator?: boolean;
};

export type DropdownLabelProps = HTMLAttributes<HTMLDivElement>;
export type DropdownSeparatorProps = HTMLAttributes<HTMLDivElement>;
export type DropdownSubProps = HTMLAttributes<HTMLDivElement>;

export type DropdownSubTriggerProps = HTMLAttributes<HTMLDivElement> & {
  asChild?: boolean;
  /** Replaces the default submenu chevron. Pass `null` to hide. */
  icon?: ReactNode;
};

export type DropdownSubContentProps = HTMLAttributes<HTMLDivElement> & {
  /** Overrides Root `portalContainer` for the submenu panel. */
  portalContainer?: HTMLElement | null;
};

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
  classNames?: Prettify<DropdownItemIndicatorClassNames>;
};

export type DropdownItemProps = Omit<HTMLAttributes<HTMLElement>, "value"> & {
  value?: string;
  href?: string;
  disabled?: boolean;
  selection?: boolean;
  status?: DropdownItemStatus;
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
  | "portalContainer"
>;

export type UseDropdownPopoverMenuProps = {
  open: boolean;
  setOpen: (next: boolean) => void;
  contentRef: React.RefObject<HTMLDivElement | null>;
};

export type UseDropdownSubContentPortalProps = {
  portalContainer?: HTMLElement | null;
  subOpen: boolean;
  triggerRef: React.RefObject<HTMLDivElement | null>;
  menuTriggerRef: React.RefObject<HTMLElement | null>;
  subPanelRootsRef: React.RefObject<Set<HTMLElement>>;
  popoverVariant: PopoverVariant;
};

export type UseDropdownSubmenuKeyboardProps = {
  subOpen: boolean;
  /** Panel must be mounted in the portal before focusing items. */
  portalMounted: boolean;
  panelRef: React.RefObject<HTMLDivElement | null>;
  triggerRef: React.RefObject<HTMLDivElement | null>;
  setOpen: (next: boolean) => void;
};
