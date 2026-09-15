import type { HTMLAttributes, ReactNode } from "react";
import type { Prettify } from "@/utils/prettify";

import type {
  SelectionIndicatorSize,
  SelectionIndicatorVariant,
  SelectionIndicatorClassNames,
} from "@/components/core/SelectionIndicator";
import type { MotionController, MotionMapWithEvents, MotionValue, MotionStateHostProps } from "@/components/core/utils/slotMotion";

export type ListBoxSize = "small" | "base" | "mid" | "large";

export type ListBoxVariant = "default" | "gloss";

export type ListBoxClassNames = {
  /** Root `role="listbox"`. */
  root?: string;
  /** `ListBox.Section` (`role="group"`). */
  section?: string;
  /** `ListBox.Header` wrapper. */
  header?: string;
  /** Text in `ListBox.Header`. */
  headerText?: string;
  /** `ListBox.Separator`. */
  separator?: string;
  /** `ListBox.Empty`. */
  empty?: string;
  /** `ListBox.Item` button. */
  item?: string;
  /** `ListBox.Label`. */
  label?: string;
  /** `ListBox.Hint`. */
  hint?: string;
  /** `ListBox.Icon`. */
  icon?: string;
  /** `ListBox.ItemIndicator` shell (grid shell). */
  itemIndicator?: string;
  /** `SelectionIndicator` root inside ItemIndicator. */
  itemIndicatorShell?: string;
  itemIndicatorFill?: string;
  itemIndicatorMark?: string;
};

export type ListBoxPartMotion = {
  hoverIn?: MotionValue;
  hoverOut?: MotionValue;
  pressIn?: MotionValue;
  pressOut?: MotionValue;
  enter?: MotionValue;
  leave?: MotionValue;
};

export type ListBoxMotion = {
  item?: ListBoxPartMotion;
  label?: ListBoxPartMotion;
  hint?: ListBoxPartMotion;
  icon?: ListBoxPartMotion;
  section?: ListBoxPartMotion;
  header?: ListBoxPartMotion;
  empty?: ListBoxPartMotion;
  separator?: ListBoxPartMotion;
};

export type ListBoxContextValue = {
  listId: string;
  size: ListBoxSize;
  multiple: boolean;
  selected: Set<string>;
  selectItem: (value: string) => void;
  setActiveValue: (value: string | null) => void;
  indicatorMode: "radio" | "multi";
  disabled?: boolean;
  /**
   * Own keyboard / tab stop when ListBox is not driven by Select/ComboBox
   * (`activeValue` uncontrolled).
   */
  standaloneKeyboard: boolean;
};

export type ListBoxProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children" | "onChange"
> & {
  children?: ReactNode;
  size?: ListBoxSize;
  variant?: ListBoxVariant;
  multiple?: boolean;
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  disabled?: boolean;
  activeValue?: string | null;
  onActiveValueChange?: (value: string | null) => void;
  listId?: string;
  classNames?: Prettify<ListBoxClassNames>;
  /**
   * Per-slot motion (`item`, `label`, `header`, `section` …).
   * `events` — namespaced app commands for `MotionController.play` (not a DOM slot).
   * There is no `root` slot — `play()` skips; use `playSlot("header")` / `playAll`.
   */
  motion?: Prettify<MotionMapWithEvents<ListBoxMotion>>;
  /**
   * Deferred handle from `createMotionController()` / `useMotionControllerHandle()`.
   * One handle → this list chrome scope (`section` / `header` / `empty` / `separator`).
   * Nested `ListBox.Item` is a separate scope — pass a handle there. Not placed on the DOM.
   */
  motionController?: MotionController;
} & MotionStateHostProps;

export type ListBoxClassNamesProviderProps = {
  classNames?: Prettify<ListBoxClassNames>;
  children: ReactNode;
};

export type UseListBoxRootStateProps = Omit<
  ListBoxProps,
  "classNames" | "className"
>;

export type ListBoxSectionProps = HTMLAttributes<HTMLDivElement> & {
  motion?: Prettify<ListBoxPartMotion>;
};

export type ListBoxHeaderProps = HTMLAttributes<HTMLDivElement> & {
  /** Classes for the inner `Text` in the header (per-instance; merges after `classNames.headerText`). */
  textClassName?: string;
  motion?: Prettify<ListBoxPartMotion>;
};

export type ListBoxSeparatorProps = HTMLAttributes<HTMLDivElement> & {
  motion?: Prettify<ListBoxPartMotion>;
};

export type ListBoxEmptyProps = HTMLAttributes<HTMLElement> & {
  motion?: Prettify<ListBoxPartMotion>;
};

export type ListBoxItemProps = Omit<HTMLAttributes<HTMLButtonElement>, "value"> & {
  value: string;
  disabled?: boolean;
  label?: ReactNode;
  hint?: ReactNode;
  icon?: ReactNode;
  /** Simple API: render selection indicator (same as `<ListBox.ItemIndicator />`). */
  indicator?: boolean;
  motion?: Prettify<ListBoxPartMotion>;
  /**
   * Handle for this item's nested scope. `play()` looks for `root` (skip) —
   * use `playSlot("item")`. Label / hint / icon live here.
   */
  motionController?: MotionController;
} & MotionStateHostProps;

export type ListBoxLabelProps = HTMLAttributes<HTMLSpanElement> & {
  motion?: Prettify<ListBoxPartMotion>;
};

export type ListBoxHintProps = HTMLAttributes<HTMLSpanElement> & {
  motion?: Prettify<ListBoxPartMotion>;
};

export type ListBoxIconProps = HTMLAttributes<HTMLSpanElement> & {
  motion?: Prettify<ListBoxPartMotion>;
};

export type ListBoxItemIndicatorClassNames = SelectionIndicatorClassNames &
  Partial<
    Pick<
      ListBoxClassNames,
      "itemIndicator" | "itemIndicatorShell" | "itemIndicatorFill" | "itemIndicatorMark"
    >
  >;

export type ListBoxItemIndicatorProps = Omit<
  HTMLAttributes<HTMLSpanElement>,
  "children"
> & {
  variant?: SelectionIndicatorVariant;
  size?: SelectionIndicatorSize;
  check?: boolean;
  children?: ReactNode;
  classNames?: Prettify<ListBoxItemIndicatorClassNames>;
};

export type ListBoxRootShellProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  listId: string;
  variant?: ListBoxVariant;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  children?: ReactNode;
};

export type UseListBoxItemStateProps = Pick<
  ListBoxItemProps,
  "children" | "label" | "hint" | "icon" | "indicator" | "value" | "disabled"
>;
