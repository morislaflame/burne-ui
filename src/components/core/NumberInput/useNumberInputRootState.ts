import { useCallback, useId, useMemo, useRef, useState, type ReactNode } from "react";

import { useOptionalFormBindingContext } from "@/components/composite/Form/formContext";
import type { InputSize, InputStatus, InputVariant } from "@/components/core/Input";
import { hasCompoundChild } from "@/components/core/utils/hasCompoundChild";
import { hasCompoundChildren } from "@/components/core/utils/hasCompoundChildren";
import { useControllableState } from "@/components/core/utils/useControllableState";
import { useResolvedFieldInvalid, visualStatusForInvalid } from "@/components/core/utils/fieldInvalid";

import { numberInputDescribedBy, numberInputFieldIds } from "./numberInputA11y";
import {
  clampNumberInput,
  formatNumberInput,
  isNumberInputDraft,
  numberInputCanStep,
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
  status?: InputStatus;
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
  status = "default",
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
}: UseNumberInputRootStateProps) {
  const form = useOptionalFormBindingContext();
  const reactId = useId();
  const inputId = id ?? `number-input-${reactId}`;
  const ids = numberInputFieldIds(inputId);
  const isCompound = hasCompoundChildren(children);
  const step = numberInputStep(stepProp);
  const explicit = valueProp !== undefined;
  const bound = form != null && name != null && !explicit;
  const formRaw = bound && name ? form.getValue(name) : undefined;
  const controlled = explicit ? valueProp : bound ? parseFormNumber(formRaw) : undefined;

  const [value, setValue] = useControllableState<number | null>({
    value: controlled,
    defaultValue,
    onChange: (next) => {
      onValueChange?.(next);
      if (name && form) {
        form.setValue(name, next ?? "", {
          shouldValidate: form.validateMode === "onChange",
        });
      }
    },
  });

  const [draft, setDraft] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const pointerInsideRef = useRef(false);

  const setInputRef = useCallback(
    (node: HTMLInputElement | null) => {
      inputRef.current = node;
      if (bound && name) form?.registerRef(name, node);
    },
    [bound, form, name],
  );

  const formMessage = name ? form?.getError(name) : undefined;
  const resolvedError = error ?? formMessage;
  const resolvedDisabled = disabled || form?.disabled === true;
  const resolvedReadOnly = readOnly || form?.readOnly === true;
  const blocked = resolvedDisabled || form?.isSubmitting === true;

  const parsedDraft = draft != null ? parseNumberInputComplete(draft) : undefined;
  const steppingFrom = parsedDraft === undefined ? value : parsedDraft;
  const canDecrement =
    !blocked && !resolvedReadOnly && numberInputCanStep(steppingFrom, -1, min, max);
  const canIncrement =
    !blocked && !resolvedReadOnly && numberInputCanStep(steppingFrom, 1, min, max);

  const commitInput = useCallback(
    (raw: string) => {
      if (blocked || resolvedReadOnly) return;
      if (!isNumberInputDraft(raw)) return;
      setDraft(raw);
      const parsed = parseNumberInputComplete(raw);
      if (parsed === undefined) return;
      setValue(parsed == null ? null : clampNumberInput(parsed, min, max));
    },
    [blocked, max, min, resolvedReadOnly, setValue],
  );

  const commitBlur = useCallback(() => {
    const raw = draft;
    setDraft(null);
    if (!blocked && !resolvedReadOnly && raw != null) {
      const parsed = parseNumberInputComplete(raw);
      const next =
        parsed == null || parsed === undefined ? null : snapNumberInput(parsed, step, min, max);
      if (next !== value) setValue(next);
    }
    if (bound && name && form) {
      form.setTouched(name, true);
      if (form.validateMode === "onBlur") form.validateField(name);
    }
  }, [blocked, bound, draft, form, max, min, name, resolvedReadOnly, setValue, step, value]);

  const nudge = useCallback(
    (direction: 1 | -1) => {
      if (blocked || resolvedReadOnly) return;
      if (!numberInputCanStep(steppingFrom, direction, min, max)) return;
      const next = stepNumberInput(steppingFrom, direction, step, min, max);
      setDraft(null);
      setValue(next);
    },
    [blocked, max, min, resolvedReadOnly, setValue, step, steppingFrom],
  );

  const labelConnected = isCompound ? hasCompoundChild(children, "NumberInputLabel") : label != null;
  const hintConnected = isCompound ? hasCompoundChild(children, "NumberInputHint") : hint != null;
  const errorConnected = isCompound
    ? hasCompoundChild(children, "NumberInputError")
    : resolvedError != null;
  const isInvalid = useResolvedFieldInvalid({
    invalid,
    errorConnected: resolvedError != null || errorConnected,
    formInvalid: false,
  });
  const paintedStatus = visualStatusForInvalid(status, isInvalid, "default");
  const text = draft ?? formatNumberInput(value);

  const contextValue = useMemo(
    () => ({
      value,
      text,
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
      status: paintedStatus,
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
      paintedStatus,
      placeholder,
      required,
      resolvedError,
      resolvedReadOnly,
      setInputRef,
      size,
      step,
      text,
      value,
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
