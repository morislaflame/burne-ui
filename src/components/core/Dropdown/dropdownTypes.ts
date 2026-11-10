import type { HTMLAttributes, ReactNode } from "react";
import type { Prettify } from "@/utils/prettify";
 
import type { PopoverSide, PopoverVariant } from "@/components/core/Popover";
import type { ComponentSize } from "@/components/core/utils/sizeLayout";
import type { SemanticStatus } from "@/components/core/utils/semanticStatusIcons";
import type { FloatingAlign } from "@/components/core/Tooltip/tooltipPosition";
import type {
  MotionController,
  MotionMapWithEvents,
  MotionScopeValue,
  MotionValue, MotionStateHostProps, } from "@/components/core/utils/slotMotion";
import type {
  SelectionIndicatorClassNames,
  SelectionIndicatorSize,
  SelectionIndicatorVariant,
} from "@/components/core/SelectionIndicator";
 
export type DropdownItemStatus = SemanticStatus;
 
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
  subTriggerIcon?: string;
  subPopover?: string;
  subPopoverBody?: string;
};
 
export type DropdownLifecycleMotion = {
  enter?: MotionValue;
  leave?: MotionValue;
};
 
export type DropdownPartMotion = DropdownLifecycleMotion & {
  hoverIn?: MotionValue;
  hoverOut?: MotionValue;
  pressIn?: MotionValue;
  pressOut?: MotionValue;
};
 
/**
 * Main menu slots (`content` / `title` / `description` / `body`) are forwarded
 * to the inner Popover. `subPopover` is the submenu portal host. `trigger` lives
 * on the Dropdown Root scope.
 */
export type DropdownMotion = {
  content?: DropdownLifecycleMotion;
  title?: DropdownPartMotion;
  description?: DropdownPartMotion;
  body?: DropdownLifecycleMotion;
  item?: DropdownLifecycleMotion;
  itemLabel?: DropdownPartMotion;
  itemHint?: DropdownPartMotion;
  itemIcon?: DropdownPartMotion;
  label?: DropdownPartMotion;
  subTrigger?: DropdownPartMotion;
  separator?: DropdownPartMotion;
  subPopover?: DropdownLifecycleMotion;
  trigger?: DropdownPartMotion;
};
 
export type DropdownPopoverMotion = Pick<
  DropdownMotion,
  | "content"
  | "title"
  | "description"
  | "body"
  | "item"
  | "itemLabel"
  | "itemHint"
  | "itemIcon"
  | "label"
  | "subTrigger"
  | "separator"
>;
 
export type DropdownProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  children?: ReactNode;
  /** Visible trigger label. Renders `Dropdown.Trigger` when set. */
  label?: ReactNode;
  /** Data-driven menu rows. Fills the popover that children do not already render. */
  items?: readonly DropdownItemData[];
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  selectionMode?: "single" | "multiple";
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  values?: string[];
  defaultValues?: string[];
  onValuesChange?: (values: string[]) => void;
  closeOnSelect?: boolean;
  /** Menu row scale. Default `base`. */
  size?: ComponentSize;
  /** Menu surface. `Dropdown.Popover` `variant` wins. */
  variant?: PopoverVariant;
  /** DOM node for menu / submenu portals. Default: `document.body`. */
  portalContainer?: HTMLElement | null;
  classNames?: Prettify<DropdownClassNames>;
  /**
   * Per-slot motion. Main menu: Popover slots (`content`, `title`, `description`, `body`, `item`, `itemLabel`, `itemHint`, `itemIcon`, `label`, `subTrigger`, `separator`).
   * Submenu portal: `subPopover`. Trigger press: `trigger` on Root (default `pressSqueeze`).
   * `events` — namespaced app commands for `MotionController.play` (not a DOM slot).
   */
  motion?: Prettify<MotionMapWithEvents<DropdownMotion>>;
  /**
   * Handle for the Root trigger scope (`trigger`). Menu slots need a separate handle on
   * `Dropdown.Popover`; submenu — on `Dropdown.SubPopover`. Not placed on the DOM.
   */
  motionController?: MotionController;
} & MotionStateHostProps;
 
export type DropdownContextValue = {
  open: boolean;
  setOpen: (next: boolean) => void;
  multiple: boolean;
  selected: Set<string>;
  selectItem: (value: string) => void;
  indicatorMode: "radio" | "multi";
  closeOnSelect: boolean;
  size: ComponentSize;
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
  motion?: Prettify<DropdownPartMotion>;
};
 
export type DropdownPopoverProps = HTMLAttributes<HTMLDivElement> & {
  variant?: PopoverVariant;
  classNames?: Prettify<Pick<DropdownClassNames, "popoverBody">>;
  /** Preferred side relative to the trigger. Default: `bottom`. */
  side?: PopoverSide;
  /** Panel alignment relative to trigger (passed to Popover). Default: `start` when matching width. */
  align?: FloatingAlign;
  /** Distance from the trigger in px. Default: Popover default offset. */
  offset?: number;
  /**
   * Position the panel against this node instead of the trigger.
   * ContextMenu points it at the cursor. Default: the trigger.
   */
  anchorRef?: React.RefObject<HTMLElement | null>;
  /**
   * Stretch the panel to the anchor width. Default: `true`.
   * ContextMenu passes `false` so a zero-size cursor anchor does not collapse the menu.
   */
  matchAnchorWidth?: boolean;
  /** Overrides Root `portalContainer` for the main menu panel. */
  portalContainer?: HTMLElement | null;
  /**
   * Merged with Root menu slots and forwarded to the inner Popover.
   * `events` — namespaced app commands for the portal host.
   */
  motion?: Prettify<MotionMapWithEvents<DropdownPopoverMotion>>;
  /**
   * Handle for the menu portal host (`content` / `item` / chrome). `play()` skips — no `root`.
   * Use `playSlot("content")` / `playSlot("item")`. Not placed on the DOM.
   */
  motionController?: MotionController;
} & MotionStateHostProps;
 
export type DropdownGroupProps = HTMLAttributes<HTMLDivElement>;
 
export type DropdownLabelProps = HTMLAttributes<HTMLDivElement> & {
  motion?: Prettify<DropdownPartMotion>;
};
export type DropdownSeparatorProps = HTMLAttributes<HTMLDivElement> & {
  motion?: Prettify<DropdownPartMotion>;
};
export type DropdownSubProps = HTMLAttributes<HTMLDivElement>;
 
export type DropdownSubTriggerProps = HTMLAttributes<HTMLDivElement> & {
  asChild?: boolean;
  /** Replaces the default submenu chevron. Pass `null` to hide. */
  icon?: ReactNode;
  motion?: Prettify<DropdownPartMotion>;
};
 
export type DropdownSubPopoverProps = HTMLAttributes<HTMLDivElement> & {
  /** Overrides Root `portalContainer` for the submenu panel. */
  portalContainer?: HTMLElement | null;
  motion?: Prettify<DropdownLifecycleMotion>;
  /**
   * Handle for the submenu portal host (`subPopover`). Nested Provider — not the Root
   * trigger scope. `play()` skips. Use `playSlot("subPopover")`. Not placed on the DOM.
   */
  motionController?: MotionController;
} & MotionStateHostProps;
 
export type DropdownItemLabelProps = HTMLAttributes<HTMLSpanElement> & {
  motion?: Prettify<DropdownPartMotion>;
};
export type DropdownItemHintProps = HTMLAttributes<HTMLSpanElement> & {
  motion?: Prettify<DropdownPartMotion>;
};
export type DropdownItemIconProps = HTMLAttributes<HTMLSpanElement> & {
  motion?: Prettify<DropdownPartMotion>;
};
 
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
  /** Mark icon. Replaces the default check. */
  icon?: ReactNode;
  children?: ReactNode;
  classNames?: Prettify<DropdownItemIndicatorClassNames>;
};
 
export type DropdownItemData = {
  value: string;
  label: ReactNode;
  hint?: ReactNode;
  disabled?: boolean;
};

export type DropdownItemProps = Omit<HTMLAttributes<HTMLElement>, "value"> & {
  value?: string;
  href?: string;
  disabled?: boolean;
  selection?: boolean;
  status?: DropdownItemStatus;
  /** Render selection indicator (same as `<Dropdown.ItemIndicator />`). */
  indicator?: boolean;
  motion?: Prettify<DropdownLifecycleMotion>;
};
 
export type UseDropdownRootStateProps = Pick<
  DropdownProps,
  | "open"
  | "defaultOpen"
  | "onOpenChange"
  | "selectionMode"
  | "value"
  | "defaultValue"
  | "onValueChange"
  | "values"
  | "defaultValues"
  | "onValuesChange"
  | "closeOnSelect"
  | "variant"
  | "size"
  | "portalContainer"
>;
 
export type UseDropdownPopoverMenuProps = {
  open: boolean;
  setOpen: (next: boolean) => void;
  contentRef: React.RefObject<HTMLDivElement | null>;
  triggerRef: React.RefObject<HTMLElement | null>;
};
 
export type UseDropdownSubPopoverPortalProps = {
  portalContainer?: HTMLElement | null;
  subOpen: boolean;
  triggerRef: React.RefObject<HTMLDivElement | null>;
  menuTriggerRef: React.RefObject<HTMLElement | null>;
  subPanelRootsRef: React.RefObject<Set<HTMLElement>>;
  popoverVariant: PopoverVariant;
  motionScope?: MotionScopeValue | null;
};
 
export type UseDropdownSubmenuKeyboardProps = {
  subOpen: boolean;
  /** Panel must be mounted in the portal before focusing items. */
  portalMounted: boolean;
  panelRef: React.RefObject<HTMLDivElement | null>;
  triggerRef: React.RefObject<HTMLDivElement | null>;
  setOpen: (next: boolean) => void;
};
 