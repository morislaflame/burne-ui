import {
  TimeFieldControl,
  TimeFieldError,
  TimeFieldHint,
  TimeFieldLabel,
  TimeFieldRoot,
} from "./TimeField";

export const TimeField = Object.assign(TimeFieldRoot, {
  Label: TimeFieldLabel,
  Control: TimeFieldControl,
  Hint: TimeFieldHint,
  Error: TimeFieldError,
});

export type {
  TimeFieldClassNames,
  TimeFieldRootProps,
  TimeFieldControlProps,
  TimeFieldHintProps,
  TimeFieldErrorProps,
  TimeFieldSize,
  TimeFieldStatus,
  TimeFieldVariant,
  TimeFieldFormat,
} from "./timeFieldTypes";

export {
  TimeFieldControl,
  TimeFieldHint,
  TimeFieldError,
  TimeFieldRoot,
} from "./TimeField";

export {
  useTimeFieldContext,
  useOptionalTimeFieldContext,
  useTimeFieldClassNames,
} from "./timeFieldContext";
