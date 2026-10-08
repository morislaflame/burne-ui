import { useCallback, useId, useMemo, type ReactNode } from "react";

import { useOptionalFormBindingContext } from "@/components/composite/Form/formContext";
import type { InputSize, InputStatus, InputVariant } from "@/components/core/Input";
import { hasCompoundChild } from "@/components/core/utils/hasCompoundChild";
import { hasCompoundChildren } from "@/components/core/utils/hasCompoundChildren";
import { useControllableState } from "@/components/core/utils/useControllableState";
import { useResolvedFieldInvalid, visualStatusForInvalid } from "@/components/core/utils/fieldInvalid";

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
  status?: InputStatus;
  size?: InputSize;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
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
  status = "default",
  size = "base",
  disabled = false,
  readOnly = false,
  placeholder,
  value: valueProp,
  defaultValue = "",
  onValueChange,
  variant = "default",
  length: lengthProp,
  type = "number",
  mask = false,
  separator,
}: UsePinInputRootStateProps) {
  const form = useOptionalFormBindingContext();
  const reactId = useId();
  const inputId = id ?? `pin-input-${reactId}`;
  const ids = pinInputFieldIds(inputId);
  const isCompound = hasCompoundChildren(children);
  const length = pinInputLength(lengthProp);
  const explicit = valueProp !== undefined;
  const bound = form != null && name != null && !explicit;
  const formRaw = bound && name ? form.getValue(name) : undefined;
  const controlled = explicit ? valueProp : bound ? String(formRaw ?? "") : undefined;

  const [value, setValue] = useControllableState<string>({
    value: controlled,
    defaultValue,
    onChange: (next) => {
      onValueChange?.(next);
      if (name && form) {
        form.setValue(name, next, { shouldValidate: form.validateMode === "onChange" });
      }
    },
  });

  const code = value.slice(0, length);
  const blocked = disabled;

  const write = useCallback(
    (index: number, char: string) => {
      if (blocked || readOnly) return index;
      const next = pinInputInsert(code, index, char, length);
      setValue(next);
      return Math.min(index + 1, length - 1);
    },
    [blocked, code, length, readOnly, setValue],
  );

  const paste = useCallback(
    (index: number, text: string) => {
      if (blocked || readOnly) return index;
      const next = pinInputPaste(code, index, text, type, length);
      setValue(next.value);
      return next.focus;
    },
    [blocked, code, length, readOnly, setValue, type],
  );

  const remove = useCallback(
    (index: number) => {
      if (blocked || readOnly) return index;
      const next = pinInputDelete(code, index);
      setValue(next.value);
      return next.focus;
    },
    [blocked, code, readOnly, setValue],
  );

  const labelConnected = isCompound ? hasCompoundChild(children, "PinInputLabel") : label != null;
  const hintConnected = isCompound ? hasCompoundChild(children, "PinInputHint") : hint != null;
  const errorConnected = isCompound ? hasCompoundChild(children, "PinInputError") : error != null;
  const isInvalid = useResolvedFieldInvalid({
    invalid,
    errorConnected: error != null || errorConnected,
  });
  const paintedStatus = visualStatusForInvalid(status, isInvalid, "default");

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
      readOnly,
      size,
      variant,
      status: paintedStatus,
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
      describedBy: pinInputDescribedBy({
        hintConnected,
        errorConnected,
        hintId: ids.hintId,
        errorId: ids.errorId,
      }),
    }),
    [
      blocked,
      code,
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
      length,
      labelConnected,
      mask,
      name,
      paintedStatus,
      paste,
      placeholder,
      readOnly,
      remove,
      required,
      separator,
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
