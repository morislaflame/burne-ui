import { Field } from "@/components/core/Field";
import { FieldLabelContext } from "@/components/core/Label";
import { dataVariantProps } from "@/components/core/utils/dataContract";
import { useResolvedFieldInvalid, visualStatusForInvalid } from "@/components/core/utils/fieldInvalid";
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
  TextAreaStatus,
  TextAreaVariant,
  TextAreaMotion,
  TextAreaPartMotion,
} from "./textAreaTypes";
 
export { TextAreaControl, TextAreaError, TextAreaHint, TextAreaLabel } from "./textAreaParts";
 
export function TextAreaRoot({
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
}: TextAreaSimpleProps) {
  const resolvedVariant = useSkinVariant(variant);
  const isInvalid = useResolvedFieldInvalid({
    invalid,
    errorConnected: error != null,
  });
  const paintedStatus = visualStatusForInvalid(status, isInvalid, "default");
  const state = useTextAreaRootState({
    children,
    label,
    hint,
    error,
    invalid,
    id: idProp,
    required,
    status,
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
      status={state.status}
      controlProps={{ ...rest, variant, motionController, motionState, motionPayload, playInitialState }}
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
              {...dataVariantProps({
                size: state.size,
                variant: resolvedVariant,
                status: paintedStatus,
              })}
            >
              {body}
            </Field>
          </FieldLabelContext.Provider>
        </TextAreaMotionProvider>
      </TextAreaClassNamesProvider>
    </TextAreaFieldProvider>
  );
}
 
TextAreaRoot.displayName = "TextArea";
 