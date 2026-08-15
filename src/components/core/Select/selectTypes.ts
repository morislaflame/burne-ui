import type { HTMLAttributes, RefObject, ReactNode } from "react";
import type { Prettify } from "@/utils/prettify";

import type { ButtonGroupSegment } from "@/components/composite/ButtonGroup/buttonGroupTypes";
import type { InputSize, InputStatus, InputVariant } from "@/components/core/Input";
import type { ListBoxProps } from "@/components/core/ListBox";
import type { PopoverSide } from "@/components/core/Popover";
import type { MotionValue } from "@/components/core/utils/slotMotion";
import type { FloatingAlign } from "@/components/core/Tooltip/tooltipPosition";

export type SelectOption = {
  value: string;
  label: ReactNode;
  hint?: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
};

export type SelectClassNames = {
  root?: string;
  label?: string;
  triggerGroup?: string;
  value?: string;
  trigger?: string;
  triggerIcon?: string;
  popover?: string;
  popoverBody?: string;
  listBox?: string;
  listBoxItem?: string;
  listBoxLabel?: string;
  listBoxHint?: string;
  listBoxIcon?: string;
  listBoxEmpty?: string;
  listBoxHeader?: string;
  listBoxHeaderText?: string;
  hint?: string;
  error?: string;
};

export type SelectPartMotion = {
  hoverIn?: MotionValue;
  hoverOut?: MotionValue;
  pressIn?: MotionValue;
  pressOut?: MotionValue;
  enter?: MotionValue;
  leave?: MotionValue;
};

export type SelectMotion = {
  triggerGroup?: SelectPartMotion;
  value?: SelectPartMotion;
  trigger?: SelectPartMotion;
  triggerIcon?: SelectPartMotion;
};

export type SelectProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  id?: string;
  name?: string;
  required?: boolean;
  status?: InputStatus;
  size?: InputSize;
  options?: SelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  variant?: InputVariant;
  disabled?: boolean;
  placeholder?: string;
  menuMaxHeight?: string;
  classNames?: Prettify<SelectClassNames>;
  /**
   * Per-slot motion (`triggerGroup`, `value`, `trigger`, `triggerIcon`).
   * Menu enter lives on Popover — not duplicated here.
   */
  motion?: Prettify<SelectMotion>;
};

export type SelectSimpleProps = SelectProps & {
  options: SelectOption[];
};

export type SelectFieldContextValue = {
  selectId: string;
  hintId: string;
  errorId: string;
  labelId: string;
  labelConnected: boolean;
  hintConnected: boolean;
  errorConnected: boolean;
  required: boolean;
  status: InputStatus;
  size: InputSize;
  errorMessage?: ReactNode;
};

export type SelectContextValue = SelectFieldContextValue & {
  open: boolean;
  setOpen: (open: boolean) => void;
  value: string;
  setValue: (value: string) => void;
  listId: string;
  activeValue: string | null;
  setActiveValue: (value: string | null) => void;
  anchorRef: React.RefObject<HTMLDivElement | null>;
  valueRef: React.RefObject<HTMLButtonElement | null>;
  variant: InputVariant;
  disabled: boolean;
  placeholder: string;
  menuMaxHeight: string;
  options: SelectOption[];
  optionValues: string[];
  formValueRef?: (node: HTMLButtonElement | null) => void;
  formOnBlur?: () => void;
};

export type SelectClassNamesProviderProps = {
  classNames?: Prettify<SelectClassNames>;
  children: ReactNode;
};

export type SelectTriggerGroupProps = HTMLAttributes<HTMLDivElement> & {
  groupSegment?: ButtonGroupSegment;
  /** Part motion for the `triggerGroup` host slot. Root `motion.triggerGroup` still applies. */
  motion?: Prettify<SelectPartMotion>;
};

export type SelectValueProps = HTMLAttributes<HTMLButtonElement> & {
  placeholder?: string;
  motion?: Prettify<SelectPartMotion>;
};

export type SelectTriggerProps = HTMLAttributes<HTMLButtonElement> & {
  motion?: Prettify<SelectPartMotion>;
};

export type UseSelectShellAnimationsProps = {
  shellRef: RefObject<HTMLDivElement | null>;
  disabled: boolean;
  variant: InputVariant;
  groupSegment: unknown;
  motion?: SelectPartMotion;
  pointerInsideRef: RefObject<boolean>;
};

export type SelectPopoverProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
  /** Preferred side relative to the trigger. Default: `bottom`. */
  side?: PopoverSide;
  /** Panel alignment relative to the trigger. Default: `start` when matching width. */
  align?: FloatingAlign;
  offset?: number;
  /** Props forwarded to the inner `ListBox` (controlled selection props are owned by Select). */
  listBoxProps?: Omit<
    ListBoxProps,
    | "children"
    | "value"
    | "defaultValue"
    | "onValueChange"
    | "activeValue"
    | "onActiveValueChange"
    | "listId"
  >;
};

export type SelectHintProps = HTMLAttributes<HTMLParagraphElement> & {
  children?: ReactNode;
  status?: Exclude<InputStatus, "danger"> | "default";
};

export type SelectErrorProps = HTMLAttributes<HTMLParagraphElement> & {
  children?: ReactNode;
};

export type UseSelectRootStateProps = SelectProps;
