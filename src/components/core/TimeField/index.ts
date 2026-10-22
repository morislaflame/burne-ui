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
  TimeFieldLabelProps,
  TimeFieldSize,
  TimeFieldVariant,
  TimeFieldFormat,
  TimeFieldMotion,
  TimeFieldPartMotion,
} from "./timeFieldTypes";
 
export {
  useTimeFieldContext,
  useOptionalTimeFieldContext,
  useTimeFieldClassNames,
} from "./timeFieldContext";
 