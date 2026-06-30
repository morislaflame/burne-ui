import { Label } from "@/components/core/Label";

import {
  TimeFieldControl,
  TimeFieldError,
  TimeFieldHint,
  TimeFieldRoot,
} from "./TimeField";

export const TimeField = Object.assign(TimeFieldRoot, {
  Label,
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
