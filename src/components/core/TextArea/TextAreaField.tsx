import { useId, useMemo, type HTMLAttributes, type ReactNode } from "react";

import { FieldError, FieldHint, FieldRoot } from "@/components/core/Field";
import { fieldErrorId, fieldHintId } from "@/components/core/Field/fieldA11y";
import { FieldLabelContext } from "@/components/core/Label/fieldLabelContext";
import { Label } from "@/components/core/Label";
import { hasCompoundChild } from "@/components/core/utils/hasCompoundChild";
import { hasCompoundChildren } from "@/components/core/utils/hasCompoundChildren";
import { cn } from "@/utils/cn";

import { TextAreaControl, type TextAreaProps } from "./TextArea";
import { TextAreaFieldContext, useTextAreaFieldContext } from "./textareaFieldContext";
import type { TextAreaSize, TextAreaStatus } from "./TextArea";

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

export type TextAreaHintProps = HTMLAttributes<HTMLParagraphElement> & {
  children?: ReactNode;
  status?: Exclude<TextAreaStatus, "danger"> | "default";
};

export function TextAreaHint({ children, status, className, id: idProp, ...rest }: TextAreaHintProps) {
  const field = useTextAreaFieldContext();
  const hintStatus =
    status ??
    (field.status === "danger"
      ? "default"
      : field.status === "default"
        ? "default"
        : field.status);

  return (
    <FieldHint id={idProp ?? field.hintId} status={hintStatus} className={className} {...rest}>
      {children}
    </FieldHint>
  );
}

TextAreaHint.displayName = "TextAreaHint";

export type TextAreaErrorProps = HTMLAttributes<HTMLParagraphElement> & {
  children?: ReactNode;
};

export function TextAreaError({ children, className, id: idProp, ...rest }: TextAreaErrorProps) {
  const field = useTextAreaFieldContext();
  return (
    <FieldError id={idProp ?? field.errorId} className={className} {...rest}>
      {children}
    </FieldError>
  );
}

TextAreaError.displayName = "TextAreaError";
