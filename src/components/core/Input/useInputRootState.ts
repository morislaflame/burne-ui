import { useId, useMemo } from "react";

import { fieldErrorId, fieldHintId } from "@/components/core/Field/fieldA11y";
import { hasCompoundChild } from "@/components/core/utils/hasCompoundChild";
import { hasCompoundChildren } from "@/components/core/utils/hasCompoundChildren";

import type { InputFieldContextValue, UseInputRootStateProps } from "./inputTypes";

export function useInputRootState({
  children,
  label,
  hint,
  error,
  id: idProp,
  required = false,
  status = "default",
  size = "base",
}: UseInputRootStateProps) {
  const autoId = useId();
  const inputId = idProp ?? `input-${autoId}`;
  const hintId = fieldHintId(inputId);
  const errorId = fieldErrorId(inputId);
  const labelId = `${inputId}-label`;
  const isCompound = hasCompoundChildren(children);

  const hasHint =
    hint != null ||
    (isCompound && hasCompoundChild(children, "InputHint"));
  const hasError =
    error != null ||
    (isCompound && hasCompoundChild(children, "InputError"));

  const fieldCtx: InputFieldContextValue = useMemo(
    () => ({
      inputId,
      hintId,
      errorId,
      labelId,
      hintConnected: hasHint,
      errorConnected: hasError,
      required,
      status,
      size,
    }),
    [errorId, hasError, hasHint, hintId, inputId, required, labelId, size, status],
  );

  const fieldLabelCtx = useMemo(
    () => ({ controlId: inputId, labelId, required }),
    [inputId, required, labelId],
  );

  return {
    fieldCtx,
    fieldLabelCtx,
    isCompound,
    inputId,
    label,
    hint,
    error,
    status,
    size,
  };
}
