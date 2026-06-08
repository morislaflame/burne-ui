import { useId, useMemo, type HTMLAttributes, type ReactNode } from "react";

import { FieldRoot } from "@/components/core/Field";
import { fieldErrorId, fieldHintId } from "@/components/core/Field/fieldA11y";
import { FieldLabelContext } from "@/components/core/Label/fieldLabelContext";
import { Label } from "@/components/core/Label";
import { hasCompoundChild } from "@/components/core/utils/hasCompoundChild";
import { hasCompoundChildren } from "@/components/core/utils/hasCompoundChildren";
import { cn } from "@/utils/cn";

import { TextAreaControl, type TextAreaProps } from "./TextArea";
import { TextAreaError } from "./textAreaError";
import { TextAreaFieldContext } from "./textareaFieldContext";
import { TextAreaHint } from "./textAreaHint";
import type { TextAreaSize, TextAreaStatus } from "./TextArea";

export type { TextAreaErrorProps } from "./textAreaError";
export type { TextAreaHintProps } from "./textAreaHint";
export { TextAreaError } from "./textAreaError";
export { TextAreaHint } from "./textAreaHint";

export type TextAreaRootProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  id?: string;
  isRequired?: boolean;
  status?: TextAreaStatus;
  size?: TextAreaSize;
};

export type TextAreaSimpleProps = TextAreaRootProps & TextAreaProps;

export function TextAreaRoot({
  children,
  label,
  hint,
  error,
  className,
  id: idProp,
  isRequired = false,
  status = "default",
  size = "base",
  ...rest
}: TextAreaSimpleProps) {
  const autoId = useId();
  const textareaId = idProp ?? `textarea-${autoId}`;
  const hintId = fieldHintId(textareaId);
  const errorId = fieldErrorId(textareaId);
  const labelId = `${textareaId}-label`;
  const isCompound = hasCompoundChildren(children);
  const hasHint = hint != null || (isCompound && hasCompoundChild(children, TextAreaHint));
  const hasError = error != null || (isCompound && hasCompoundChild(children, TextAreaError));

  const body = isCompound ? (
    children
  ) : (
    <>
      {label != null ? <Label id={labelId}>{label}</Label> : null}
      <TextAreaControl id={textareaId} size={size} status={status} {...(rest as TextAreaProps)} />
      {hint != null ? <TextAreaHint>{hint}</TextAreaHint> : null}
      {error != null ? <TextAreaError>{error}</TextAreaError> : null}
    </>
  );

  const fieldCtx = useMemo(
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

  return (
    <TextAreaFieldContext.Provider value={fieldCtx}>
      <FieldLabelContext.Provider value={fieldLabelCtx}>
        <FieldRoot className={cn(className)}>{body}</FieldRoot>
      </FieldLabelContext.Provider>
    </TextAreaFieldContext.Provider>
  );
}
