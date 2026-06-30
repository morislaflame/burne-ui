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
  isRequired = false,
  status = "default",
  size = "base",
}: UseTextAreaRootStateProps) {
  const autoId = useId();
  const textareaId = idProp ?? `textarea-${autoId}`;
  const hintId = fieldHintId(textareaId);
  const errorId = fieldErrorId(textareaId);
  const labelId = `${textareaId}-label`;
  const isCompound = hasCompoundChildren(children);

  const hasHint =
    hint != null ||
    (isCompound && hasCompoundChild(children, "TextAreaHint"));
  const hasError =
    error != null ||
    (isCompound && hasCompoundChild(children, "TextAreaError"));

  const fieldCtx: TextAreaFieldContextValue = useMemo(
    () => ({
      textareaId,
      hintId,
      errorId,
      labelId,
      hintConnected: hasHint,
      errorConnected: hasError,
      isRequired,
      status,
      size,
    }),
    [errorId, hasError, hasHint, hintId, isRequired, labelId, size, status, textareaId],
  );

  const fieldLabelCtx = useMemo(
    () => ({ controlId: textareaId, labelId, isRequired }),
    [isRequired, labelId, textareaId],
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
