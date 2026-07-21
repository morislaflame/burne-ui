import type { HTMLAttributes, InputHTMLAttributes, ReactNode } from "react";

import type { ButtonGroupSegment } from "@/components/composite/ButtonGroup/buttonGroupTypes";
import type { InputSize, InputStatus, InputVariant } from "@/components/core/Input";

export type ComboBoxOption = {
  value: string;
  label: ReactNode;
  hint?: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  filterText?: string;
};

export type ComboBoxClassNames = {
  root?: string;
  label?: string;
  inputGroup?: string;
  input?: string;
  trigger?: string;
  triggerIcon?: string;
  popover?: string;
  popoverBody?: string;
  listBox?: string;
  hint?: string;
  error?: string;
};

export type ComboBoxRootProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  id?: string;
  name?: string;
  isRequired?: boolean;
  status?: InputStatus;
  size?: InputSize;
  options?: ComboBoxOption[];
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
  classNames?: ComboBoxClassNames;
};

export type ComboBoxSimpleProps = ComboBoxRootProps & {
  options: ComboBoxOption[];
};

export type ComboBoxFieldContextValue = {
  comboBoxId: string;
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

export type ComboBoxContextValue = ComboBoxFieldContextValue & {
  open: boolean;
  setOpen: (open: boolean) => void;
  value: string;
  setValue: (value: string) => void;
  filterQuery: string;
  setFilterQuery: (query: string) => void;
  listId: string;
  activeValue: string | null;
  setActiveValue: (value: string | null) => void;
  anchorRef: React.RefObject<HTMLDivElement | null>;
  inputRef: React.RefObject<HTMLInputElement | null>;
  variant: InputVariant;
  disabled: boolean;
  placeholder: string;
  menuMaxHeight: string;
  options: ComboBoxOption[];
  filteredValues: string[];
  formInputRef?: (node: HTMLInputElement | null) => void;
  formOnBlur?: () => void;
};

export type ComboBoxClassNamesProviderProps = {
  classNames?: ComboBoxClassNames;
  children: ReactNode;
};

export type ComboBoxInputGroupProps = HTMLAttributes<HTMLDivElement> & {
  groupSegment?: ButtonGroupSegment;
};

export type ComboBoxInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "value" | "defaultValue" | "size"
>;

export type ComboBoxTriggerProps = HTMLAttributes<HTMLButtonElement>;

export type ComboBoxPopoverProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
  offset?: number;
};

export type ComboBoxHintProps = HTMLAttributes<HTMLParagraphElement> & {
  children?: ReactNode;
  status?: Exclude<InputStatus, "danger"> | "default";
};

export type ComboBoxErrorProps = HTMLAttributes<HTMLParagraphElement> & {
  children?: ReactNode;
};

export type UseComboBoxRootStateProps = ComboBoxRootProps;

export type RunComboBoxOpenAfterSqueezeOptions = {
  anchorRef: React.RefObject<HTMLDivElement | null>;
  disabled: boolean;
  isGloss: boolean;
  groupSegment?: ButtonGroupSegment;
  setOpen: (open: boolean) => void;
  onOpened?: () => void;
  preferStandardSqueeze?: boolean;
};
