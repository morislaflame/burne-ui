import type { HTMLAttributes, ReactNode } from "react";

import type { ButtonGroupSegment } from "@/components/composite/ButtonGroup/buttonGroupTypes";
import type { InputSize, InputStatus, InputVariant } from "@/components/core/Input";

export type SelectOption = {
  value: string;
  label: ReactNode;
  hint?: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
};

export type SelectClassNames = {
  root?: string;
  triggerGroup?: string;
  value?: string;
  trigger?: string;
  triggerIcon?: string;
  popover?: string;
  popoverBody?: string;
  listBox?: string;
  hint?: string;
  error?: string;
};

export type SelectRootProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  id?: string;
  name?: string;
  isRequired?: boolean;
  status?: InputStatus;
  size?: InputSize;
  options?: SelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  variant?: InputVariant;
  disabled?: boolean;
  placeholder?: string;
  menuMaxHeight?: string;
  classNames?: SelectClassNames;
};

export type SelectSimpleProps = SelectRootProps & {
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
  isRequired: boolean;
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
  classNames?: SelectClassNames;
  children: ReactNode;
};

export type SelectTriggerGroupProps = HTMLAttributes<HTMLDivElement> & {
  groupSegment?: ButtonGroupSegment;
};

export type SelectValueProps = HTMLAttributes<HTMLButtonElement> & {
  placeholder?: string;
};

export type SelectTriggerProps = HTMLAttributes<HTMLButtonElement>;

export type SelectPopoverProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
  offset?: number;
};

export type SelectHintProps = HTMLAttributes<HTMLParagraphElement> & {
  children?: ReactNode;
  status?: Exclude<InputStatus, "danger"> | "default";
};

export type SelectErrorProps = HTMLAttributes<HTMLParagraphElement> & {
  children?: ReactNode;
};

export type UseSelectRootStateProps = SelectRootProps;

export type RunSelectOpenAfterSqueezeOptions = {
  anchorRef: React.RefObject<HTMLDivElement | null>;
  disabled: boolean;
  isGloss: boolean;
  groupSegment?: ButtonGroupSegment;
  setOpen: (open: boolean) => void;
  onOpened?: () => void;
};
