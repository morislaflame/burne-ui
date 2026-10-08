import { useCallback, useId, useMemo, type ReactNode } from "react";

import { useOptionalFormBindingContext } from "@/components/composite/Form/formContext";
import type { InputSize, InputStatus, InputVariant } from "@/components/core/Input";
import { hasCompoundChild } from "@/components/core/utils/hasCompoundChild";
import { hasCompoundChildren } from "@/components/core/utils/hasCompoundChildren";
import { useControllableState } from "@/components/core/utils/useControllableState";
import { useResolvedFieldInvalid, visualStatusForInvalid } from "@/components/core/utils/fieldInvalid";

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
  status?: InputStatus;
  size?: InputSize;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
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
  status = "default",
  size = "base",
  disabled = false,
  readOnly = false,
  placeholder,
  values: valuesProp,
  defaultValues = [],
  onValuesChange,
  variant = "default",
  max,
}: UseTagsInputRootStateProps) {
  const form = useOptionalFormBindingContext();
  const reactId = useId();
  const inputId = id ?? `tags-input-${reactId}`;
  const ids = tagsInputFieldIds(inputId);
  const isCompound = hasCompoundChildren(children);
  const explicit = valuesProp !== undefined;
  const bound = form != null && name != null && !explicit;
  const formRaw = bound && name ? form.getValue(name) : undefined;
  const controlled = explicit ? valuesProp : bound ? tagsFromFormValue(formRaw) : undefined;

  const [values, setValues] = useControllableState<string[]>({
    value: controlled,
    defaultValue: defaultValues,
    onChange: (next) => {
      onValuesChange?.(next);
      if (name && form) {
        form.setValue(name, next, { shouldValidate: form.validateMode === "onChange" });
      }
    },
  });

  const blocked = disabled || readOnly;

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

  const labelConnected = isCompound ? hasCompoundChild(children, "TagsInputLabel") : label != null;
  const hintConnected = isCompound ? hasCompoundChild(children, "TagsInputHint") : hint != null;
  const errorConnected = isCompound ? hasCompoundChild(children, "TagsInputError") : error != null;
  const isInvalid = useResolvedFieldInvalid({
    invalid,
    errorConnected: error != null || errorConnected,
  });
  const paintedStatus = visualStatusForInvalid(status, isInvalid, "default");

  const contextValue: TagsInputContextValue = useMemo(
    () => ({
      values,
      append,
      remove,
      removeLast,
      disabled,
      readOnly,
      atMax: max != null && values.length >= max,
      size,
      variant,
      status: paintedStatus,
      placeholder,
      inputId,
      labelId: ids.labelId,
      hintId: ids.hintId,
      errorId: ids.errorId,
      label,
      hint,
      error,
      name,
      labelled: labelConnected,
      required,
      isInvalid,
      describedBy: tagsInputDescribedBy({
        hintConnected,
        errorConnected,
        hintId: ids.hintId,
        errorId: ids.errorId,
      }),
    }),
    [
      append,
      disabled,
      error,
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
      name,
      paintedStatus,
      placeholder,
      readOnly,
      remove,
      removeLast,
      required,
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
