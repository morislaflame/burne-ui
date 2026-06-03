import { useId, type HTMLAttributes, type ReactNode } from "react";

import { FieldError, FieldHint, FieldRoot } from "@/components/core/Field";
import { fieldErrorId, fieldHintId } from "@/components/core/Field/fieldA11y";
import { FieldLabelContext } from "@/components/core/Label/fieldLabelContext";
import { Label } from "@/components/core/Label";
import { hasCompoundChild } from "@/components/core/utils/hasCompoundChild";
import { hasCompoundChildren } from "@/components/core/utils/hasCompoundChildren";
import { cn } from "@/utils/cn";

import type { InputSize, InputStatus } from "@/components/core/Input";
import { SelectorControl, type SelectorControlProps } from "./Selector";
import { SelectorFieldContext, useSelectorFieldContext } from "./selectorFieldContext";

export type SelectorRootProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  id?: string;
  isRequired?: boolean;
  status?: InputStatus;
  size?: InputSize;
};

export type SelectorSimpleProps = SelectorRootProps & SelectorControlProps;

export function SelectorRoot({
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
}: SelectorRootProps & Partial<SelectorControlProps>) {
  const autoId = useId();
  const selectorId = idProp ?? `selector-${autoId}`;
  const hintId = fieldHintId(selectorId);
  const errorId = fieldErrorId(selectorId);
  const labelId = `${selectorId}-label`;
  const isCompound = hasCompoundChildren(children);
  const hasHint = hint != null || (isCompound && hasCompoundChild(children, SelectorHint));
  const hasError = error != null || (isCompound && hasCompoundChild(children, SelectorError));

  const body = isCompound ? (
    children
  ) : (
    <>
      {label != null ? <Label id={labelId}>{label}</Label> : null}
      <SelectorControl id={selectorId} size={size} status={status} {...(rest as SelectorControlProps)} />
      {hint != null ? <SelectorHint>{hint}</SelectorHint> : null}
      {error != null ? <SelectorError>{error}</SelectorError> : null}
    </>
  );

  return (
    <SelectorFieldContext.Provider
      value={{
        selectorId,
        hintId,
        errorId,
        labelId,
        hintConnected: hasHint,
        errorConnected: hasError,
        isRequired,
        status,
        size,
      }}
    >
      <FieldLabelContext.Provider value={{ controlId: selectorId, labelId, isRequired }}>
        <FieldRoot className={cn(className)}>{body}</FieldRoot>
      </FieldLabelContext.Provider>
    </SelectorFieldContext.Provider>
  );
}

export type SelectorHintProps = HTMLAttributes<HTMLParagraphElement> & {
  children?: ReactNode;
  status?: Exclude<InputStatus, "danger"> | "default";
};

export function SelectorHint({
  children,
  status,
  className,
  id: idProp,
  ...rest
}: SelectorHintProps) {
  const field = useSelectorFieldContext();
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

SelectorRoot.displayName = "Selector";
SelectorHint.displayName = "Selector.Hint";

export type SelectorErrorProps = HTMLAttributes<HTMLParagraphElement> & {
  children?: ReactNode;
};

export function SelectorError({ children, className, id: idProp, ...rest }: SelectorErrorProps) {
  const field = useSelectorFieldContext();
  return (
    <FieldError id={idProp ?? field.errorId} className={className} {...rest}>
      {children}
    </FieldError>
  );
}

SelectorError.displayName = "Selector.Error";
