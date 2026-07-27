import type { HTMLAttributes, ReactNode } from "react";

import type {
  SelectionIndicatorSize,
  SelectionIndicatorVariant,
  SelectionIndicatorClassNames,
} from "@/components/core/SelectionIndicator";

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

export type ListBoxContextValue = {
  listId: string;
  size: ListBoxSize;
  multiple: boolean;
  selected: Set<string>;
  selectItem: (value: string) => void;
  setActiveValue: (value: string | null) => void;
  showIndicator: boolean;
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
  selectionIndicator?: boolean;
  disabled?: boolean;
  activeValue?: string | null;
  onActiveValueChange?: (value: string | null) => void;
  listId?: string;
  classNames?: ListBoxClassNames;
};

export type ListBoxClassNamesProviderProps = {
  classNames?: ListBoxClassNames;
  children: ReactNode;
};

export type UseListBoxRootStateProps = Omit<
  ListBoxProps,
  "classNames" | "className"
>;

export type ListBoxSectionProps = HTMLAttributes<HTMLDivElement>;

export type ListBoxHeaderProps = HTMLAttributes<HTMLDivElement> & {
  /** Classes for the inner `Text` in the header (per-instance; merges after `classNames.headerText`). */
  textClassName?: string;
};

export type ListBoxSeparatorProps = HTMLAttributes<HTMLDivElement>;

export type ListBoxEmptyProps = HTMLAttributes<HTMLParagraphElement>;

export type ListBoxItemProps = Omit<HTMLAttributes<HTMLButtonElement>, "value"> & {
  value: string;
  disabled?: boolean;
  label?: ReactNode;
  hint?: ReactNode;
  icon?: ReactNode;
};

export type ListBoxLabelProps = HTMLAttributes<HTMLSpanElement>;

export type ListBoxHintProps = HTMLAttributes<HTMLSpanElement>;

export type ListBoxIconProps = HTMLAttributes<HTMLSpanElement>;

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
  classNames?: ListBoxItemIndicatorClassNames;
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
  "children" | "label" | "hint" | "icon" | "value" | "disabled"
>;

export type UseListBoxItemAnimationsProps = {
  disabled: boolean;
  hasLabel: boolean;
  onPointerDown?: HTMLAttributes<HTMLButtonElement>["onPointerDown"];
};
