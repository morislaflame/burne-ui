import "../utils/glossInteractive.css";

import { useOptionalFormBindingContext } from "@/components/composite/Form/formContext";
import { Field } from "@/components/core/Field";
import { FieldLabelContext } from "@/components/core/Label";

import { InputClassNamesProvider, InputFieldProvider } from "./inputContext";
import { InputSimpleBody } from "./inputParts";
import type { InputSimpleProps } from "./inputTypes";
import { useInputRootState } from "./useInputRootState";

import { cn } from "@/utils/cn";

export type {
  InputClassNames,
  InputErrorProps,
  InputHintProps,
  InputControlProps,
  InputProps,
  InputSimpleProps,
  InputSize,
  InputStatus,
  InputVariant,
} from "./inputTypes";

export { InputControl, InputError, InputHint, InputLabel } from "./inputParts";

export function InputRoot({
  children,
  label,
  hint,
  error,
  className,
  classNames,
  id: idProp,
  required = false,
  status = "default",
  size = "base",
  ...rest
}: InputSimpleProps) {
  const formCtx = useOptionalFormBindingContext();
  const fieldName = typeof rest.name === "string" ? rest.name : undefined;
  const formError = fieldName ? formCtx?.getError(fieldName) : undefined;
  const resolvedError = error ?? formError;
  const resolvedStatus = status === "default" && formError ? "danger" : status;
  const resolvedSize = size ?? "base";

  const state = useInputRootState({
    children,
    label,
    hint,
    error: resolvedError,
    id: idProp,
    required,
    status: resolvedStatus,
    size: resolvedSize,
  });

  const body = state.isCompound ? (
    children
  ) : (
    <InputSimpleBody
      label={state.label}
      hint={state.hint}
      error={state.error}
      inputId={state.inputId}
      labelId={state.fieldCtx.labelId}
      size={state.size}
      status={state.status}
      controlProps={rest}
    />
  );

  return (
    <InputFieldProvider value={state.fieldCtx}>
      <InputClassNamesProvider classNames={classNames}>
        <FieldLabelContext.Provider value={state.fieldLabelCtx}>
          <Field className={cn(classNames?.root, className)}>
            {body}
          </Field>
        </FieldLabelContext.Provider>
      </InputClassNamesProvider>
    </InputFieldProvider>
  );
}
