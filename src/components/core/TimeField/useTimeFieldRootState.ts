import { useId, useMemo } from "react";

import { fieldErrorId, fieldHintId } from "@/components/core/Field/fieldA11y";
import { hasCompoundChild } from "@/components/core/utils/hasCompoundChild";
import { hasCompoundChildren } from "@/components/core/utils/hasCompoundChildren";

import type {
  TimeFieldFieldContextValue,
  UseTimeFieldRootStateProps,
} from "./timeFieldTypes";

export function useTimeFieldRootState({
  children,
  label,
  hint,
  error,
  id: idProp,
  required = false,
  status = "default",
  size = "base",
  variant = "default",
  compact = false,
}: UseTimeFieldRootStateProps) {
  const autoId = useId();
  const fieldId = idProp ?? `timefield-${autoId}`;
  const hintId = fieldHintId(fieldId);
  const errorId = fieldErrorId(fieldId);
  const labelId = `${fieldId}-label`;
  const { isCompound, hasLabel, hasHint, hasError } = useMemo(() => {
    const compound = hasCompoundChildren(children);
    return {
      isCompound: compound,
      hasLabel: label != null || (compound && hasCompoundChild(children, "Label")),
      hasHint: hint != null || (compound && hasCompoundChild(children, "TimeFieldHint")),
      hasError: error != null || (compound && hasCompoundChild(children, "TimeFieldError")),
    };
  }, [children, error, hint, label]);

  const fieldCtx: TimeFieldFieldContextValue = useMemo(
    () => ({
      fieldId,
      labelId,
      labelConnected: hasLabel,
      hintId,
      errorId,
      hintConnected: hasHint,
      errorConnected: hasError,
      required,
      status,
      size,
      variant,
      compact,
    }),
    [
      compact,
      errorId,
      fieldId,
      hasError,
      hasHint,
      hasLabel,
      hintId,
      required,
      labelId,
      size,
      status,
      variant,
    ],
  );

  const fieldLabelCtx = useMemo(
    () => ({ labelId, required }),
    [labelId, required],
  );

  return {
    fieldCtx,
    fieldLabelCtx,
    isCompound,
    fieldId,
    label,
    hint,
    error,
    status,
    size,
    variant,
    compact,
  };
}
