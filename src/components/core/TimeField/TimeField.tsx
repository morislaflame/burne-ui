import { dataVariantProps } from "@/components/core/utils/dataContract";
import { useResolvedFieldInvalid, visualStatusForInvalid } from "@/components/core/utils/fieldInvalid";
import { Field } from "@/components/core/Field";
import { FieldLabelContext } from "@/components/core/Label";
 
import { TimeFieldClassNamesProvider, TimeFieldFieldProvider, TimeFieldMotionProvider } from "./timeFieldContext";
import { TimeFieldSimpleBody } from "./timeFieldParts";
import { timeFieldRootClass } from "./timeFieldStyles";
import type { TimeFieldProps } from "./timeFieldTypes";
import { useTimeFieldRootState } from "./useTimeFieldRootState";
 
export type {
  TimeFieldClassNames,
  TimeFieldControlProps,
  TimeFieldErrorProps,
  TimeFieldFormat,
  TimeFieldHintProps,
  TimeFieldLabelProps,
  TimeFieldProps,
  TimeFieldSize,
  TimeFieldStatus,
  TimeFieldVariant,
  TimeFieldMotion,
  TimeFieldPartMotion,
} from "./timeFieldTypes";
 
export { TimeFieldControl, TimeFieldError, TimeFieldHint, TimeFieldLabel } from "./timeFieldParts";
 
export function TimeFieldRoot({
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
  value,
  defaultValue,
  onValueChange,
  format,
  disabled,
  compact = false,
  prefix,
  suffix,
  segmentSeparator,
  motion,
  motionController,
  motionState,
  motionPayload,
  playInitialState,
  ...rest
}: TimeFieldProps) {
  const state = useTimeFieldRootState({
    children,
    label,
    hint,
    error,
    invalid,
    id: idProp,
    required,
    status,
    size,
    variant,
    compact,
  });
  const isInvalid = useResolvedFieldInvalid({
    invalid,
    errorConnected: error != null,
  });
  const paintedStatus = visualStatusForInvalid(state.status, isInvalid, "default");
 
  const body = state.isCompound ? (
    children
  ) : (
    <TimeFieldSimpleBody
      label={state.label}
      hint={state.hint}
      error={state.error}
      labelId={state.fieldCtx.labelId}
      controlProps={{
        id: state.fieldId,
        value,
        defaultValue,
        onValueChange,
        format,
        disabled,
        size: state.size,
        status: state.status,
        variant: state.variant,
        compact: state.compact,
        prefix,
        suffix,
        segmentSeparator,
        motionController,
        motionState,
        motionPayload,
        playInitialState,
      }}
    />
  );
 
  return (
    <TimeFieldFieldProvider value={state.fieldCtx}>
      <TimeFieldClassNamesProvider classNames={classNames}>
        <TimeFieldMotionProvider
          motion={motion}
          controller={state.isCompound ? motionController : undefined}
          motionState={motionState}
          motionPayload={motionPayload}
          playInitialState={playInitialState}
        >
        <FieldLabelContext.Provider value={state.fieldLabelCtx}>
          <Field
            size={state.size}
            className={timeFieldRootClass({
              compact: state.compact,
              slotClass: classNames?.root,
              className,
            })}
            {...rest}
            {...dataVariantProps({
              size: state.size,
              variant: state.variant,
              status: paintedStatus,
            })}
          >
            {body}
          </Field>
        </FieldLabelContext.Provider>
        </TimeFieldMotionProvider>
      </TimeFieldClassNamesProvider>
    </TimeFieldFieldProvider>
  );
}
 
TimeFieldRoot.displayName = "TimeField";
 