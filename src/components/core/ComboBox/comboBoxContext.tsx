import { createContext, useContext, type ReactNode, type RefObject } from "react";

import type { InputSize, InputStatus, InputVariant } from "@/components/core/Input";

export type ComboBoxOption = {
  value: string;
  label: ReactNode;
  hint?: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  filterText?: string;
};

export type ComboBoxFieldContextValue = {
  comboBoxId: string;
  hintId: string;
  errorId: string;
  labelId: string;
  hintConnected: boolean;
  errorConnected: boolean;
  isRequired: boolean;
  status: InputStatus;
  size: InputSize;
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
  anchorRef: RefObject<HTMLDivElement | null>;
  inputRef: RefObject<HTMLInputElement | null>;
  variant: InputVariant;
  disabled: boolean;
  placeholder: string;
  menuMaxHeight: string;
  options: ComboBoxOption[];
  filteredValues: string[];
};

const ComboBoxFieldContext = createContext<ComboBoxFieldContextValue | null>(null);
const ComboBoxContext = createContext<ComboBoxContextValue | null>(null);

export function useComboBoxFieldContext() {
  const ctx = useContext(ComboBoxFieldContext);
  if (!ctx) throw new Error("ComboBox compound-части должны быть внутри <ComboBox>.");
  return ctx;
}

export function useOptionalComboBoxFieldContext() {
  return useContext(ComboBoxFieldContext);
}

export function useComboBoxContext() {
  const ctx = useContext(ComboBoxContext);
  if (!ctx) throw new Error("ComboBox.* должны быть внутри <ComboBox>.");
  return ctx;
}

export function useOptionalComboBoxContext() {
  return useContext(ComboBoxContext);
}

export { ComboBoxFieldContext, ComboBoxContext };
