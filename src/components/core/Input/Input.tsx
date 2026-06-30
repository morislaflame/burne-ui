import "../utils/glossInteractive.css";

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
  const state = useInputRootState({
    children,
    label,
    hint,
    error,
    id: idProp,
    isRequired,
    status,
    size,
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
