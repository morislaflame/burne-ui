import { useCallback, useId, useMemo, useRef, useState, type ReactNode } from "react";

import { useFormFieldBinding } from "@/components/composite/Form/useFormFieldBinding";
import type { InputSize, InputVariant } from "@/components/core/Input";
import { useNativeFormReset } from "@/components/core/utils/fieldFormDom";
import { hasCompoundChild } from "@/components/core/utils/hasCompoundChild";
import { hasCompoundChildren } from "@/components/core/utils/hasCompoundChildren";
import { useResolvedFieldInvalid } from "@/components/core/utils/fieldInvalid";

import { numberInputDescribedBy, numberInputFieldIds } from "./numberInputA11y";
import {
  clampNumberInput,
  formatNumberInput,
  isNumberInputDraft,
  numberInputCanStep,
  numberInputEditText,
  numberInputLocale,
  numberInputStep,
  parseFormNumber,
  parseNumberInputComplete,
  snapNumberInput,
  stepNumberInput,
} from "./numberInputAPI";

export type UseNumberInputRootStateProps = {
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
  value?: number | null;
  defaultValue?: number | null;
  onValueChange?: (value: number | null) => void;
  variant?: InputVariant;
  min?: number;
  max?: number;
  step?: number;
  formatOptions?: Intl.NumberFormatOptions;
  locale?: string;
};

export function useNumberInputRootState({
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
  defaultValue = null,
  onValueChange,
  variant = "default",
  min,
  max,
  step: stepProp,
  formatOptions,
  locale: localeProp,
}: UseNumberInputRootStateProps) {
  const locale = numberInputLocale(localeProp);
  const formBinding = useFormFieldBinding({
    name,
    value: valueProp,
    disabled,
    readOnly,
  });
  const reactId = useId();
  const inputId = id ?? `number-input-${reactId}`;
  const ids = numberInputFieldIds(inputId);
  const isCompound = hasCompoundChildren(children);
  const step = numberInputStep(stepProp);
  const explicit = valueProp !== undefined;
  const bound = formBinding.bound;
  const controlled = explicit ? valueProp : bound ? parseFormNumber(formBinding.value) : undefined;
  const isControlled = controlled !== undefined;

  const [internalValue, setInternalValue] = useState<number | null>(defaultValue);
  const value = isControlled ? controlled : internalValue;

  const onValueChangeRef = useRef(onValueChange);
  // react-doctor-disable-next-line react-doctor/no-ref-current-in-render -- latest callback without recreating setter
  onValueChangeRef.current = onValueChange;

  const setValue = useCallback(
    (next: number | null) => {
      if (!isControlled) setInternalValue(next);
      onValueChangeRef.current?.(next);
      if (bound) {
        formBinding.setValue(next ?? "");
      }
    },
    [bound, formBinding, isControlled],
  );

  const [draft, setDraft] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const pointerInsideRef = useRef(false);

  useNativeFormReset(
    inputRef,
    () => {
      setDraft(null);
      setInternalValue(defaultValue);
    },
    !isControlled,
  );

  const formRef = formBinding.ref;
  const setInputRef = useCallback(
    (node: HTMLInputElement | null) => {
      inputRef.current = node;
      formRef(node);
    },
    [formRef],
  );

  const resolvedError = error ?? formBinding.error;
  const blocked = Boolean(formBinding.disabled);
  const resolvedReadOnly = Boolean(formBinding.readOnly);

  const parsedDraft = draft != null ? parseNumberInputComplete(draft, locale) : undefined;
  const steppingFrom = parsedDraft === undefined ? value : parsedDraft;
  const canDecrement =
    !blocked && !resolvedReadOnly && numberInputCanStep(steppingFrom, -1, min, max);
  const canIncrement =
    !blocked && !resolvedReadOnly && numberInputCanStep(steppingFrom, 1, min, max);

  const commitInput = useCallback(
    (raw: string) => {
      if (blocked || resolvedReadOnly) return;
      if (!isNumberInputDraft(raw, locale)) return;
      setDraft(raw);
      const parsed = parseNumberInputComplete(raw, locale);
      if (parsed === undefined) return;
      setValue(parsed == null ? null : clampNumberInput(parsed, min, max));
    },
    [blocked, locale, max, min, resolvedReadOnly, setValue],
  );

  const beginEdit = useCallback(() => {
    if (blocked || resolvedReadOnly || draft != null) return;
    setDraft(value == null ? "" : numberInputEditText(value, locale));
  }, [blocked, draft, locale, resolvedReadOnly, value]);

  const formOnBlur = formBinding.onBlur;
  const commitBlur = useCallback(() => {
    const raw = draft;
    setDraft(null);
    if (!blocked && !resolvedReadOnly && raw != null) {
      const parsed = parseNumberInputComplete(raw, locale);
      const next =
        parsed == null || parsed === undefined ? null : snapNumberInput(parsed, step, min, max);
      if (next !== value) setValue(next);
    }
    formOnBlur();
  }, [blocked, draft, formOnBlur, locale, max, min, resolvedReadOnly, setValue, step, value]);

  const nudge = useCallback(
    (direction: 1 | -1) => {
      if (blocked || resolvedReadOnly) return;
      if (!numberInputCanStep(steppingFrom, direction, min, max)) return;
      const next = stepNumberInput(steppingFrom, direction, step, min, max);
      if (draft !== null) {
        setDraft(numberInputEditText(next, locale));
      }
      setValue(next);
    },
    [blocked, draft, locale, max, min, resolvedReadOnly, setValue, step, steppingFrom],
  );

  const labelConnected = isCompound
    ? hasCompoundChild(children, "NumberInputLabel") || hasCompoundChild(children, "Label")
    : label != null;
  const hintConnected = isCompound ? hasCompoundChild(children, "NumberInputHint") : hint != null;
  const errorConnected = isCompound
    ? hasCompoundChild(children, "NumberInputError")
    : resolvedError != null;
  const isInvalid = useResolvedFieldInvalid({
    invalid,
    errorConnected: resolvedError != null || errorConnected,
    formInvalid: formBinding["aria-invalid"] === true,
  });
  const text = draft ?? formatNumberInput(value, formatOptions, locale);
  const valueText = value == null ? undefined : formatNumberInput(value, formatOptions, locale);

  const contextValue = useMemo(
    () => ({
      value,
      text,
      valueText,
      beginEdit,
      nudge,
      commitInput,
      commitBlur,
      canDecrement,
      canIncrement,
      disabled: blocked,
      readOnly: resolvedReadOnly,
      placeholder,
      size,
      variant,
      min,
      max,
      step,
      inputId,
      labelId: ids.labelId,
      hintId: ids.hintId,
      errorId: ids.errorId,
      label,
      hint,
      error: resolvedError,
      name,
      required,
      isInvalid,
      labelConnected,
      hintConnected,
      errorConnected,
      describedBy: numberInputDescribedBy({
        hintConnected,
        errorConnected,
        hintId: ids.hintId,
        errorId: ids.errorId,
      }),
      inputRef,
      setInputRef,
      pointerInsideRef,
    }),
    [
      beginEdit,
      blocked,
      canDecrement,
      canIncrement,
      commitBlur,
      commitInput,
      errorConnected,
      hint,
      hintConnected,
      ids.errorId,
      ids.hintId,
      ids.labelId,
      inputId,
      isInvalid,
      label,
      labelConnected,
      max,
      min,
      name,
      nudge,
      placeholder,
      required,
      resolvedError,
      resolvedReadOnly,
      setInputRef,
      size,
      step,
      text,
      value,
      valueText,
      variant,
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
