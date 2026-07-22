import { TimeFieldControl, TimeFieldError, TimeFieldHint, TimeFieldLabel, TimeFieldRoot } from "./TimeField";

export const TimeField = Object.assign(TimeFieldRoot, {
  Label: TimeFieldLabel,
  Control: TimeFieldControl,
  Hint: TimeFieldHint,
  Error: TimeFieldError,
});

export type {
  TimeFieldClassNames,
  TimeFieldProps,
  TimeFieldControlProps,
  TimeFieldHintProps,
  TimeFieldErrorProps,
  TimeFieldSize,
  TimeFieldStatus,
  TimeFieldVariant,
  TimeFieldFormat,
} from "./timeFieldTypes";

export {
  useTimeFieldContext,
  useOptionalTimeFieldContext,
  useTimeFieldClassNames,
} from "./timeFieldContext";
