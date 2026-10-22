import { forwardRef, type ForwardedRef } from "react";
import { useOptionalFormBindingContext } from "@/components/composite/Form/formContext";
import { Field } from "@/components/core/Field";
import { FieldLabelContext } from "@/components/core/Label";
import { dataVariantProps } from "@/components/core/utils/dataContract";
import { splitFieldHostRest } from "@/components/core/utils/fieldFormDom";
import { useSkinVariant } from "@/skins/skinContext";
 
import { TextAreaClassNamesProvider, TextAreaFieldProvider, TextAreaMotionProvider } from "./textAreaContext";
import { TextAreaSimpleBody } from "./textAreaParts";
import type { TextAreaSimpleProps } from "./textAreaTypes";
import { useTextAreaRootState } from "./useTextAreaRootState";
 
import { cn } from "@/utils/cn";
 
export type {
  TextAreaClassNames,
  TextAreaErrorProps,
  TextAreaHintProps,
  TextAreaLabelProps,
  TextAreaControlProps,
  TextAreaProps,
  TextAreaSimpleProps,
  TextAreaSize,
  TextAreaVariant,
  TextAreaMotion,
  TextAreaPartMotion,
} from "./textAreaTypes";
 
export { TextAreaControl, TextAreaError, TextAreaHint, TextAreaLabel } from "./textAreaParts";
 
export const TextAreaRoot = forwardRef(function TextAreaRoot({
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
}: TextAreaSimpleProps, ref: ForwardedRef<HTMLTextAreaElement>) {
  const { host: hostRest, control: controlRest } = splitFieldHostRest(rest);
  const formCtx = useOptionalFormBindingContext();
  const fieldName = typeof controlRest.name === "string" ? controlRest.name : undefined;
  const formError = fieldName ? formCtx?.getError(fieldName) : undefined;
  const resolvedVariant = useSkinVariant(variant);
  const state = useTextAreaRootState({
    children,
    label,
    hint,
    error: error ?? formError,
    invalid,
    id: idProp,
    required,
    size,
  });
 
  const body = state.isCompound ? (
    children
  ) : (
    <TextAreaSimpleBody
      label={state.label}
      hint={state.hint}
      error={state.error}
      textareaId={state.textareaId}
      labelId={state.fieldCtx.labelId}
      size={state.size}
      controlProps={{ ...controlRest, variant, motionController, motionState, motionPayload, playInitialState }}
      textareaRef={ref}
    />
  );
 
  return (
    <TextAreaFieldProvider value={state.fieldCtx}>
      <TextAreaClassNamesProvider classNames={classNames}>
        <TextAreaMotionProvider
          motion={motion}
          controller={state.isCompound ? motionController : undefined}
          motionState={motionState}
          motionPayload={motionPayload}
          playInitialState={playInitialState}
        >
          <FieldLabelContext.Provider value={state.fieldLabelCtx}>
            <Field
              className={cn(classNames?.root, className)}
              size={state.size}
              {...(state.isCompound ? rest : hostRest)}
              {...dataVariantProps({
                size: state.size,
                variant: resolvedVariant,
              })}
            >
              {body}
            </Field>
          </FieldLabelContext.Provider>
        </TextAreaMotionProvider>
      </TextAreaClassNamesProvider>
    </TextAreaFieldProvider>
  );
});
 
TextAreaRoot.displayName = "TextArea";
 