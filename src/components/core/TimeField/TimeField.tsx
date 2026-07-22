import { Field } from "@/components/core/Field";
import { FieldLabelContext } from "@/components/core/Label";

import { TimeFieldClassNamesProvider, TimeFieldFieldProvider } from "./timeFieldContext";
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
  TimeFieldProps,
  TimeFieldSize,
  TimeFieldStatus,
  TimeFieldVariant,
} from "./timeFieldTypes";

export { TimeFieldControl, TimeFieldError, TimeFieldHint, TimeFieldLabel } from "./timeFieldParts";

export function TimeFieldRoot({
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
  variant = "default",
  value,
  defaultValue,
  onValueChange,
  format,
  disabled,
  compact = false,
  prefix,
  suffix,
  ...rest
}: TimeFieldProps) {
  const state = useTimeFieldRootState({
    children,
    label,
    hint,
    error,
    id: idProp,
    required,
    status,
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
        size: state.size,
        status: state.status,
        variant: state.variant,
        compact: state.compact,
        prefix,
        suffix,
      }}
    />
  );

  return (
    <TimeFieldFieldProvider value={state.fieldCtx}>
      <TimeFieldClassNamesProvider classNames={classNames}>
        <FieldLabelContext.Provider value={state.fieldLabelCtx}>
          <Field
            className={timeFieldRootClass({
              compact: state.compact,
              slotClass: classNames?.root,
              className,
            })}
            {...rest}
          >
            {body}
          </Field>
        </FieldLabelContext.Provider>
      </TimeFieldClassNamesProvider>
    </TimeFieldFieldProvider>
  );
}

TimeFieldRoot.displayName = "TimeField";
