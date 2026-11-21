import { useCallback, useId, useMemo, useRef, useState, type ReactNode } from "react";

import { useFormFieldBinding } from "@/components/composite/Form/useFormFieldBinding";
import type { InputSize, InputVariant } from "@/components/core/Input";
import { useNativeFormReset } from "@/components/core/utils/fieldFormDom";
import { hasCompoundChild } from "@/components/core/utils/hasCompoundChild";
import { hasCompoundChildren } from "@/components/core/utils/hasCompoundChildren";
import { useResolvedFieldInvalid } from "@/components/core/utils/fieldInvalid";

import { pinInputDescribedBy, pinInputFieldIds } from "./pinInputA11y";
import { pinInputDelete, pinInputInsert, pinInputLength, pinInputPaste } from "./pinInputAPI";
import type { PinInputContextValue, PinInputType } from "./pinInputTypes";

export type UsePinInputRootStateProps = {
  children?: ReactNode;
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  invalid?: boolean;
  id?: string;
  name?: string;
  required?: boolean;
  size?: InputSize;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  variant?: InputVariant;
  length?: number;
  type?: PinInputType;
  mask?: boolean;
  separator?: ReactNode;
};

export function usePinInputRootState({
  children,
  label,
  hint,
  error,
  invalid,
  id,
  name,
  required = false,
  size = "base",
  disabled = false,
  readOnly = false,
  placeholder,
  value: valueProp,
  defaultValue = "",
  onValueChange,
  onComplete,
  variant = "default",
  length: lengthProp,
  type = "number",
  mask = false,
  separator,
}: UsePinInputRootStateProps) {
  const formBinding = useFormFieldBinding({
    name,
    value: valueProp,
    disabled,
    readOnly,
  });
  const reactId = useId();
  const inputId = id ?? `pin-input-${reactId}`;
  const ids = pinInputFieldIds(inputId);
  const isCompound = hasCompoundChildren(children);
  const length = pinInputLength(lengthProp);
  const explicit = valueProp !== undefined;
  const bound = formBinding.bound;
  const controlled = explicit ? valueProp : bound ? String(formBinding.value ?? "") : undefined;
  const isControlled = controlled !== undefined;

  const [internalValue, setInternalValue] = useState<string>(defaultValue);
  const [resetVersion, setResetVersion] = useState(0);
  const shellNodeRef = useRef<HTMLDivElement | null>(null);
  const value = isControlled ? controlled : internalValue;

  const onValueChangeRef = useRef(onValueChange);
  // react-doctor-disable-next-line react-doctor/no-ref-current-in-render -- latest callback without recreating setter
  onValueChangeRef.current = onValueChange;

  const setValue = useCallback(
    (next: string) => {
      if (!isControlled) setInternalValue(next);
      onValueChangeRef.current?.(next);
      if (bound) {
        formBinding.setValue(next);
      }
    },
    [bound, formBinding, isControlled],
  );

  useNativeFormReset(
    shellNodeRef,
    () => {
      setInternalValue(defaultValue);
      setResetVersion((n) => n + 1);
    },
    !isControlled,
  );

  const registerShellRef = useCallback((node: HTMLDivElement | null) => {
    shellNodeRef.current = node;
  }, []);

  const code = value.slice(0, length);
  const resolvedDisabled = Boolean(formBinding.disabled);
  const resolvedReadOnly = Boolean(formBinding.readOnly);
  const resolvedError = error ?? formBinding.error;
  const blocked = resolvedDisabled;

  const write = useCallback(
    (index: number, char: string) => {
      if (blocked || resolvedReadOnly) return index;
      const at = Math.min(Math.max(0, index), code.length, length - 1);
      const next = pinInputInsert(code, index, char, length);
      setValue(next);
      if (next.length === length && code.length < length) onComplete?.(next);
      return Math.min(at + 1, length - 1);
    },
    [blocked, code, length, onComplete, resolvedReadOnly, setValue],
  );

  const paste = useCallback(
    (index: number, text: string) => {
      if (blocked || resolvedReadOnly) return index;
      const next = pinInputPaste(code, index, text, type, length);
      setValue(next.value);
      if (next.value.length === length && code.length < length) onComplete?.(next.value);
      return next.focus;
    },
    [blocked, code, length, onComplete, resolvedReadOnly, setValue, type],
  );

  const remove = useCallback(
    (index: number) => {
      if (blocked || resolvedReadOnly) return index;
      const next = pinInputDelete(code, index);
      setValue(next.value);
      return next.focus;
    },
    [blocked, code, resolvedReadOnly, setValue],
  );

  const setFirstCellRef = formBinding.ref as (node: HTMLInputElement | null) => void;
  const notifyBlur = formBinding.onBlur;

  const labelConnected = isCompound
    ? hasCompoundChild(children, "PinInputLabel") || hasCompoundChild(children, "Label")
    : label != null;
  const hintConnected = isCompound ? hasCompoundChild(children, "PinInputHint") : hint != null;
  const errorConnected = isCompound
    ? hasCompoundChild(children, "PinInputError")
    : resolvedError != null;
  const isInvalid = useResolvedFieldInvalid({
    invalid,
    errorConnected: resolvedError != null || errorConnected,
    formInvalid: formBinding["aria-invalid"] === true,
  });
  const contextValue: PinInputContextValue = useMemo(
    () => ({
      value: code,
      length,
      type,
      mask,
      placeholder,
      separator,
      write,
      paste,
      remove,
      disabled: blocked,
      readOnly: resolvedReadOnly,
      size,
      variant,
      inputId,
      labelId: ids.labelId,
      hintId: ids.hintId,
      errorId: ids.errorId,
      label,
      hint,
      error: resolvedError,
      name: formBinding.name ?? name,
      labelled: labelConnected,
      required,
      isInvalid,
      describedBy: pinInputDescribedBy({
        hintConnected,
        errorConnected,
        hintId: ids.hintId,
        errorId: ids.errorId,
      }),
      setFirstCellRef,
      registerShellRef,
      notifyBlur,
      resetVersion,
    }),
    [
      blocked,
      code,
      errorConnected,
      formBinding.name,
      hint,
      hintConnected,
      ids.errorId,
      ids.hintId,
      ids.labelId,
      inputId,
      isInvalid,
      label,
      length,
      labelConnected,
      mask,
      name,
      notifyBlur,
      paste,
      placeholder,
      registerShellRef,
      remove,
      required,
      resetVersion,
      resolvedError,
      resolvedReadOnly,
      separator,
      setFirstCellRef,
      size,
      type,
      variant,
      write,
    ],
  );

  return {
    isCompound,
    contextValue,
    fieldLabel: {
      controlId: inputId,
      labelId: ids.labelId,
      required,
    },
  };
}
