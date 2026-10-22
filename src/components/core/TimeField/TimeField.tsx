import { forwardRef, useRef, type ForwardedRef } from "react";
import { dataVariantProps } from "@/components/core/utils/dataContract";
import { useFieldControlFocus } from "@/components/core/utils/fieldFormDom";
import { mergeRefs } from "@/components/core/utils/mergeRefs";
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
  TimeFieldVariant,
  TimeFieldMotion,
  TimeFieldPartMotion,
} from "./timeFieldTypes";
 
export { TimeFieldControl, TimeFieldError, TimeFieldHint, TimeFieldLabel } from "./timeFieldParts";
 
export const TimeFieldRoot = forwardRef(function TimeFieldRoot({
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
  value,
  defaultValue,
  onValueChange,
  format,
  disabled,
  readOnly,
  name,
  autoFocus,
  tabIndex,
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
}: TimeFieldProps, ref: ForwardedRef<HTMLDivElement>) {
  const focusRef = useRef<HTMLDivElement>(null);
  useFieldControlFocus(focusRef, autoFocus, tabIndex);
  const state = useTimeFieldRootState({
    children,
    label,
    hint,
    error,
    invalid,
    id: idProp,
    required,
    size,
    variant,
    compact,
  });
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
        readOnly,
        name,
        size: state.size,
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
            ref={mergeRefs(ref, focusRef)}
            {...dataVariantProps({
              size: state.size,
              variant: state.variant,
            })}
          >
            {body}
          </Field>
        </FieldLabelContext.Provider>
        </TimeFieldMotionProvider>
      </TimeFieldClassNamesProvider>
    </TimeFieldFieldProvider>
  );
});
 
TimeFieldRoot.displayName = "TimeField";
 