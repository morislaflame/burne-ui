import { useId, useMemo, type HTMLAttributes, type ReactNode } from "react";

import { FieldError, FieldHint, FieldRoot } from "@/components/core/Field";
import { fieldErrorId, fieldHintId } from "@/components/core/Field/fieldA11y";
import { FieldLabelContext } from "@/components/core/Label/fieldLabelContext";
import { Label } from "@/components/core/Label";
import { hasCompoundChild } from "@/components/core/utils/hasCompoundChild";
import { hasCompoundChildren } from "@/components/core/utils/hasCompoundChildren";
import { cn } from "@/utils/cn";

import { InputControl, type InputProps } from "./Input";
import { InputFieldContext, useInputFieldContext } from "./inputFieldContext";
import type { InputSize, InputStatus } from "./Input";

export type InputRootProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  id?: string;
  isRequired?: boolean;
  status?: InputStatus;
  size?: InputSize;
};

export type InputSimpleProps = InputRootProps & InputProps;

export function InputRoot({
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
}: InputSimpleProps) {
  const autoId = useId();
  const inputId = idProp ?? `input-${autoId}`;
  const hintId = fieldHintId(inputId);
  const errorId = fieldErrorId(inputId);
  const labelId = `${inputId}-label`;
  const isCompound = hasCompoundChildren(children);
  const hasHint = hint != null || (isCompound && hasCompoundChild(children, InputHint));
  const hasError = error != null || (isCompound && hasCompoundChild(children, InputError));

  const body = isCompound ? (
    children
  ) : (
    <>
      {label != null ? <Label id={labelId}>{label}</Label> : null}
      <InputControl id={inputId} size={size} status={status} {...(rest as InputProps)} />
      {hint != null ? <InputHint>{hint}</InputHint> : null}
      {error != null ? <InputError>{error}</InputError> : null}
    </>
  );

  const fieldCtx = useMemo(
    () => ({
      inputId,
      hintId,
      errorId,
      labelId,
      hintConnected: hasHint,
      errorConnected: hasError,
      isRequired,
      status,
      size,
    }),
    [errorId, hasError, hasHint, hintId, inputId, isRequired, labelId, size, status],
  );
  const fieldLabelCtx = useMemo(
    () => ({ controlId: inputId, labelId, isRequired }),
    [inputId, isRequired, labelId],
  );

  return (
    <InputFieldContext.Provider value={fieldCtx}>
      <FieldLabelContext.Provider value={fieldLabelCtx}>
        <FieldRoot className={cn(className)}>
          {body}
        </FieldRoot>
      </FieldLabelContext.Provider>
    </InputFieldContext.Provider>
  );
}

export type InputHintProps = HTMLAttributes<HTMLParagraphElement> & {
  children?: ReactNode;
  status?: Exclude<InputStatus, "danger"> | "default";
};

export function InputHint({ children, status, className, id: idProp, ...rest }: InputHintProps) {
  const field = useInputFieldContext();
  const hintStatus =
    status ??
    (field.status === "danger"
      ? "default"
      : field.status === "default"
        ? "default"
        : field.status);

  return (
    <FieldHint
      id={idProp ?? field.hintId}
      status={hintStatus}
      className={className}
      {...rest}
    >
      {children}
    </FieldHint>
  );
}

InputHint.displayName = "InputHint";

export type InputErrorProps = HTMLAttributes<HTMLParagraphElement> & {
  children?: ReactNode;
};

export function InputError({ children, className, id: idProp, ...rest }: InputErrorProps) {
  const field = useInputFieldContext();
  return (
    <FieldError id={idProp ?? field.errorId} className={className} {...rest}>
      {children}
    </FieldError>
  );
}

InputError.displayName = "InputError";
