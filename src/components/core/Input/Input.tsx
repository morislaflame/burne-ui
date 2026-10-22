import { forwardRef, type ForwardedRef, type HTMLAttributes } from "react";
 
import { useOptionalFormBindingContext } from "@/components/composite/Form/formContext";
import { Field } from "@/components/core/Field";
import { FieldLabelContext } from "@/components/core/Label";
import { dataVariantProps } from "@/components/core/utils/dataContract";
import { splitFieldHostRest } from "@/components/core/utils/fieldFormDom";
import { useSkinVariant } from "@/skins/skinContext";
 
import { InputClassNamesProvider, InputFieldProvider, InputMotionProvider } from "./inputContext";
import { InputSimpleBody } from "./inputParts";
import type { InputSimpleProps } from "./inputTypes";
import { useInputRootState } from "./useInputRootState";
 
import { cn } from "@/utils/cn";
 
export type {
  InputClassNames,
  InputErrorProps,
  InputHintProps,
  InputLabelProps,
  InputControlProps,
  InputProps,
  InputSimpleProps,
  InputSize,
  InputVariant,
  InputMotion,
  InputPartMotion,
} from "./inputTypes";
 
export { InputControl, InputError, InputHint, InputLabel } from "./inputParts";
 
export const InputRoot = forwardRef(function InputRoot({
  children,
  label,
  hint,
  error,
  invalid,
  className,
  classNames,
  id: idProp,
  required = false,
  size = "base",
  variant,
  motion,
  motionController,
  motionState,
  motionPayload,
  playInitialState,
  ...rest
}: InputSimpleProps, ref: ForwardedRef<HTMLInputElement>) {
  const { host: hostRest, control: controlRest } = splitFieldHostRest(rest);
  const formCtx = useOptionalFormBindingContext();
  const fieldName = typeof controlRest.name === "string" ? controlRest.name : undefined;
  const formError = fieldName ? formCtx?.getError(fieldName) : undefined;
  const resolvedError = error ?? formError;
  const resolvedSize = size ?? "base";
  const resolvedVariant = useSkinVariant(variant);
  const state = useInputRootState({
    children,
    label,
    hint,
    error: resolvedError,
    invalid,
    id: idProp,
    required,
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
      controlProps={{ ...controlRest, variant, motionController, motionState, motionPayload, playInitialState }}
      inputRef={ref}
    />
  );
 
  return (
    <InputFieldProvider value={state.fieldCtx}>
      <InputClassNamesProvider classNames={classNames}>
        <InputMotionProvider
          motion={motion}
          controller={state.isCompound ? motionController : undefined}
          motionState={motionState}
          motionPayload={motionPayload}
          playInitialState={playInitialState}
        >
          <FieldLabelContext.Provider value={state.fieldLabelCtx}>
            <Field
              className={cn(classNames?.root, className)}
              size={resolvedSize}
              {...(state.isCompound ? (rest as HTMLAttributes<HTMLDivElement>) : hostRest)}
              {...dataVariantProps({
                size: resolvedSize,
                variant: resolvedVariant,
              })}
            >
              {body}
            </Field>
          </FieldLabelContext.Provider>
        </InputMotionProvider>
      </InputClassNamesProvider>
    </InputFieldProvider>
  );
});
 
