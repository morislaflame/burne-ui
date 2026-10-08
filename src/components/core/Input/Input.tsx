 
import { useOptionalFormBindingContext } from "@/components/composite/Form/formContext";
import { Field } from "@/components/core/Field";
import { FieldLabelContext } from "@/components/core/Label";
import { dataVariantProps } from "@/components/core/utils/dataContract";
import { useResolvedFieldInvalid, visualStatusForInvalid } from "@/components/core/utils/fieldInvalid";
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
  InputStatus,
  InputVariant,
  InputMotion,
  InputPartMotion,
} from "./inputTypes";
 
export { InputControl, InputError, InputHint, InputLabel } from "./inputParts";
 
export function InputRoot({
  children,
  label,
  hint,
  error,
  invalid,
  className,
  classNames,
  id: idProp,
  required = false,
  status = "default",
  size = "base",
  variant,
  motion,
  motionController,
  motionState,
  motionPayload,
  playInitialState,
  ...rest
}: InputSimpleProps) {
  const formCtx = useOptionalFormBindingContext();
  const fieldName = typeof rest.name === "string" ? rest.name : undefined;
  const formError = fieldName ? formCtx?.getError(fieldName) : undefined;
  const resolvedError = error ?? formError;
  const resolvedSize = size ?? "base";
  const resolvedVariant = useSkinVariant(variant);
  const isInvalid = useResolvedFieldInvalid({
    invalid,
    errorConnected: resolvedError != null,
  });
  const paintedStatus = visualStatusForInvalid(status, isInvalid, "default");
 
  const state = useInputRootState({
    children,
    label,
    hint,
    error: resolvedError,
    invalid,
    id: idProp,
    required,
    status,
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
      controlProps={{ ...rest, variant, motionController, motionState, motionPayload, playInitialState }}
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
              {...dataVariantProps({
                size: resolvedSize,
                variant: resolvedVariant,
                status: paintedStatus,
              })}
            >
              {body}
            </Field>
          </FieldLabelContext.Provider>
        </InputMotionProvider>
      </InputClassNamesProvider>
    </InputFieldProvider>
  );
}
 
