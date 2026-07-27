import { useId, useMemo } from "react";

import { fieldErrorId, fieldHintId } from "@/components/core/Field/fieldA11y";
import { hasCompoundChild } from "@/components/core/utils/hasCompoundChild";
import { hasCompoundChildren } from "@/components/core/utils/hasCompoundChildren";

import type { TextAreaFieldContextValue, UseTextAreaRootStateProps } from "./textAreaTypes";

export function useTextAreaRootState({
  children,
  label,
  hint,
  error,
  id: idProp,
  required = false,
  status = "default",
  size = "base",
}: UseTextAreaRootStateProps) {
  const autoId = useId();
  const textareaId = idProp ?? `textarea-${autoId}`;
  const hintId = fieldHintId(textareaId);
  const errorId = fieldErrorId(textareaId);
  const labelId = `${textareaId}-label`;
  const { isCompound, hasHint, hasError } = useMemo(() => {
    const compound = hasCompoundChildren(children);
    return {
      isCompound: compound,
      hasHint: hint != null || (compound && hasCompoundChild(children, "TextAreaHint")),
      hasError: error != null || (compound && hasCompoundChild(children, "TextAreaError")),
    };
  }, [children, error, hint]);

  const fieldCtx: TextAreaFieldContextValue = useMemo(
    () => ({
      textareaId,
      hintId,
      errorId,
      labelId,
      hintConnected: hasHint,
      errorConnected: hasError,
      required,
      status,
      size,
    }),
    [errorId, hasError, hasHint, hintId, required, labelId, size, status, textareaId],
  );

  const fieldLabelCtx = useMemo(
    () => ({ controlId: textareaId, labelId, required }),
    [required, labelId, textareaId],
  );

  return {
    fieldCtx,
    fieldLabelCtx,
    isCompound,
    textareaId,
    label,
    hint,
    error,
    status,
    size,
  };
}
