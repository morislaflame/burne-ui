import { useCallback, useId, useMemo, useRef, useState, type ReactNode } from "react";

import { useFormFieldBinding } from "@/components/composite/Form/useFormFieldBinding";
import type { InputSize, InputVariant } from "@/components/core/Input";
import { useNativeFormReset } from "@/components/core/utils/fieldFormDom";
import { hasCompoundChild } from "@/components/core/utils/hasCompoundChild";
import { hasCompoundChildren } from "@/components/core/utils/hasCompoundChildren";
import { useResolvedFieldInvalid } from "@/components/core/utils/fieldInvalid";

import { tagsInputDescribedBy, tagsInputFieldIds } from "./tagsInputA11y";
import { tagsFromFormValue, tagsInputAppend, tagsInputRemove, tagsInputRemoveLast } from "./tagsInputAPI";
import type { TagsInputContextValue } from "./tagsInputTypes";

export type UseTagsInputRootStateProps = {
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
  inputValue?: string;
  defaultInputValue?: string;
  onInputValueChange?: (value: string) => void;
  values?: string[];
  defaultValues?: string[];
  onValuesChange?: (values: string[]) => void;
  variant?: InputVariant;
  max?: number;
};

export function useTagsInputRootState({
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
  inputValue: inputValueProp,
  defaultInputValue,
  onInputValueChange,
  values: valuesProp,
  defaultValues = [],
  onValuesChange,
  variant = "default",
  max,
}: UseTagsInputRootStateProps) {
  const formBinding = useFormFieldBinding({
    name,
    value: valuesProp,
    disabled,
    readOnly,
  });
  const reactId = useId();
  const inputId = id ?? `tags-input-${reactId}`;
  const ids = tagsInputFieldIds(inputId);
  const isCompound = hasCompoundChildren(children);
  const explicit = valuesProp !== undefined;
  const bound = formBinding.bound;
  const formTags = useMemo(
    () => (bound ? tagsFromFormValue(formBinding.value) : undefined),
    [bound, formBinding.value],
  );
  const controlled = explicit ? valuesProp : formTags;
  const isValuesControlled = controlled !== undefined;

  const [internalValues, setInternalValues] = useState<string[]>(defaultValues);
  const values = isValuesControlled ? controlled : internalValues;

  const onValuesChangeRef = useRef(onValuesChange);
  // react-doctor-disable-next-line react-doctor/no-ref-current-in-render -- latest callback without recreating setter
  onValuesChangeRef.current = onValuesChange;

  const setValues = useCallback(
    (next: string[]) => {
      if (!isValuesControlled) setInternalValues(next);
      onValuesChangeRef.current?.(next);
      if (bound) {
        formBinding.setValue(next);
      }
    },
    [bound, formBinding, isValuesControlled],
  );

  const isInputControlled = inputValueProp !== undefined;
  const [internalInputValue, setInternalInputValue] = useState<string>(defaultInputValue ?? "");
  const inputValue = isInputControlled ? inputValueProp : internalInputValue;

  const onInputValueChangeRef = useRef(onInputValueChange);
  // react-doctor-disable-next-line react-doctor/no-ref-current-in-render -- latest callback without recreating setter
  onInputValueChangeRef.current = onInputValueChange;

  const setInputValue = useCallback(
    (next: string) => {
      if (!isInputControlled) setInternalInputValue(next);
      onInputValueChangeRef.current?.(next);
    },
    [isInputControlled],
  );

  const shellNodeRef = useRef<HTMLDivElement | null>(null);
  const registerShellRef = useCallback((node: HTMLDivElement | null) => {
    shellNodeRef.current = node;
  }, []);

  useNativeFormReset(
    shellNodeRef,
    () => {
      if (!isValuesControlled) setInternalValues(defaultValues);
      if (!isInputControlled) setInternalInputValue(defaultInputValue ?? "");
    },
    !isValuesControlled || !isInputControlled,
  );

  const resolvedDisabled = Boolean(formBinding.disabled);
  const resolvedReadOnly = Boolean(formBinding.readOnly);
  const resolvedError = error ?? formBinding.error;
  const blocked = resolvedDisabled || resolvedReadOnly;

  const append = useCallback(
    (incoming: readonly string[]) => {
      if (blocked) return;
      const next = tagsInputAppend(values, incoming, max);
      if (next.length === values.length && next.every((tag, index) => tag === values[index])) return;
      setValues(next);
    },
    [blocked, max, setValues, values],
  );

  const remove = useCallback(
    (value: string) => {
      if (blocked) return;
      setValues(tagsInputRemove(values, value));
    },
    [blocked, setValues, values],
  );

  const removeLast = useCallback(() => {
    if (blocked || values.length === 0) return;
    setValues(tagsInputRemoveLast(values));
  }, [blocked, setValues, values]);

  const setInputNodeRef = formBinding.ref as (node: HTMLInputElement | null) => void;
  const notifyBlur = formBinding.onBlur;

  const labelConnected = isCompound
    ? hasCompoundChild(children, "TagsInputLabel") || hasCompoundChild(children, "Label")
    : label != null;
  const hintConnected = isCompound ? hasCompoundChild(children, "TagsInputHint") : hint != null;
  const errorConnected = isCompound
    ? hasCompoundChild(children, "TagsInputError")
    : resolvedError != null;
  const isInvalid = useResolvedFieldInvalid({
    invalid,
    errorConnected: resolvedError != null || errorConnected,
    formInvalid: formBinding["aria-invalid"] === true,
  });
  const contextValue: TagsInputContextValue = useMemo(
    () => ({
      values,
      append,
      remove,
      removeLast,
      disabled: resolvedDisabled,
      readOnly: resolvedReadOnly,
      atMax: max != null && values.length >= max,
      size,
      variant,
      placeholder,
      inputValue,
      setInputValue,
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
      describedBy: tagsInputDescribedBy({
        hintConnected,
        errorConnected,
        hintId: ids.hintId,
        errorId: ids.errorId,
      }),
      setInputNodeRef,
      registerShellRef,
      notifyBlur,
    }),
    [
      append,
      errorConnected,
      formBinding.name,
      hint,
      hintConnected,
      ids.errorId,
      ids.hintId,
      ids.labelId,
      inputId,
      inputValue,
      isInvalid,
      label,
      labelConnected,
      max,
      name,
      notifyBlur,
      placeholder,
      registerShellRef,
      remove,
      removeLast,
      required,
      resolvedDisabled,
      resolvedError,
      resolvedReadOnly,
      setInputNodeRef,
      setInputValue,
      size,
      values,
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
