import "../utils/glossInteractive.css";

import { useOptionalFormBindingContext } from "@/components/composite/Form/formContext";
import { FieldRoot } from "@/components/core/Field";
import { FieldLabelContext } from "@/components/core/Label";

import { mergeInputSlotClass } from "./inputAPI";
import {
  InputClassNamesProvider,
  InputFieldProvider,
} from "./inputContext";
import { InputSimpleBody } from "./inputParts";
import type { InputSimpleProps } from "./inputTypes";
import { useInputRootState } from "./useInputRootState";

export type {
  InputClassNames,
  InputErrorProps,
  InputHintProps,
  InputProps,
  InputRootProps,
  InputSimpleProps,
  InputSize,
  InputStatus,
  InputVariant,
} from "./inputTypes";

export { InputControl, InputError, InputHint } from "./inputParts";

export function InputRoot({
  children,
  label,
  hint,
  error,
  className,
  classNames,
  id: idProp,
  isRequired = false,
  status = "default",
  size = "base",
  ...rest
}: InputSimpleProps) {
  const formCtx = useOptionalFormBindingContext();
  const fieldName = typeof rest.name === "string" ? rest.name : undefined;
  const formError = fieldName ? formCtx?.getError(fieldName) : undefined;
  const resolvedError = error ?? formError;
  const resolvedStatus = status === "default" && formError ? "danger" : status;
  const resolvedSize = size ?? formCtx?.size ?? "base";

  const state = useInputRootState({
    children,
    label,
    hint,
    error: resolvedError,
    id: idProp,
    isRequired,
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
          <FieldRoot className={mergeInputSlotClass(classNames?.root, className)}>
            {body}
          </FieldRoot>
        </FieldLabelContext.Provider>
      </InputClassNamesProvider>
    </InputFieldProvider>
  );
}
