import type { HTMLAttributes, ReactNode } from "react";

import type {
  SelectionIndicatorSize,
  SelectionIndicatorVariant,
} from "@/components/core/SelectionIndicator";

export type ListBoxSize = "small" | "base" | "mid" | "large";

export type ListBoxVariant = "default" | "gloss";

export type ListBoxClassNames = {
  /** Корень `role="listbox"`. */
  root?: string;
  /** `ListBox.Section` (`role="group"`). */
  section?: string;
  /** Обёртка `ListBox.Header`. */
  header?: string;
  /** Текст в `ListBox.Header`. */
  headerText?: string;
  /** `ListBox.Separator`. */
  separator?: string;
  /** `ListBox.Empty`. */
  empty?: string;
  /** Кнопка `ListBox.Item`. */
  item?: string;
  /** `ListBox.Label`. */
  label?: string;
  /** `ListBox.Hint`. */
  hint?: string;
  /** `ListBox.Icon`. */
  icon?: string;
  /** Оболочка `ListBox.ItemIndicator`. */
  itemIndicator?: string;
};

export type ListBoxContextValue = {
  listId: string;
  size: ListBoxSize;
  multiple: boolean;
  selected: Set<string>;
  selectItem: (value: string) => void;
  activeValue: string | null;
  setActiveValue: (value: string | null) => void;
  showIndicator: boolean;
  indicatorMode: "radio" | "multi";
  disabled?: boolean;
};

export type ListBoxRootProps = Omit<
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
  /** Доступное имя списка, если нет `aria-label` / `aria-labelledby`. */
  label?: string;
  classNames?: ListBoxClassNames;
};

export type ListBoxClassNamesProviderProps = {
  classNames?: ListBoxClassNames;
  children: ReactNode;
};

export type UseListBoxRootStateProps = Omit<
  ListBoxRootProps,
  "classNames" | "className"
>;

export type ListBoxSectionProps = HTMLAttributes<HTMLDivElement>;

export type ListBoxHeaderProps = HTMLAttributes<HTMLDivElement>;

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

export type ListBoxItemIndicatorProps = Omit<
  HTMLAttributes<HTMLSpanElement>,
  "children"
> & {
  variant?: SelectionIndicatorVariant;
  size?: SelectionIndicatorSize;
  check?: boolean;
  children?: ReactNode;
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
